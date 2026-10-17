# 4.9 · Fluxo ponta a ponta

Vamos seguir duas requisições atravessando todas as camadas: uma **HTTP** (síncrona) e uma **mensagem** (assíncrona).

## Cenário

"O lojista cancela um envio que ainda não foi postado. O valor volta para a carteira dele."

## 1. Fluxo HTTP: cancelar envio

```mermaid
sequenceDiagram
    autonumber
    actor L as Lojista
    participant EP as main/entrypoints
    participant RT as presentation/http<br/>shippingRouter
    participant CT as application/controllers<br/>CancelShipmentController
    participant UC as application/usecases<br/>CancelShipmentUseCase
    participant RP as data → infra<br/>ShipmentRepository
    participant AG as domain/entities<br/>Shipment
    participant OB as infra/mutations<br/>outbox

    L->>EP: POST /shipping/v1/shipments/123/cancel
    EP->>RT: rota do módulo
    RT->>CT: execute(request)
    CT->>CT: valida params com schema
    CT->>CT: checa permissão (dono do envio)
    CT->>UC: execute({ shipmentId: '123', reason }, now)
    UC->>RP: findById('123')
    RP-->>UC: Shipment (aggregate)
    UC->>AG: cancel(reason, now)
    AG->>AG: invariante: não pode estar postado
    AG->>AG: status = CANCELLED + registra ShipmentCancelled
    UC->>OB: save(shipment) + eventos (mesma transação)
    UC-->>CT: shipment
    CT-->>L: 200 { shipment: ShipmentDto }
```

### O código de cada parte, enxuto

```ts
// domain/entities/shipment.ts
cancel(reason: string, now: Date) {
  if (this.#status === 'CANCELLED') return                        // idempotente
  if (this.#status !== 'CONTRACTED') throw new DomainError('Only contracted shipments can be cancelled')
  this.#status = 'CANCELLED'
  this.#events.push(new ShipmentCancelled(this.id, this.#sellerId, this.#price, reason, now))
}
```

```ts
// application/usecases/cancel-shipment.ts
export class CancelShipmentUseCase {
  constructor(private readonly shipments: ShipmentRepository) {}

  async execute(input: CancelShipmentUseCase.Input, now: Date) {
    const shipment = await this.shipments.findById(input.shipmentId)
    if (!shipment) throw new NotFoundError('Shipment not found')
    shipment.cancel(input.reason, now)
    await this.shipments.save(shipment) // a implementação grava estado + outbox numa transação
    return shipment
  }
}
```

```ts
// application/controllers/cancel-shipment.ts
async execute(request: CancelShipmentController.Request, now = new Date()) {
  const input = cancelShipmentSchema.parse(request)
  await this.ctx.assertOwnsShipment(input.shipmentId)
  const shipment = await this.usecases.cancel().execute(input, now)
  return { shipment: ShipmentMapper.toDto(shipment) }
}
```

## 2. Fluxo assíncrono: estornar para a carteira

O evento `ShipmentCancelled` sai do outbox, vai para o broker e chega ao módulo **billing**, que credita a carteira.

```mermaid
sequenceDiagram
    autonumber
    participant OB as Outbox relay
    participant BR as Broker
    participant CS as billing/presentation/messaging<br/>consumer
    participant HD as billing/application/handlers<br/>ShipmentCancelledHandler
    participant UC as billing/application/usecases<br/>RefundToWalletUseCase
    participant W as billing/domain<br/>Wallet

    OB->>BR: publica shipment.cancelled.v1
    BR->>CS: entrega a mensagem
    CS->>HD: handle(msg, ack, nack)
    HD->>HD: valida schema da mensagem
    HD->>UC: execute({ sellerId, amount, refId: shipmentId })
    UC->>UC: já processado este refId? (idempotência)
    UC->>W: credit(amount, now)
    UC->>UC: salva carteira + marca refId processado
    HD->>BR: ack()
```

Pontos de arquitetura:
- **Shipping não conhece Billing.** Ele só publica um fato.
- **Billing não lê a tabela de Shipping.** Ele recebe o que precisa no evento.
- O handler é **idempotente**: se a mensagem chegar duas vezes, o estorno acontece uma vez.

## 3. Onde cada responsabilidade ficou

| Responsabilidade | Camada |
|---|---|
| URL, verbo, status HTTP | presentation + controller |
| Formato do input | schema em `data`, aplicado no controller |
| Permissão | controller |
| "Envio existe?" | usecase |
| "Pode cancelar?" | **domain** (aggregate) |
| Persistir estado + evento | infra (repository + outbox) |
| Levar o evento a outro contexto | infra (outbox relay) + broker |
| Reagir ao evento | handler + usecase de outro módulo |
| "Já estornei?" | usecase de billing (idempotência) |
| Creditar sem estourar regras | **domain** de billing (`Wallet.credit`) |

> 💡 Repare: as **duas** decisões de negócio do cenário ("pode cancelar?" e "como creditar?") estão no **domínio**. Todo o resto é orquestração e tecnologia.

# 8.3 · Exercícios

Resolva antes de abrir as respostas. Os exercícios vão do conceito ao design.

---

## Parte A · Conceitos (rápidos)

**A1.** Classifique cada conceito como Value Object ou Entity, num sistema de entregas: `Cep`, `Volume`, `Dinheiro`, `Transportadora`, `Período de coleta`, `Etiqueta`, `Dimensões`.

<details><summary>Resposta</summary>

- **Value Objects:** `Cep`, `Dinheiro`, `Período de coleta`, `Dimensões` (iguais pelo valor, imutáveis).
- **Entities:** `Volume` (rastreado individualmente), `Transportadora` (identidade estável), `Etiqueta` (tem número único e ciclo de vida: emitida, cancelada).

</details>

**A2.** Em que camada fica cada item? (a) `interface PaymentGateway`; (b) `StripePaymentGateway`; (c) regra "desconto máximo de 30%"; (d) `POST /orders`; (e) leitura de pedidos com nome do cliente para uma tela; (f) abrir o pool de conexões.

<details><summary>Resposta</summary>

(a) data · (b) infra/adapters · (c) domain · (d) presentation/http + application/controllers · (e) infra/queries · (f) main (ou uma factory de building-blocks chamada pelo main).

</details>

**A3.** Qual padrão GoF resolve cada problema? (a) adicionar cache a um gateway sem modificá-lo; (b) escolher entre três fórmulas de preço; (c) um pedido muda o que pode fazer conforme o status; (d) integrar o SDK de um parceiro com interface diferente; (e) desfazer ações de um editor; (f) uma árvore de categorias com subcategorias.

<details><summary>Resposta</summary>

(a) Decorator (ou Proxy de cache) · (b) Strategy · (c) State · (d) Adapter · (e) Command (com undo) ou Memento · (f) Composite.

</details>

---

## Parte B · Código

**B1.** Escreva um Value Object `Percentage` que aceite de 0 a 100, com `of(money: Money): Money` e `equals`.

<details><summary>Resposta</summary>

```ts
export class Percentage {
  constructor(readonly value: number) {
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error('Percentage must be between 0 and 100')
  }
  of(amount: Money): Money { return amount.multiply(this.value / 100) }
  equals(other: Percentage) { return this.value === other.value }
}
```

</details>

**B2.** Este código tem quatro problemas de design. Quais?

```ts
class WalletService {
  async debit(walletId: string, amount: number) {
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } })
    if (wallet.balance < amount) throw new Error('error')
    wallet.balance = wallet.balance - amount
    await prisma.wallet.update({ where: { id: walletId }, data: wallet })
    await kafka.send({ topic: 'wallet', messages: [{ value: JSON.stringify(wallet) }] })
  }
}
```

<details><summary>Resposta</summary>

1. **Modelo anêmico:** a regra de saldo está no service, e `wallet.balance` é alterado de fora. Deveria ser `wallet.debit(amount)`.
2. **Dependência direta de infra:** `prisma` e `kafka` concretos no service; deveria depender de `WalletRepository` e `EventPublisher` (DIP).
3. **Escrita dupla sem outbox:** se o `send` falhar, o débito acontece sem evento.
4. **Dinheiro em `number`, erro genérico e evento vazando o aggregate inteiro:** use `Money`, um `DomainError('Insufficient funds')` e um evento `WalletDebited` com só os dados necessários.

Bônus: não há tratamento para carteira inexistente (`wallet` pode ser `null`) nem controle de concorrência.

</details>

**B3.** Refatore o `if` abaixo com Strategy:

```ts
function shippingPrice(type: string, weightKg: number) {
  if (type === 'standard') return weightKg * 5
  if (type === 'express') return weightKg * 9 + 10
  if (type === 'same-day') return weightKg * 15 + 25
  throw new Error('invalid')
}
```

<details><summary>Resposta</summary>

```ts
type ShippingType = 'standard' | 'express' | 'same-day'
type PriceStrategy = (weightKg: number) => number

const STRATEGIES: Record<ShippingType, PriceStrategy> = {
  standard: (kg) => kg * 5,
  express: (kg) => kg * 9 + 10,
  'same-day': (kg) => kg * 15 + 25,
}

export const shippingPrice = (type: ShippingType, weightKg: number) => STRATEGIES[type](weightKg)
```

O tipo `ShippingType` faz o compilador recusar tipos inválidos, e `Record` obriga a cobrir todos.

</details>

**B4.** Escreva o aggregate `Coupon` com: código, percentual, data de validade, limite de usos e `redeem(now)` que lança erro se expirado ou esgotado.

<details><summary>Resposta</summary>

```ts
export class Coupon {
  #uses = 0

  constructor(
    readonly code: string,
    readonly discount: Percentage,
    readonly validity: Period,
    readonly maxUses: number,
    uses = 0,
  ) {
    if (!/^[A-Z0-9]{4,20}$/.test(code)) throw new DomainError('Invalid coupon code')
    if (!Number.isInteger(maxUses) || maxUses <= 0) throw new DomainError('maxUses must be positive')
    this.#uses = uses
  }

  get uses() { return this.#uses }
  get isExhausted() { return this.#uses >= this.maxUses }

  redeem(now: Date) {
    if (!this.validity.contains(now)) throw new DomainError('Coupon expired')
    if (this.isExhausted) throw new DomainError('Coupon exhausted')
    this.#uses++
  }
}
```

Ponto de atenção: com muitos pedidos simultâneos, o limite de usos exige **controle de concorrência** (optimistic locking na versão do cupom).

</details>

---

## Parte C · Design

**C1.** Uma empresa de assinaturas tem: cadastro de clientes, planos e preços, cobrança recorrente, envio de e-mails, emissão de nota fiscal, suporte. Classifique os subdomínios e proponha os bounded contexts.

<details><summary>Resposta (uma possível)</summary>

| Subdomínio | Tipo | Estratégia |
|---|---|---|
| Planos, preços, promoções | **Core** | Construir com DDD tático completo |
| Cobrança recorrente | Supporting (pode ser core se for diferencial) | Construir, integrando com um gateway |
| Emissão de nota | Supporting | Integração via ACL com provedor fiscal |
| Clientes e identidade | Generic | Produto pronto (auth) + cadastro simples |
| E-mails | Generic | Serviço pronto |
| Suporte | Generic | Ferramenta de mercado |

Contexts: `catalog` (planos e preços), `subscriptions` (ciclo de vida da assinatura), `billing` (cobranças), `invoicing` (notas), `identity`. Integração por eventos: `SubscriptionActivated` → billing; `PaymentConfirmed` → invoicing.

</details>

**C2.** "Quando o pagamento de um pedido for aprovado, reservar o estoque e, se não houver estoque, estornar o pagamento." Desenhe a solução: aggregates, eventos, quem orquestra, e o que acontece se uma etapa falhar.

<details><summary>Resposta (uma possível)</summary>

- Aggregates: `Order` (vendas), `Payment` (cobrança), `StockItem` (estoque). **Três aggregates, três transações.**
- Fluxo (saga orquestrada):
  1. `PaymentApproved` → orquestrador envia `ReserveStock`.
  2. `StockReserved` → `Order.confirm()` → `OrderConfirmed`.
  3. `StockUnavailable` → compensação `RefundPayment` → `PaymentRefunded` → `Order.cancel('no stock')`.
- Garantias: outbox em cada contexto; handlers idempotentes; a saga persiste o estado (State pattern).
- Alternativa: reservar estoque **antes** de cobrar, evitando estornos (decisão de negócio a discutir).

</details>

**C3.** Seu time quer adotar CQRS com bancos separados e Event Sourcing para um CRUD de cadastro de produtos com 3 telas. O que você diria?

<details><summary>Resposta</summary>

Que o custo provavelmente supera o benefício: consistência eventual, infraestrutura extra e curva de aprendizado num domínio sem regra rica. Proposta: CQRS **nível 1** (Query/Mutation separados, mesmo banco), modelo simples, e um ADR registrando a decisão e o gatilho para reavaliar (ex.: leitura 100× maior que escrita, ou necessidade de auditoria completa).

</details>

---

## Parte D · Desafio de projeto

Implemente, sem banco e sem framework, o módulo **"cotação de frete"**:

1. `data`: schema da requisição (CEP origem/destino, volumes com peso e dimensões) e interface `CarrierQuoteGateway`.
2. `domain`: VOs `Postcode`, `Dimensions`, `Weight`, `Money`; entity `Volume` com `billableWeight()` (o maior entre peso real e cubado = C × L × A / 6000); aggregate `QuoteRequest` (1 a 20 volumes); domain service `BestQuoteSelector` com Strategy (mais barato, mais rápido).
3. `infra`: dois adapters **fake** de transportadoras que devolvem formatos diferentes (ACL); decorator de cache em memória.
4. `application`: `QuoteFreightUseCase` que consulta todas as transportadoras em paralelo, ignora as que falharem e escolhe a melhor.
5. **Testes:** VOs, `Volume.billableWeight`, limite de volumes, seleção por estratégia, usecase com uma transportadora falhando.

Critério de pronto: `bun test` (ou `vitest`) verde, nenhum import de `infra` dentro de `domain`, e você consegue explicar onde está cada regra.

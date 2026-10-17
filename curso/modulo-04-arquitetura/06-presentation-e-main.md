# 4.6 · Presentation e Main

## Presentation: a interface pública do módulo

> Recebe requisições e mensagens, interpreta e **encaminha** para a application (controllers e handlers). Não tem regra de negócio.

Vantagens: trocar a forma de entrada (REST → gRPC, RabbitMQ → Kafka) sem tocar no núcleo; organização clara por canal; testes simulando entrada.

### HTTP: routers

O **router** agrupa os endpoints de um módulo e aponta cada um para o seu controller.

```ts
// modules/shipping/presentation/http/shipping-router.ts
const controllers = ShippingControllerFactory.http()
export const shippingRouter = HttpAdapter.router()

shippingRouter.get('/v1/shipments/:id', controllers.getShipment)
shippingRouter.post('/v1/shipments', controllers.createShipment)
shippingRouter.post('/v1/shipments/:id/cancel', controllers.cancelShipment)
```

- Cada módulo expõe **seu próprio router** → escalável.
- O framework (Express, Fastify, Hono) fica atrás de um `HttpAdapter` → plugável.
- Middlewares podem ser aplicados por rota, por módulo ou globalmente.

### Messaging: consumers

O **consumer** é o equivalente do router para filas: escuta um tópico e entrega a mensagem a um handler.

```ts
// modules/shipping/presentation/messaging/consumers.ts
export async function shippingConsumers(consumer: Consumer, handlers: ShippingHandlerFactory) {
  await consumer.connect('shipping-service')
  consumer.consume('shipment.status-updated', (msg, ack, nack) =>
    handlers.statusUpdated().handle(msg, ack, nack),
  )
}
```

| Tipo de consumer | Mensagem | Exemplo |
|---|---|---|
| **Command consumer** | Pede uma ação | "Criar envio" |
| **Event consumer** | Informa um fato | "Pagamento aprovado" |
| **Stream consumer** | Fluxo contínuo de alto volume | Telemetria, logs |

Boas práticas: validar a entrada (mesmo vinda da fila), tratar erros com retry/nack/DLQ, registrar métricas, garantir **idempotência**.

---

## Main: a camada que liga tudo

> O **composition root**: a parte mais externa, que configura e conecta as dependências, sobe servidores e listeners. **Depende de todas as camadas, e nenhuma depende dela.** Não tem regra de negócio.

```text
src/main/
├── app.ts            ← monta a aplicação (factories, routers, consumers)
├── server.ts         ← sobe o servidor HTTP
├── boot.ts           ← ordem de inicialização
├── entrypoints/
│   ├── http.ts       ← registra os routers dos módulos
│   └── workers.ts    ← registra os consumers dos módulos
├── hooks/
│   ├── warmup.ts     ← antes de aceitar tráfego
│   ├── shutdown.ts   ← encerramento gracioso
│   └── lifecycle.ts
└── middlewares/
```

### Entrypoint

O primeiro componente que recebe a solicitação externa. Só **aponta** para a próxima camada.

| Tipo de aplicação | Entrypoint típico |
|---|---|
| API REST | Router → controller |
| CLI | Comando `main.ts` |
| Worker | Consumer de fila |
| GraphQL | Resolver |
| Serverless | Função `handler()` |

```ts
// main/entrypoints/http.ts
const router = HttpAdapter.router()
router.use('/status', statusRouter)
router.use('/shipping', shippingRouter)
router.use('/pricing', pricingRouter)
```

### Composition root em código

```ts
// main/app.ts
export function buildApp(env: Env) {
  const orm = createOrm(env.DATABASE_URL)
  const publisher = new OutboxEventPublisher(orm)

  const shippingRepositories = new ShippingDatabaseRepositoryFactory(orm)
  const shippingUseCases = new ShippingUseCaseFactory(shippingRepositories, publisher)
  const shippingControllers = new ShippingControllerFactory(shippingUseCases)

  return { shippingControllers /* , ...outros módulos */ }
}
```

Nos testes, o mesmo `buildApp` pode receber factories de memória.

### Hooks de ciclo de vida

Funções executadas antes ou depois do runtime principal.

| Hook | Para quê |
|---|---|
| **warmup** | Conectar banco e broker, aquecer caches, **só então** aceitar tráfego (readiness) |
| **shutdown** | Parar de aceitar requisições, terminar as em andamento, fechar conexões (evita perder dados) |
| **lifecycle** | Health checks, liveness, métricas de boot |

```ts
// main/hooks/shutdown.ts
export function registerShutdown(server: Server, resources: Closable[]) {
  const close = async (signal: string) => {
    log.info({ signal }, 'shutting down')
    server.close()                                    // 1. para de aceitar tráfego
    await Promise.allSettled(resources.map((r) => r.close())) // 2. fecha conexões
    process.exit(0)
  }
  process.on('SIGTERM', close)
  process.on('SIGINT', close)
}
```

> 🏛️ Hooks evitam *race conditions* no boot, perda de dados ao encerrar e preparam o serviço para Kubernetes (readiness/liveness) e serverless (warmup).

## Para fixar

1. Por que a presentation não tem regra de negócio?
2. O que significa "nenhuma camada depende do main"?
3. O que o hook de shutdown faz, e em que ordem?

<details>
<summary>Respostas</summary>

1. Para que trocar a forma de entrada (REST, gRPC, fila) não exija mexer na regra.
2. Nenhum arquivo fora de `main` importa algo de `main`. Ele é o ponto mais externo, que monta o resto.
3. Para de aceitar tráfego, espera as requisições em andamento, fecha conexões (banco, broker) e encerra o processo.

</details>

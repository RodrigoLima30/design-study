# 13 — Erratas e inconsistências nas fontes

Ao ler os dois repositórios com atenção, apareceram erros e contradições. **Nada em `sources/` foi corrigido**, para manter a fonte intacta. Esta lista serve para você não aprender uma coisa errada e para poder avisar o autor.

Severidade: **A** = pode confundir o aprendizado; **B** = erro de digitação ou de código ilustrativo.

## Conceituais

| # | Sev. | Onde | Problema | Como tratar aqui |
|---|:-:|---|---|---|
| 1 | A | `ddd/ddd-architecture.md` | "camadas externas **nunca conhecem as internas**, mas podem se comunicar por meio de contratos". Está invertido em relação à regra normal (e ao resto das fontes): são as camadas **internas** que não conhecem as externas | Seguimos `data-layer.md`, `infra-layer.md` e `main-layer.md`, que descrevem a regra correta ([08](08-dependencias-e-nomenclatura.md)) |
| 2 | A | `ddd/ddd-architecture-layout.md` x `ddd-architecture-programming-paradigm.md` | O layout põe **Data dentro de Modules**; a árvore do paradigma lista **Data (layer) fora**, no nível do sistema. Presentation também aparece nos dois níveis | Tratamos `data` como camada de módulo, e `building-blocks/data` como a versão genérica |
| 3 | A | `application-layer-usecase-folder.md` x `application-layer-orchestrator-folder.md` | Regra "Use Case não chama Use Case", mas o exemplo do Orchestrator injeta `StartTrackingUseCase` e `LogFreightHistoryUseCase` | Registrado como dúvida para o autor ([05](05-application.md)) |
| 4 | A | `ddd-architecture-layout.md` x `application-layer-factory-folder.md` | Os exemplos importam usecases de `@modules/routes/domain/usecases`, mas usecase é da camada **application** | Usamos `application/usecases` |
| 5 | B | `ddd-architecture-programming-paradigm.md` | A lista do domain omite **Mapper**, que está no layout e tem doc próprio | Consideramos Mapper parte do domain |
| 6 | B | `domain-layer-entity-folder.md` | Entities importam de `@building-blocks/value-objects/...` e `@building-blocks/schemas/...`; o layout diz que VO fica em domain e schemas em data | Interpretado como VOs e schemas **genéricos** em building-blocks |

## Arquivos trocados ou duplicados em `design-patterns`

| # | Sev. | Arquivo | Problema |
|---|:-:|---|---|
| 7 | A | `docs/design-patterns-structural-decorator.md` | O título e o conteúdo são de **Facade** |
| 8 | A | `docs/design-patterns-structural-facade.md` | O título e o conteúdo são de **Decorator** |
| 9 | B | `docs/design-patterns-creational-prototype.md` | O título é "Design Patterns - Creational - **Builder**" |
| 10 | B | `docs/design-patterns-behavioral-command.md`, `-interpreter.md`, `-iterator.md` | O conteúdo aparece **duplicado** no mesmo arquivo (os títulos H1 se repetem) |
| 11 | B | `docs/design-patterns-behavioral-visitor.md`, `-mediator.md` | Sem seção "Aplicabilidade" |

## Código ilustrativo que não compilaria

Os trechos de documentação são ilustrativos. Os problemas abaixo servem de alerta para quem copiar:

| # | Onde | Problema |
|---|---|---|
| 12 | `data-layer.md` | `export enum PEGAKI_STATE_CODE = { ... }`: enum não usa `=` |
| 13 | `data-layer.md` | `z.infer<typeof LocationSchema>` mas o schema se chama `locationSchema` (maiúscula x minúscula). O mesmo para `GeolocationSchema` e `AddressSchema` |
| 14 | `domain-layer-value-object-folder.md` | `PostCode`: usa `postCode.replace(...)`, mas o parâmetro se chama `payload` |
| 15 | `domain-layer-entity-folder.md` | `Zone.id` declara `string` mas retorna `new ZoneId(...)` |
| 16 | `application-layer-handle-folder.md` | `import { ... } from @modules/...` sem aspas |
| 17 | `application-layer-factory-folder.md` | `FreightHandlersFactory.freight()` devolve uma nova `FreightHandlersFactory` |
| 18 | `application-layer-controller-folder.md` | O construtor usa os tipos `RepositoryFactory` e `UseCaseFactory`, mas os imports são `FreightRepositoryFactory` e `FreightUseCaseFactory` |
| 19 | `building-blocks-layer-adapter-folder.md` | `KafkaConsumer` e `RabbitMQConsumer`: o `set consumer` atribui a `this.consumer` dentro do próprio setter (recursão infinita) e declara retorno `void` (setters não declaram retorno) |
| 20 | `building-blocks-layer-factory-folder.md` | `channel(): Promise<Consumer>` retorna um `Consumer` sem `Promise`, e `RabbitMQConsumer()` é chamado sem `new` |
| 21 | `domain-layer-service-folder.md` | `GoogleMapsDistanceStrategy.calculate` é `async` (`Promise<number>`), mas `FreightCalculationService` o usa como se retornasse `number` |
| 22 | `cqrs/*.ts` | `GetLastBalanceCommandHandler` importa `'./BalanceRepository'` e `'./CommandHandler'`, mas os arquivos são `.d.ts` e outros imports usam `'./CommandHandler.d'`. `BalanceRepositoryMemory` não declara `implements BalanceRepository` |

## Menores

- Nomes: "Martin **Fawler**" (Fowler), "Abstract **Factoring**" (Factory), "Proxing" (Proxy) no `README.md`.
- O link de "Robert Cecil Martin (Uncle Bob)" no `README.md` do design-architecture aponta para `martinfowler.com`.
- `ddd-architecture-layout.md`: "Handler: classe **simular** ao um Controller" (similar a um).
- O `package.json` do repo `design-patterns` fixa Node 14.17.3, Jest 27 e TypeScript 4.5, versões antigas para hoje. O `package.json` do repo `design-architecture` também se chama `design-patterns`.

## Como usar esta lista

Antes de reproduzir um trecho das fontes, confira se ele aparece aqui. O exemplo executável de [`examples/carrier-coverage-ddd`](../examples/carrier-coverage-ddd) segue as **regras** das fontes, mas com código corrigido e testado por quem rodar `bun test`.

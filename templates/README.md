# Templates

Esqueletos para copiar ao criar cada peça. Troque `Thing` pelo nome do seu conceito e apague o que não usar.

| Arquivo | Peça | Camada | Explicação |
|---|---|---|---|
| [`data.ts`](data.ts) | Schema, tipos e contratos | data | [4.2](../curso/modulo-04-arquitetura/02-modelo-em-camadas.md) |
| [`value-object.ts`](value-object.ts) | Value Object | domain | [3.2](../curso/modulo-03-ddd-tatico/02-value-object.md) |
| [`aggregate-root.ts`](aggregate-root.ts) | Entity / Aggregate Root com eventos | domain | [3.3](../curso/modulo-03-ddd-tatico/03-entity.md), [3.4](../curso/modulo-03-ddd-tatico/04-aggregate.md) |
| [`domain-event.ts`](domain-event.ts) | Domain Event | domain | [3.6](../curso/modulo-03-ddd-tatico/06-domain-event.md) |
| [`memory-repository.ts`](memory-repository.ts) | Repository em memória (fake) | infra | [3.8](../curso/modulo-03-ddd-tatico/08-repository.md) |
| [`usecase.ts`](usecase.ts) | Usecase | application | [4.4](../curso/modulo-04-arquitetura/04-camada-application.md) |
| [`controller.ts`](controller.ts) | Controller | application | [4.4](../curso/modulo-04-arquitetura/04-camada-application.md) |
| [`handler.ts`](handler.ts) | Handler de mensagem | application | [4.4](../curso/modulo-04-arquitetura/04-camada-application.md), [5.3](../curso/modulo-05-cqrs-eventos-mensageria/03-mensageria.md) |
| [`factories.ts`](factories.ts) | Factories de repositórios e usecases | infra / application | [4.5](../curso/modulo-04-arquitetura/05-camada-infra.md) |
| [`usecase.test.ts`](usecase.test.ts) | Teste de usecase com fakes | — | [7.1](../curso/modulo-07-testes/01-estrategia.md) |
| [`adr.md`](adr.md) | Registro de decisão de arquitetura | docs | [4.11](../curso/modulo-04-arquitetura/11-decisoes-e-tradeoffs.md) |

Os arquivos `.ts` são esqueletos ilustrativos: os imports apontam para os caminhos da [estrutura de pastas](../curso/modulo-04-arquitetura/08-estrutura-de-pastas.md) e podem precisar de ajuste no seu projeto.

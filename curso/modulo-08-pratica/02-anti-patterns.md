# 8.2 · Anti-patterns: o que evitar

Cada anti-pattern abaixo tem: o **sintoma**, o **dano** e a **correção**.

## No domínio

### Anemic Domain Model
- **Sintoma:** entities só com getters e setters; toda regra em `XService`.
- **Dano:** regras espalhadas e fáceis de burlar.
- **Correção:** mova as regras para métodos de negócio da entity ([3.10](../modulo-03-ddd-tatico/10-modelo-rico-vs-anemico.md)).

### Primitive Obsession
- **Sintoma:** `string` para e-mail, CEP, CPF; `number` para dinheiro.
- **Dano:** validação repetida (ou esquecida), troca acidental de parâmetros.
- **Correção:** Value Objects ([3.2](../modulo-03-ddd-tatico/02-value-object.md)).

### God Aggregate
- **Sintoma:** `Customer` carrega pedidos, endereços, pagamentos, tickets...
- **Dano:** lento, cheio de conflitos de concorrência.
- **Correção:** aggregates pequenos, referência por ID, consistência eventual ([3.4](../modulo-03-ddd-tatico/04-aggregate.md)).

### Setter de status
- **Sintoma:** `order.status = 'SHIPPED'`.
- **Dano:** transições inválidas, sem eventos, sem regras.
- **Correção:** métodos de intenção (`order.ship()`) e, se houver muitos estados, o padrão [State](../modulo-06-design-patterns/comportamentais/state.md).

### Domínio com I/O
- **Sintoma:** `await prisma...` ou `fetch` dentro de entity ou domain service.
- **Dano:** testes lentos e frágeis, domínio preso à tecnologia.
- **Correção:** a application busca os dados e passa ao domínio.

## Na aplicação

### Fat Controller
- **Sintoma:** controller com 200 linhas de regra, SQL e chamadas HTTP.
- **Dano:** impossível reutilizar a lógica por outra entrada (fila, CLI).
- **Correção:** controller valida, autoriza e delega ao usecase.

### Usecase chamando usecase
- **Sintoma:** `await this.createUser.execute(...)` dentro de outro usecase.
- **Dano:** cadeias difíceis de seguir, transações aninhadas, ciclos.
- **Correção:** extraia a parte comum para Orchestrator ou Service ([4.4](../modulo-04-arquitetura/04-camada-application.md)).

### Transaction Script disfarçado
- **Sintoma:** um usecase enorme que faz tudo em sequência com `if`s, e entities vazias.
- **Dano:** é o anêmico visto de cima.
- **Correção:** o usecase orquestra; as decisões estão no domínio.

## Na infra e na integração

### Banco compartilhado entre contextos
- **Sintoma:** o módulo de logística faz `SELECT` na tabela `orders` de vendas.
- **Dano:** acoplamento invisível; ninguém pode mudar o próprio schema.
- **Correção:** eventos ou API; cada contexto com seus dados ([2.4](../modulo-02-ddd-estrategico/04-bounded-contexts.md)).

### Generic Repository
- **Sintoma:** `BaseRepository<T>` com `update(id, partial)` usado por todos.
- **Dano:** permite pular invariantes com updates parciais; viola ISP.
- **Correção:** um repository por aggregate, com métodos da linguagem do domínio.

### Publicar sem outbox
- **Sintoma:** `await save(); await publish();`.
- **Dano:** eventos perdidos quando o broker falha.
- **Correção:** Transactional Outbox ([5.3](../modulo-05-cqrs-eventos-mensageria/03-mensageria.md)).

### Consumidor não idempotente
- **Sintoma:** `balance += amount` a cada mensagem recebida.
- **Dano:** crédito em dobro quando a mensagem é reentregue.
- **Correção:** registro de mensagens processadas ou operações idempotentes.

## Na arquitetura

### Distributed Monolith
- **Sintoma:** microserviços que precisam ser implantados juntos e se chamam em cadeia síncrona.
- **Dano:** a complexidade de distribuído **sem** a independência.
- **Correção:** fronteiras por bounded context; comunicação assíncrona; comece com monolito modular.

### Architecture Astronaut (over-engineering)
- **Sintoma:** CQRS, Event Sourcing, Kafka e 7 camadas num CRUD de três telas.
- **Dano:** lentidão de entrega e curva de aprendizado sem retorno.
- **Correção:** estrutura proporcional ao problema; registre a aposta num ADR ([4.11](../modulo-04-arquitetura/11-decisoes-e-tradeoffs.md)).

### Big Ball of Mud
- **Sintoma:** qualquer arquivo importa qualquer outro.
- **Dano:** toda mudança é arriscada.
- **Correção:** módulos, regra de dependência **automatizada** no CI ([4.3](../modulo-04-arquitetura/03-regra-de-dependencia.md)).

### `utils` / `shared` gigante
- **Sintoma:** `shared/utils.ts` com 2.000 linhas.
- **Dano:** dependência de tudo para todos; ninguém é dono.
- **Correção:** devolva cada função ao seu dono (VO, módulo, building-block).

## Nos padrões

| Abuso | Sintoma | Correção |
|---|---|---|
| **Singleton como global** | `X.getInstance()` em todo lugar | Crie no main e injete |
| **Patternitis** | Factory de Factory de Strategy para um `if` | Só aplique quando nomear a dor |
| **Service Locator no núcleo** | `container.get('repo')` dentro do usecase | Injeção pelo construtor |
| **Herança profunda** | 5 níveis de subclasses | Composição (Strategy, Decorator) |
| **Mediator/Facade deus** | Uma classe que conhece o sistema inteiro | Quebre por responsabilidade |

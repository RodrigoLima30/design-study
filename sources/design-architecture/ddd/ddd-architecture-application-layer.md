# Application (layer)

A camada application é uma peça central em arquiteturas como Clean Architecture, Hexagonal Architecture (Ports & Adapters) e DDD (Domain-Driven Design).

Ela é responsável por orquestrar os casos de uso da aplicação, ou seja, coordenar como os componentes do sistema interagem para atender uma necessidade de negócio.

### O que é esta camada?

A camada application representa o coração da lógica de orquestração de processos, servindo de ponte entre a interface do sistema (UI/API) e o domínio (regras de negócio).

## Responsabilidades

### O que ela faz

- Coordena a execução de casos de uso específicos;
- Orquestra Services, Orchestrators, Repositories, Queries, Mutation, domínios, etc;
- Aplica regras de aplicação, como: “após criar um frete, envie um evento”;
- Garante separação de contexto entre infraestrutura e domínio.

### O que ela não faz

- Não implementa regras de negócio complexas (isso é papel do domínio);
- Não acessa diretamente o banco de dados (isso é papel da infraestrutura);
- Não contém lógica de exibição (isso é papel da camada de interface, como controller ou UI).

---

- Service
- Orchestrator
- Usecase
- Controller
- Handler
- Factory

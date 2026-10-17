# 12 — Glossário

Termos em ordem alfabética. Entre parênteses, onde o termo é tratado.

| Termo | Definição curta |
|---|---|
| **Abstract Factory** | Interface para criar famílias de objetos compatíveis entre si ([10](10-design-patterns.md)) |
| **Ack / Nack** | Confirmação ou rejeição de uma mensagem de fila ([06](06-presentation-main-building-blocks.md)) |
| **Adapter** | Classe que padroniza o uso de um driver ou converte uma interface em outra ([04](04-infra.md)) |
| **Aggregate** | Conjunto de entities e value objects tratado como unidade de consistência ([03](03-data-e-domain.md)) |
| **Aggregate Root** | A entity de entrada do aggregate. Só se muda o conjunto por ela |
| **Application Service** | Classe reutilizável de alto nível, com persistência ([05](05-application.md)) |
| **Building blocks** | Camada de blocos técnicos reutilizáveis entre módulos ([06](06-presentation-main-building-blocks.md)) |
| **Bounded context** | Fronteira dentro da qual um modelo de domínio tem significado único. Citado como estratégia para exportar `data` como package |
| **Clean Architecture** | Arquitetura de Uncle Bob. Uma das inspirações da Super Architecture ([01](01-visao-geral.md)) |
| **Command** | Intenção de alterar estado, que não retorna dados ([11](11-cqrs-e-event-sourcing.md)) |
| **Composition root** | Ponto onde as dependências são montadas. É o papel do `main` ([06](06-presentation-main-building-blocks.md)) |
| **Consumer** | Componente que escuta fila, tópico ou stream ([06](06-presentation-main-building-blocks.md)) |
| **Context** | Entities ou aggregates que controlam dados comuns. Sem pasta ([03](03-data-e-domain.md)) |
| **Controller** | Porta de entrada HTTP na application; delega a um usecase ([05](05-application.md)) |
| **CQRS** | Segregação de responsabilidade entre comandos e consultas ([11](11-cqrs-e-event-sourcing.md)) |
| **CQS** | Command Query Separation, de Bertrand Meyer. Base do CQRS |
| **Data** | Camada mais baixa: tipos, enums, constantes, schemas, contratos ([03](03-data-e-domain.md)) |
| **Domain** | Camada do núcleo de negócio ([03](03-data-e-domain.md)) |
| **Domain Factory** | Classe que gera instâncias do domínio e controla dependências ([03](03-data-e-domain.md)) |
| **Domain Service** | Regra de negócio pura, sem estado e sem persistência ([03](03-data-e-domain.md)) |
| **DTO** | Data Transfer Object: estrutura simples para trafegar dados entre camadas |
| **Entity** | Objeto com identidade única e comportamento ([03](03-data-e-domain.md)) |
| **Entrypoint** | Ponto que recebe a solicitação externa e a aponta para a presentation ([06](06-presentation-main-building-blocks.md)) |
| **Event Sourcing** | Estado derivado de uma sequência de eventos ([11](11-cqrs-e-event-sourcing.md)) |
| **Factory** | Classe que centraliza a criação de objetos ([10](10-design-patterns.md)) |
| **GoF** | Gang of Four: Gamma, Helm, Johnson, Vlissides. Autores do livro de 1995 |
| **Handler** | Equivalente do Controller para mensageria ([05](05-application.md)) |
| **Helper** | Função estática de baixo nível. Evite ([03](03-data-e-domain.md)) |
| **Hexagonal Architecture** | Também chamada Ports & Adapters. Inspiração da arquitetura |
| **Hook** | Função de ciclo de vida: warmup, shutdown ([06](06-presentation-main-building-blocks.md)) |
| **Idempotência** | Processar a mesma mensagem duas vezes não causa inconsistência ([06](06-presentation-main-building-blocks.md)) |
| **Infra** | Camada que fala com o mundo externo ([04](04-infra.md)) |
| **Invariante** | Regra que precisa ser verdadeira durante toda a vida do objeto ([03](03-data-e-domain.md)) |
| **Mapper** | Transforma dados de um formato para outro ([03](03-data-e-domain.md)) |
| **Module** | Pasta que agrupa as camadas de uma funcionalidade (freight, auth, routes) ([02](02-estrutura-de-pastas.md)) |
| **Mutation** | Repository especializado em uma operação de escrita ([04](04-infra.md)) |
| **Onion Architecture** | Camadas concêntricas com o domínio no centro. Inspiração |
| **Orchestrator** | Coordena vários services numa sequência reutilizável ([05](05-application.md)) |
| **Presentation** | Camada que liga requisições e mensagens à application ([06](06-presentation-main-building-blocks.md)) |
| **Query** | Repository especializado em uma operação de leitura ([04](04-infra.md)) |
| **Repository** | Abstração de acesso a dados com CRUD ([04](04-infra.md)) |
| **Router** | Agrupa rotas HTTP por módulo ([06](06-presentation-main-building-blocks.md)) |
| **Schema** | Descrição de formato com validação (zod). Vive em `data` ([03](03-data-e-domain.md)) |
| **Service Locator** | Componente que entrega a instância certa de um serviço. A factory de consumer age assim ([06](06-presentation-main-building-blocks.md)) |
| **Shared** | Recursos comuns que não couberam em outra camada ([06](06-presentation-main-building-blocks.md)) |
| **Singleton** | Padrão de instância única ([10](10-design-patterns.md)) |
| **Super Architecture** | Nome da arquitetura backend da Super Frete ([01](01-visao-geral.md)) |
| **Teste de memória** | Teste que usa repositórios em memória no lugar do banco ([09](09-testes.md)) |
| **Usecase** | Classe que orquestra uma ação de negócio específica ([05](05-application.md)) |
| **Value Object** | Valor imutável, auto-validado, comparado por conteúdo ([03](03-data-e-domain.md)) |
| **Vertical Slices** | Organizar o código por funcionalidade completa em vez de por tipo técnico. Inspiração, e explica o conceito de `modules` |

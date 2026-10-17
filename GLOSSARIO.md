# Glossário

Termos em ordem alfabética, com o link para onde são explicados.

| Termo | Definição | Onde |
|---|---|---|
| **Abstract Factory** | Cria famílias de objetos compatíveis entre si | [6](curso/modulo-06-design-patterns/criacionais/abstract-factory.md) |
| **Ack / Nack** | Confirmar ou rejeitar o processamento de uma mensagem | [5.3](curso/modulo-05-cqrs-eventos-mensageria/03-mensageria.md) |
| **ACL (Anticorruption Layer)** | Camada que traduz o modelo de outro contexto para o seu | [2.5](curso/modulo-02-ddd-estrategico/05-context-mapping.md) |
| **Adapter** | Converte uma interface na interface esperada; na arquitetura, isola uma tecnologia | [6](curso/modulo-06-design-patterns/estruturais/adapter.md), [4.5](curso/modulo-04-arquitetura/05-camada-infra.md) |
| **ADR** | Architecture Decision Record: registro curto de uma decisão | [4.11](curso/modulo-04-arquitetura/11-decisoes-e-tradeoffs.md) |
| **Aggregate** | Grupo de objetos tratado como unidade de consistência | [3.4](curso/modulo-03-ddd-tatico/04-aggregate.md) |
| **Aggregate Root** | A entity de entrada do aggregate; protege as invariantes | [3.4](curso/modulo-03-ddd-tatico/04-aggregate.md) |
| **Application Service** | Classe da application que resolve uma necessidade pequena e reutilizável | [4.4](curso/modulo-04-arquitetura/04-camada-application.md) |
| **At least once** | Garantia de entrega que pode duplicar mensagens | [5.3](curso/modulo-05-cqrs-eventos-mensageria/03-mensageria.md) |
| **Bounded Context** | Fronteira onde um modelo e sua linguagem são consistentes | [2.4](curso/modulo-02-ddd-estrategico/04-bounded-contexts.md) |
| **Bridge** | Separa abstração e implementação em hierarquias independentes | [6](curso/modulo-06-design-patterns/estruturais/bridge.md) |
| **Building blocks** | Camada técnica, reutilizável e independente de negócio | [4.7](curso/modulo-04-arquitetura/07-building-blocks-e-shared.md) |
| **Builder** | Monta um objeto complexo passo a passo | [6](curso/modulo-06-design-patterns/criacionais/builder.md) |
| **Chain of Responsibility** | Passa a solicitação por uma cadeia de tratadores | [6](curso/modulo-06-design-patterns/comportamentais/chain-of-responsibility.md) |
| **Clean Architecture** | Camadas concêntricas com a regra de dependência para dentro | [4.1](curso/modulo-04-arquitetura/01-estilos-arquiteturais.md) |
| **Coesão** | O quanto as partes de um módulo pertencem juntas | [1.1](curso/modulo-01-fundamentos/01-complexidade-acoplamento-coesao.md) |
| **Command** | Intenção de mudar estado; padrão que encapsula uma solicitação em objeto | [6](curso/modulo-06-design-patterns/comportamentais/command.md), [5.1](curso/modulo-05-cqrs-eventos-mensageria/01-cqs-e-cqrs.md) |
| **Composite** | Árvores parte-todo tratadas de forma uniforme | [6](curso/modulo-06-design-patterns/estruturais/composite.md) |
| **Composition root** | Ponto onde as dependências são montadas (o `main`) | [4.6](curso/modulo-04-arquitetura/06-presentation-e-main.md) |
| **Consistência eventual** | Todos verão o novo valor, mas não imediatamente | [5.4](curso/modulo-05-cqrs-eventos-mensageria/04-consistencia-eventual-e-sagas.md) |
| **Consumer** | Componente que escuta uma fila/tópico | [4.6](curso/modulo-04-arquitetura/06-presentation-e-main.md) |
| **Context Map** | Desenho das relações entre bounded contexts | [2.5](curso/modulo-02-ddd-estrategico/05-context-mapping.md) |
| **Controller** | Porta de entrada síncrona; valida, autoriza e chama o usecase | [4.4](curso/modulo-04-arquitetura/04-camada-application.md) |
| **Core domain** | O subdomínio que diferencia o negócio | [2.3](curso/modulo-02-ddd-estrategico/03-dominios-e-subdominios.md) |
| **CQRS** | Separação entre modelo de escrita e de leitura | [5.1](curso/modulo-05-cqrs-eventos-mensageria/01-cqs-e-cqrs.md) |
| **CQS** | Um método altera estado ou devolve dado, nunca os dois | [5.1](curso/modulo-05-cqrs-eventos-mensageria/01-cqs-e-cqrs.md) |
| **Data (camada)** | Tipos, enums, constantes, schemas e contratos; a camada mais interna | [4.2](curso/modulo-04-arquitetura/02-modelo-em-camadas.md) |
| **Decorator** | Adiciona comportamento embrulhando o objeto | [6](curso/modulo-06-design-patterns/estruturais/decorator.md) |
| **DIP** | Dependency Inversion: dependa de abstrações | [1.2](curso/modulo-01-fundamentos/02-solid.md) |
| **DLQ** | Dead-letter queue: fila para mensagens que falharam | [5.3](curso/modulo-05-cqrs-eventos-mensageria/03-mensageria.md) |
| **Domain Event** | Fato que aconteceu no domínio | [3.6](curso/modulo-03-ddd-tatico/06-domain-event.md) |
| **Domain Service** | Regra de negócio sem dono natural, sem estado e sem I/O | [3.5](curso/modulo-03-ddd-tatico/05-domain-service.md) |
| **DTO** | Estrutura só de dados para atravessar fronteiras | [3.9](curso/modulo-03-ddd-tatico/09-mapper-dto-helper.md) |
| **Entity** | Objeto com identidade e ciclo de vida | [3.3](curso/modulo-03-ddd-tatico/03-entity.md) |
| **Entrypoint** | Ponto que recebe a entrada externa e aponta para a camada seguinte | [4.6](curso/modulo-04-arquitetura/06-presentation-e-main.md) |
| **Event Sourcing** | Guardar eventos em vez de estado | [5.2](curso/modulo-05-cqrs-eventos-mensageria/02-event-sourcing.md) |
| **Event Storming** | Oficina colaborativa para descobrir o domínio | [2.6](curso/modulo-02-ddd-estrategico/06-event-storming.md) |
| **Facade** | Interface simples para um subsistema complexo | [6](curso/modulo-06-design-patterns/estruturais/facade.md) |
| **Factory** | Encapsula a criação de objetos | [3.7](curso/modulo-03-ddd-tatico/07-factory.md), [6](curso/modulo-06-design-patterns/criacionais/factory-method.md) |
| **Fake** | Dublê de teste com implementação simples e funcional | [7.1](curso/modulo-07-testes/01-estrategia.md) |
| **Flyweight** | Compartilha estado imutável entre muitos objetos | [6](curso/modulo-06-design-patterns/estruturais/flyweight.md) |
| **Generic subdomain** | Problema comum a todos, para usar pronto | [2.3](curso/modulo-02-ddd-estrategico/03-dominios-e-subdominios.md) |
| **GoF** | Gang of Four: autores do livro de 1994 com os 23 padrões | [6.0](curso/modulo-06-design-patterns/00-como-estudar-patterns.md) |
| **Handler** | Porta de entrada assíncrona (mensagens) | [4.4](curso/modulo-04-arquitetura/04-camada-application.md) |
| **Helper** | Função estática de baixo nível. Evite | [3.9](curso/modulo-03-ddd-tatico/09-mapper-dto-helper.md) |
| **Hexagonal** | Ports and Adapters: o núcleo conversa com o mundo por portas | [4.1](curso/modulo-04-arquitetura/01-estilos-arquiteturais.md) |
| **Hook** | Função de ciclo de vida (warmup, shutdown) ou passo opcional num Template Method | [4.6](curso/modulo-04-arquitetura/06-presentation-e-main.md) |
| **Idempotência** | Repetir a operação tem o mesmo efeito que fazê-la uma vez | [5.3](curso/modulo-05-cqrs-eventos-mensageria/03-mensageria.md) |
| **Infra** | Camada que fala com o mundo externo | [4.5](curso/modulo-04-arquitetura/05-camada-infra.md) |
| **Interpreter** | Representa uma gramática e interpreta sentenças | [6](curso/modulo-06-design-patterns/comportamentais/interpreter.md) |
| **Invariante** | Regra que precisa ser sempre verdadeira | [3.11](curso/modulo-03-ddd-tatico/11-invariantes-e-validacao.md) |
| **Iterator** | Percorre uma coleção sem expor sua estrutura | [6](curso/modulo-06-design-patterns/comportamentais/iterator.md) |
| **Linguagem ubíqua** | Vocabulário comum entre negócio e código, por contexto | [2.2](curso/modulo-02-ddd-estrategico/02-linguagem-ubiqua.md) |
| **Mapper** | Converte dados entre formatos | [3.9](curso/modulo-03-ddd-tatico/09-mapper-dto-helper.md) |
| **Mediator** | Centraliza a comunicação entre objetos | [6](curso/modulo-06-design-patterns/comportamentais/mediator.md) |
| **Memento** | Salva e restaura estado sem quebrar encapsulamento | [6](curso/modulo-06-design-patterns/comportamentais/memento.md) |
| **Modelo anêmico** | Objetos só com dados; regras fora deles | [3.10](curso/modulo-03-ddd-tatico/10-modelo-rico-vs-anemico.md) |
| **Monolito modular** | Um deploy com módulos isolados por contexto | [2.4](curso/modulo-02-ddd-estrategico/04-bounded-contexts.md) |
| **Mutation** | Classe de infra com uma operação de escrita especializada | [4.5](curso/modulo-04-arquitetura/05-camada-infra.md) |
| **Observer** | Um objeto notifica vários interessados | [6](curso/modulo-06-design-patterns/comportamentais/observer.md) |
| **Onion** | Camadas concêntricas com o modelo de domínio no centro | [4.1](curso/modulo-04-arquitetura/01-estilos-arquiteturais.md) |
| **Orchestrator** | Coordena vários services numa sequência reutilizável | [4.4](curso/modulo-04-arquitetura/04-camada-application.md) |
| **Outbox** | Grava eventos na mesma transação do estado, para publicação confiável | [5.3](curso/modulo-05-cqrs-eventos-mensageria/03-mensageria.md) |
| **Presentation** | Camada de entrada: routers HTTP e consumers | [4.6](curso/modulo-04-arquitetura/06-presentation-e-main.md) |
| **Primitive Obsession** | Usar tipos primitivos para conceitos com regra | [3.2](curso/modulo-03-ddd-tatico/02-value-object.md) |
| **Projeção** | Read model construído a partir de eventos | [5.2](curso/modulo-05-cqrs-eventos-mensageria/02-event-sourcing.md) |
| **Prototype** | Cria objetos clonando um protótipo | [6](curso/modulo-06-design-patterns/criacionais/prototype.md) |
| **Proxy** | Substituto que controla o acesso ao objeto real | [6](curso/modulo-06-design-patterns/estruturais/proxy.md) |
| **Query** | Classe de infra com uma operação de leitura especializada | [4.5](curso/modulo-04-arquitetura/05-camada-infra.md) |
| **Read model** | Modelo otimizado para leitura | [5.1](curso/modulo-05-cqrs-eventos-mensageria/01-cqs-e-cqrs.md) |
| **Repository** | Coleção ilusória de aggregates; esconde a persistência | [3.8](curso/modulo-03-ddd-tatico/08-repository.md) |
| **Router** | Agrupa rotas HTTP de um módulo | [4.6](curso/modulo-04-arquitetura/06-presentation-e-main.md) |
| **Saga** | Transação de negócio longa feita de transações locais com compensação | [5.4](curso/modulo-05-cqrs-eventos-mensageria/04-consistencia-eventual-e-sagas.md) |
| **Schema** | Descrição validável de um formato (zod) | [3.11](curso/modulo-03-ddd-tatico/11-invariantes-e-validacao.md) |
| **Service Locator** | Registro global que entrega dependências. Restrinja à borda | [4.7](curso/modulo-04-arquitetura/07-building-blocks-e-shared.md) |
| **Shared** | Recursos comuns que não couberam em outra camada | [4.7](curso/modulo-04-arquitetura/07-building-blocks-e-shared.md) |
| **Shared Kernel** | Pequeno modelo compartilhado entre contextos | [2.5](curso/modulo-02-ddd-estrategico/05-context-mapping.md) |
| **Singleton** | Uma única instância com acesso global | [6](curso/modulo-06-design-patterns/criacionais/singleton.md) |
| **SOLID** | Cinco princípios de design OO | [1.2](curso/modulo-01-fundamentos/02-solid.md) |
| **Specification** | Regra de negócio combinável (And/Or/Not) | [6](curso/modulo-06-design-patterns/comportamentais/interpreter.md) |
| **State** | Comportamento muda conforme o estado interno | [6](curso/modulo-06-design-patterns/comportamentais/state.md) |
| **Strategy** | Família de algoritmos intercambiáveis | [6](curso/modulo-06-design-patterns/comportamentais/strategy.md) |
| **Subdomínio** | Parte do domínio: core, supporting ou generic | [2.3](curso/modulo-02-ddd-estrategico/03-dominios-e-subdominios.md) |
| **Supporting subdomain** | Necessário e específico, mas não diferencia | [2.3](curso/modulo-02-ddd-estrategico/03-dominios-e-subdominios.md) |
| **Tell, Don't Ask** | Mande o objeto fazer, em vez de pedir dados e decidir fora | [1.2](curso/modulo-01-fundamentos/02-solid.md) |
| **Template Method** | Esqueleto fixo de algoritmo com passos nas subclasses | [6](curso/modulo-06-design-patterns/comportamentais/template-method.md) |
| **Teste de memória** | Testar usecases com fakes em memória no lugar da infra | [7.1](curso/modulo-07-testes/01-estrategia.md) |
| **Usecase** | Uma ação de negócio orquestrada na application | [4.4](curso/modulo-04-arquitetura/04-camada-application.md) |
| **Value Object** | Valor imutável, auto-validado, igual pelo conteúdo | [3.2](curso/modulo-03-ddd-tatico/02-value-object.md) |
| **Vertical Slices** | Organização por funcionalidade completa | [4.1](curso/modulo-04-arquitetura/01-estilos-arquiteturais.md) |
| **Visitor** | Novas operações sobre uma estrutura sem mudar suas classes | [6](curso/modulo-06-design-patterns/comportamentais/visitor.md) |

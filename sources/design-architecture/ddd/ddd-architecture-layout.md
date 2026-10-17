# Layout

A estrutura é organizada por camadas dentro de módulos, cada uma com pastas específicas para famílias de código. A separação visa controle de dependências, clareza de propósito e escalabilidade.

Todo projeto precisa de uma organização como estrutura de pasta e podem existir inúmeros jeitos.

Definimos uma estrutura de pasta para nossos projeto backend para facilitar o paradigma de programação da Super Frete, dentre outros.

### Como damos sentido a essa estrutura?

- Camadas: Para controle de dependências e do que muda menos ou mais;
- Pastas: Separa as “famílias” de código.

Temos uma visão simplificada dessa estrutura através da nossa Super Architecture.

Transcrevemos a ilustração da nossa visão arquitetural em camadas e pastas.

## Estrutura de pasta

- Shared: Contém recursos comum que não couberam em outra camada ou pasta;
- Building blocks: Camada que centraliza recursos arquiteturais comum entre os módulos;
- Main: Camada de boot, server, hooks, entrypoints, configurações e conexões;
  - Entrypoint: Definição das rotas e apontamento de controllers para elas;
  - Hook: Funções que controlam o ciclo de vida da aplicação.
- Presentation: Camada que interliga requisições/mensagens com a camada de Application;
  - API: Definição de rotas base por funcionalidade.
  - Messaging: Definição de como as mensagens chegarão e apontamento para o Handler.
- Modules: Nossa pasta organizadora de recursos;
  - Data: Camada de acesso a dados de mais baixo nível: tipos, enum, schemas, const, etc;
  - Domain: Camada com foco no código de baixo nível;
    - Value Object: Classe que possui um valor único identificável (cep, address, etc);
    - Entity: Classe com propriedades e comportamentos para controle de invariâncias;
    - Aggregate: Sem pasta. Agregados são entidades que lidam com outras entidades;
    - Context: Sem pasta. São entidades ou agregados que controlam dados comum.
    - Domain Service: Classe reusável com foco em código de baixo nível e sem persistência;
    - Domain Factory: Classe geradora de instâncias e controle de dependências;
    - Helper: Contém funções estáticas e de baixo nível. Evite usar;
    - Mapper: Transforma dados de um input para um DTO ou entidade (preferencialmente).
  - Infra: Camada com foco em drivers e fatores externos;
    - Adapter: Classe que padroniza como usamos drivers em comum;
    - Repository: Classe com comportamentos de persistência simples como CRUD de entidades;
    - Query: Classe com único método de execução para busca de agregados;
    - Mutation: Classe com único método de execução para mutações de agregados;
    - Infra Factory: Classe construtora especializada em componentes de infraestrutura;
    - Infra Service: Classe com único método para auxílio da infra.
  - Application: Camada com foco em orquestração;
    - Application Service: Classe reusável com foco em código de alto nível com persistência;
    - Application Factory: Classe instanciadora dos componentes de Application;
    - Orchestrator: Orquestra outros Services para diminuir complexidade no Usecase;
    - Usecase: Orquestrador da lógica do negócio para um caso de uso específico;
    - Controller: Controla casos de uso, requisição, cabeçalho, contexto, i18n, permissões, etc;
    - Handler: Classe simular ao um Controller mas especializada em controlar mensageria.

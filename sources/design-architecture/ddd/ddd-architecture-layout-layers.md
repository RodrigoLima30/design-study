# Layers

Uma parte da arquitetura é dividida em camadas, e cada camada possui uma pasta correspondente dentro de cada módulo funcional.

Contém boa parte da lógica de negócio. Tudo que representa regras, estruturas e comportamentos centrais do sistema, independente de tecnologia.

Essa organização segue os princípios da Super Architecture: separação clara de responsabilidades e controle de dependências.

Data-icon data

Aplicamos data de acordo com a visão de Clean Architecture como uma camada que contém código de mais baixo nível possível, como: tipagem, enum, constantes, schemas, etc.

### domain

Contém a lógica de negócio pura e imutável. Aqui vivem conceitos como entidades, regras, validações, estruturas de dados, serviços de domínio e outros elementos que expressam o modelo do negócio.

### infra

Responsável pela implementação de recursos externos, como banco de dados, serviços, APIs e adaptação de tecnologias.

### application

Camada de orquestração de casos de uso. Coordena interações entre domínio e infraestrutura, mantendo a lógica de aplicação.

### presentation

Ela é responsável por receber requisições externas, interpretá-las e encaminhar o fluxo de execução para as camadas internas da aplicação — como controllers e handlers.

### main

É a única camada que funciona a nível do “sistema” e não do módulo.

Camada responsável por dar boot no sistema, rodar servidores, listeners (HTTP, gRPC, CLI) e inicializar serviços;

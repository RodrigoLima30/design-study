# Super Architecture

(Uma abordagem centrada no domínio, adaptável e poderosa rocket)

A Super Architecture (arquitetura de código backend da Super Frete) é uma arquitetura moderna e estratégica que combina o melhor de DDD, Clean Architecture, Onion Architecture, Hexagonal Architecture e Vertical Slices, com o objetivo de criar sistemas resilientes, evolutivos e fáceis de manter, sem perder a clareza de propósito.

### Visão Geral

Na Super Architecture, tudo começa e gira em torno do Domínio — o coração da aplicação. A estrutura é formada por camadas concêntricas que organizam as responsabilidades de forma clara e respeitam o princípio da dependência invertida: camadas externas nunca conhecem as internas, mas podem se comunicar por meio de contratos (interfaces).

### Entendando a ilustração

- Camadas dos módulos estão com bordas pontilhadas;
- Camada do sistema está com borda lisa.

## Camadas

### data

Aplicamos data com uma visão mais próxima de Clean Architecture de camada que contém código de mais baixo nível possível, como tipagem e de arquivos estáticos.

### domain (núcleo)

Contém o conhecimento do negócio: Value Objects, Entities, Aggregates, Domain Services, Dados. É a camada mais pura, que contém implementações unitárias e de baixo nível.

### infra

Implementa a comunicação com o domínio após consulta ou manipulação de dados externos através de Repositories e outros.
Também padroniza a forma com que utilizamos recursos externos através de Adapters.
É o elo entre o domain e application.

### application

Define os casos de uso e fluxos de negócio, orquestrando as interações entre o domínio e infraestrutura, validações, regras do negócio e controle de fluxo.

### Benefícios

- Centrada no domínio: a lógica de negócio é a prioridade;
- Alta coesão e baixo acoplamento: facilita refatoração e testes;
- Visão clara das responsabilidades: ideal para equipes grandes e sistemas duradouros;
- Foco em testes: incentiva testes de memória pela alta cobertura e baixo esforço;
- Resistência a mudanças tecnológicas: você pode trocar frameworks, bancos de dados ou interfaces sem quebrar o coração da aplicação.

### Pontos de observação

- Herda a complexidade das arquiteturas que combina (DDD, Clean, Onion);
- Pode ter camadas redundantes se não for bem balanceada;
- Alta exigência de disciplina de time e governança arquitetural;
- Risco de “arquitetura por arquitetura” (criar estrutura sem justificar com requisitos);
- Pode ser difícil de adaptar rapidamente em contextos de entrega ágil ou MVP;
- Necessita de uma equipe para cuidar da sua mantenabilidade.

### Quando usar

- Projetos com lógica de negócio complexa e que exigem evolução constante;
- Times que valorizam clareza de design, qualidade de código, colaboração entre equipes e especialistas do negócio;
- Sistemas que precisam de resiliência e adaptabilidade a longo prazo.

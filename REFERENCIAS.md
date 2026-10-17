# Referências e créditos

## Material base

Este curso foi construído a partir do estudo de dois repositórios de **Jefferson William Machado**, reorganizados, expandidos e reescritos com estrutura e exemplos próprios:

| Repositório | O que inspirou |
|---|---|
| [jefferson-william/design-architecture](https://github.com/jefferson-william/design-architecture) | O modelo em camadas (data, domain, infra, application, presentation, main, building-blocks, shared), as peças de cada camada, a separação Query/Mutation, a nomenclatura, CQRS e Event Sourcing (Módulos 3, 4 e 5) |
| [jefferson-william/design-patterns](https://github.com/jefferson-william/design-patterns) | O catálogo dos 23 padrões GoF e os cenários de vários exemplos: pontos de fidelidade, casa inteligente, chat com moderador, pedidos com estados, fretes, pagamentos, pizzaria, árvores, consulta à Receita, supermercado (Módulo 6) |

Os textos e o código deste repositório foram reescritos; trechos de código das fontes foram corrigidos e adaptados quando necessário.

> **Lendo os originais?** Alguns pontos para atenção:
> - No `design-patterns`, os arquivos `structural-decorator.md` e `structural-facade.md` estão com o conteúdo trocado, e `creational-prototype.md` tem o título "Builder".
> - No `design-architecture`, o texto de visão geral diz "camadas externas nunca conhecem as internas"; a regra usual (e a usada aqui) é a inversa: **as internas** não conhecem as externas.
> - Vários trechos de código são ilustrativos e não compilam como estão.

## Livros

| Livro | Autor | Módulos |
|---|---|---|
| *Domain-Driven Design: Tackling Complexity in the Heart of Software* (2003) | Eric Evans | 2, 3 |
| *Implementing Domain-Driven Design* (2013) | Vaughn Vernon | 2, 3 |
| *Domain-Driven Design Distilled* (2016) | Vaughn Vernon | 2, 3 |
| *Design Patterns: Elements of Reusable Object-Oriented Software* (1994) | Gamma, Helm, Johnson, Vlissides | 6 |
| *Head First Design Patterns* | Eric Freeman, Elisabeth Robson | 6 |
| *Patterns of Enterprise Application Architecture* (2002) | Martin Fowler | 3, 4 |
| *Clean Architecture* (2017) | Robert C. Martin | 1, 4 |
| *Object-Oriented Software Construction* (1988) | Bertrand Meyer | 5 (CQS) |
| *Fundamentals of Software Architecture* (2020) | Mark Richards, Neal Ford | 4.11 |
| *Introducing EventStorming* | Alberto Brandolini | 2.6 |
| *Learning Domain-Driven Design* (2021) | Vlad Khononov | 2, 3 |

## Artigos e sites

- Alistair Cockburn: *Hexagonal Architecture* (alistair.cockburn.us)
- Jeffrey Palermo: *The Onion Architecture* (jeffreypalermo.com)
- Robert C. Martin: *The Clean Architecture* (blog.cleancoder.com, 2012)
- Martin Fowler: *CQRS*, *Event Sourcing*, *AnemicDomainModel*, *Repository* (martinfowler.com)
- Greg Young: *CQRS Documents* (2010)
- Jimmy Bogard: *Vertical Slice Architecture* (jimmybogard.com)
- Chris Richardson: *Transactional Outbox* e *Saga* (microservices.io)
- Refactoring Guru: *Design Patterns* (refactoring.guru)
- SourceMaking: *Design Patterns* (sourcemaking.com)

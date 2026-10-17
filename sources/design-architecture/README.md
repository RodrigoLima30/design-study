# Design Architecture

## Patterns

Muitos [padrões de projeto](https://pt.wikipedia.org/wiki/Padr%C3%A3o_de_projeto_de_software)
servem para realizar determinados tipos de implementações.

_Design Patterns_ é uma descrição ou modelo (template) de como resolver um problema
que pode ser usado em muitas situações diferentes.

Padrões são melhores práticas para que o programador possa usar para
resolver problemas comuns quando criar um projeto.

## História

Historicamente, o arquiteto [Christopher Alexander](https://pt.wikipedia.org/wiki/Christopher_Alexander)
estabelece características que um padrão deve ter e os dividiu em 5 partes.

Os patterns de Alexander procuravam prover uma fonte de ideias para a comunidade afim de serem usadas em projetos,
mostrando assim o quanto padronizado, confortável e flexível os ambientes possam ser construídos.

Em 1987, a partir dos conceitos criados por Alexander, dois programadores chamados
[Kent Beck](https://pt.wikipedia.org/wiki/Kent_Beck) e
[Ward Cunningham](https://pt.wikipedia.org/wiki/Ward_Cunningham) propuseram os primeiros padrões de projeto
para a área da ciência da computação.

Porém, o movimento só ganhou popularidade em 1995 quando foi publicado o livro
Design Patterns: Elements of Reusable Object-Oriented Software.
Os autores desse livro,
[Erich Gamma](https://pt.wikipedia.org/wiki/Erich_Gamma),
[Richard Helm](https://pt.wikipedia.org/wiki/Richard_Helm),
[Ralph Johnson](https://pt.wikipedia.org/wiki/Ralph_Johnson) e
[John Vlissides](https://pt.wikipedia.org/wiki/John_Vlissides),
são conhecidos como a "Gangue dos Quatro" (Gang of Four) ou simplesmente "GoF".

## Design Architecture

Alguns outros nomes muito conhecidos também, são:

- [Bertrand Meyer](https://en.wikipedia.org/wiki/Bertrand_Meyer): criador do CQS (Command Query Separation);
- [Greg Young](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf): criador do CQRS (Command Query Responsibility Segregation);
- [Eric Evans](https://en.wikipedia.org/wiki/Domain-driven_design): criador do DDD;
- [Martin Fawler](https://martinfowler.com/): criador de vários _patterns_ e livros;
- [Robert Cecil Martin ou Uncle Bob](https://martinfowler.com/): criador do Clean Architecture e vários livros.

## Comandos iniciais

```sh
npm init
jest --init
tsc --init
yarn add -D @types/node @types/jest ts-jest jest typescript
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb \
  eslint-config-airbnb-typescript eslint-config-prettier eslint-import-resolver-typescript \
  eslint-plugin-import eslint-plugin-import-helpers eslint-plugin-jest eslint-plugin-prettier \
  prettier
```

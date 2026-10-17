# Design Patterns - Creational - Builder

Permite criar objetos clonando instâncias existentes (protótipos) sem depender de suas classes específicas.

Ele resolve problemas como acesso a atributos privados, dependência de detalhes de implementação e necessidade de conhecer apenas interfaces.

O objeto se autocopia por meio de um método clone(), retornando uma cópia independente.

A clonagem pode ser rasa (mantém referências) ou profunda (copia objetos referenciados).

No exemplo, um sistema de biblioteca digital gerencia livros, revistas e trabalhos acadêmicos.

Como criar instâncias é custoso, o padrão Prototype é aplicado.

As classes Livro, Revista e Trabalho implementam a interface Prototype com o método clone().

Um GerenciadorDePrototipos armazena protótipos pré-configurados e fornece cópias via getInstance().

O teste demonstra a clonagem de objetos Livro, alterando seus atributos sem afetar outros clones, destacando a independência entre objetos clonados.

## Cloneagem

### Clonagem rasa (Shallow cloning)

Clona o objeto, porém qualquer propriedade que seja referência a outra variável ou objeto, permanecerá como referência.

Isso implica que assim que uma dessas referências mudar ambos os objetos, clonado e clone, serão afetados.

### Clonagem profunda (Deep cloning)

Além de clonar o próprio objeto, clona também os objetos referenciados por ele, ou seja, uma nova árvore de objetos é criada de modo que, objeto clonado e clone sejam completamente independentes.

## Clonagem vs Cópia

Vale ressaltar que clonagem é diferente de cópia. A clonagem resulta em dois objetos iguais porém independentes. O grau de independência pode variar conforme o tipo de clonagem adotada.

Já a cópia de um objeto apenas cria uma referência a ele de modo que a edição de um objeto é propagada para todas as suas cópias.

## Exemplo

```ts
interface Prototype {
  clone(): Prototype;
}

class Book implements Prototype {
  private name: string;
  private author: string;
  private numberOfPages: number;

  constructor() {
    this.name = "Unknown";
    this.author = "Unknown";
    this.numberOfPages = 0;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getAuthor(): string {
    return this.author;
  }

  setAuthor(author: string): void {
    this.author = author;
  }

  getNumberOfPages(): number {
    return this.numberOfPages;
  }

  setNumberOfPages(numberOfPages: number): void {
    this.numberOfPages = numberOfPages;
  }

  clone(): Prototype {
    const clone = new Book();
    clone.setName(this.getName());
    clone.setAuthor(this.getAuthor());
    clone.setNumberOfPages(this.getNumberOfPages());
    return clone;
  }

  toString(): string {
    return JSON.stringify({
      name: this.getName(),
      author: this.getAuthor(),
      numberOfPages: this.getNumberOfPages(),
    });
  }
}

class PrototypeManager {
  private prototypes: { [key: string]: Prototype };

  constructor() {
    this.prototypes = {};
    const book = new Book();
    this.prototypes["book"] = book;
    const magazine = new Magazine();
    this.prototypes["magazine"] = magazine;
    const thesis = new Thesis();
    this.prototypes["thesis"] = thesis;
  }

  getInstance(identifier: string): Prototype {
    return this.prototypes[identifier].clone();
  }
}

class Magazine implements Prototype {
  private name: string;
  private edition: number;
  constructor() {
    this.name = "Unknown";
    this.edition = 0;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
  getEdition(): number {
    return this.edition;
  }
  setEdition(edition: number): void {
    this.edition = edition;
  }
  clone(): Prototype {
    const clone = new Magazine();
    clone.setName(this.getName());
    clone.setEdition(this.getEdition());
    return clone;
  }
  toString(): string {
    return JSON.stringify({
      name: this.getName(),
      edition: this.getEdition(),
    });
  }
}
class Thesis implements Prototype {
  private name: string;
  private author: string;
  private type: string;
  constructor() {
    this.name = "Unknown";
    this.author = "Unknown";
    this.type = "Unknown";
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
  getAuthor(): string {
    return this.author;
  }
  setAuthor(author: string): void {
    this.author = author;
  }
  getType(): string {
    return this.type;
  }
  setType(type: string): void {
    this.type = type;
  }
  clone(): Prototype {
    const clone = new Thesis();
    clone.setName(this.getName());
    clone.setAuthor(this.getAuthor());
    clone.setType(this.getType());
    return clone;
  }
  toString(): string {
    return JSON.stringify({
      name: this.getName(),
      author: this.getAuthor(),
      type: this.getType(),
    });
  }
}

const prototypeManager = new PrototypeManager();
const bookPrototype = prototypeManager.getInstance("book");
const book1 = bookPrototype.clone();
console.log("=== Book 1 with default values ===");
console.log(book1.toString());
book1.setName("Book 1");
book1.setAuthor("Lucas da Silva");
book1.setNumberOfPages(325);
console.log("\n=== Book 1 with edited values ===");
console.log(book1.toString());
const book2 = bookPrototype.clone();
console.log("\n=== Book 2 with default values ===");
console.log(book2.toString());
book2.setName("Book 2");
book2.setAuthor("Marlene dos Santos");
book2.setNumberOfPages(420);
console.log("\n=== Book 1 and 2 with edited values ===");
console.log(book1.toString());
console.log(book2.toString());
```

Saída:

```ts
==== Livro 1 com valores padrão. ====

{"nome":"Desconhecido","autor":"Desconhecido","numeroPaginas":0}

==== Livro 1 com valores editados. ====

{"nome":"Livro 1","autor":"Lucas da Silva","numeroPaginas":325}

==== Livro 2 com valores padrão. ====

{"nome":"Desconhecido","autor":"Desconhecido","numeroPaginas":0}

==== Livro 1 e 2 com valores editados. ====

{"nome":"Livro 1","autor":"Lucas da Silva","numeroPaginas":325}
{"nome":"Livro 2","autor":"Marlene dos Santos","numeroPaginas":420}
```

### Aplicabilidade

O padrão Prototype pode ser utilizado quando um sistema deve ser independente de como seus produtos são criados, compostos e representados.

Este padrão também pode ser utilizado:

- Quando as classes a serem instanciadas são especificadas em tempo de execução, por exemplo, por carregamento dinâmico;
- Para evitar a construção de uma hierarquia de classes de fábricas que seja paralela à hierarquia de classes de produtos;
- Quando instâncias de uma classe podem ter apenas algumas poucas combinações diferentes de estado. Pode ser mais conveniente criar um número correspondente de protótipos e cloná-los, em vez de instanciar as classes manualmente, cada vez com o estado apropriado.

### Componentes

- Prototype: Declara uma interface para clonar a si próprio;
- PrototypeConcreto: Implementa uma operação para clonar a si próprio;
- Cliente: Cria um novo objeto solicitando a um protótipo que clone a si próprio.

### Motivação

- Classes são instanciadas em tempo de execução;
- Evita-se hierarquias complexas de fábricas;
- Objetos têm poucas combinações de estado.

### Benefícios

- Oculta classes concretas;
- Permite adicionar protótipos dinamicamente;
- Simplifica criação de objetos complexos;
- Reduz subclasses.

### Desafios

- Clonagem de objetos com referências circulares é complexa.

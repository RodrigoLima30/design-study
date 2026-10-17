# Design Patterns - Behavioral - Iterator

Um padrão comportamental que permite acessar sequencialmente os elementos de um objeto agregado (como listas ou matrizes) sem expor sua estrutura interna.

Ele encapsula a lógica de iteração, promovendo reutilização, flexibilidade e conformidade com princípios como responsabilidade única e aberto/fechado.

### Resumo

Fornecer uma interface uniforme para iterar sobre diferentes estruturas de dados, ocultando sua representação interna e delegando a responsabilidade da iteração a classes específicas (Iterators).

Para iterar sobre os elementos da $lista podemos utilizar um código parecido com o abaixo:

```ts
const size: number = 9;
const list: number[] = [];

for (let i: number = 0; i < size; i++) {
  console.log(list[i] + " ");
}
```

Já para iterar sobre a $matriz é necessário algo como:

```ts
const rowCount: number = 3;
const columnCount: number = 3;
const matrix: number[][] = [];

for (let row: number = 0; row < rowCount; row++) {
  for (let column: number = 0; column < columnCount; column++) {
    console.log(matrix[row][column] + " ");
  }
}
```

### Código

A interface iterator exige que uma classe implemente dois métodos:

```ts
interface Iterator {
  hasNext(): boolean;
  next(): any;
}
```

Vamos criar uma classe que gerencie uma lista utilizando o padrão Iterator.

```ts
class ListIterator implements Iterator {
  private index: number = 0;
  private size: number;
  constructor(private list: any[]) {
    this.size = list.length;
  }
  hasNext(): boolean {
    if (this.index >= this.size) return false;
    return true;
  }
  next(): any {
    const item = this.list[this.index];
    this.index = this.index + 1;
    return item;
  }
}
```

Vamos ver agora como implementar um Iterator para a matriz.

```ts
class MatrixIterator implements Iterator {
  private rowIndex: number = 0;
  private columnIndex: number = 0;
  private rowCount: number;
  private columnCount: number;
  constructor(private matrix: any[][]) {
    this.rowCount = matrix.length;
    this.columnCount = matrix[0].length;
  }
  private incrementIndex(): void {
    if (this.columnIndex >= this.columnCount) {
      this.rowIndex = this.rowIndex + 1;
      this.columnIndex = 0;
    } else {
      this.columnIndex = this.columnIndex + 1;
    }
  }
  hasNext(): boolean {
    if (this.rowIndex > this.rowCount - 1) return false;
    return true;
  }
  next(): any {
    const item = this.matrix[this.rowIndex][this.columnIndex];
    this.incrementIndex();
    return item;
  }
}
```

Vamos criar uma pequena classe que itera sobre os elementos de um Iterator.

```ts
class AggregatePrinter {
  static print(iterator: Iterator): void {
    while (iterator.hasNext()) {
      console.log(iterator.next() + " ");
    }
  }
}
```

Hora de testar.

```ts
const list: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const listIterator: Iterator = new ListIterator(list);
const matrixIterator: Iterator = new MatrixIterator(matrix);

console.log("List Elements: ");
AggregatePrinter.print(listIterator);

console.log("Matrix Elements: ");
AggregatePrinter.print(matrixIterator);
```

Saída:

```
Elementos da Lista:
1 2 3 4 5 6 7 8 9

Elementos da Matriz:
1 2 3 4 5 6 7 8 9
```

Já temos os Iterators implementados para a lista e para a matriz, mas como pode ser observado no teste acima o cliente ainda está criando listas e matrizes nativas. Embora o cliente não precise conhecer suas estruturas internas para fazer a iteração, ele ainda precisa conhecê-las para fazer a inserção de elementos.

### Aggregates

O padrão Iterator diz que os agregados também devem implementar uma interface comum, isso permite que o cliente possa esperar um supertipo ao invés de um objeto (agregado) concreto. Vamos criar a interface para os agregados:

```ts
interface Aggregate {
  createIterator(): Iterator;
}
```

Vamos criar os agregados propriamente ditos. Poderíamos implementar nos agregados métodos para diversas finalidades, tais comos:

```ts
class List implements Aggregate {
  private list: any[] = [];
  constructor(private size: number) {}
  addItem(item: any): boolean {
    if (this.list.length <= this.size - 1) {
      this.list.push(item);
      return true;
    }
    return false;
  }
  getItem(index: number): any {
    return this.list[index];
  }
  getSize(): number {
    return this.size;
  }
  createIterator(): Iterator {
    return new ListIterator(this);
  }
}

class Matrix implements Aggregate {
  private matrix: any[][] = [];
  private currentRow: number = 0;
  private currentColumn: number = 0;
  constructor(
    private rowCount: number,
    private columnCount: number,
  ) {}
  addItem(item: any): boolean {
    if (
      this.currentRow === this.rowCount - 1 &&
      this.currentColumn === this.columnCount
    ) {
      return false;
    }
    if (this.currentColumn === this.columnCount) {
      this.currentRow = this.currentRow + 1;
      this.currentColumn = 0;
    }
    if (!this.matrix[this.currentRow]) {
      this.matrix[this.currentRow] = [];
    }
    this.matrix[this.currentRow][this.currentColumn] = item;
    this.currentColumn = this.currentColumn + 1;
    return true;
  }
  getItem(row: number, column: number): any {
    return this.matrix[row][column];
  }
  getRowCount(): number {
    return this.rowCount;
  }
  getColumnCount(): number {
    return this.columnCount;
  }
  createIterator(): Iterator {
    return new MatrixIterator(this);
  }
}
```

Precisamos agora adaptar os iterators ListIterator e MatrixIterator para atuar sobre os agregados que acabamos de criar.

```ts
class ListIterator implements Iterator {
  private index: number = 0;
  private size: number;
  constructor(private list: List) {
    this.size = list.getSize();
  }
  hasNext(): boolean {
    if (this.index >= this.size) {
      return false;
    }
    return true;
  }
  next(): any {
    const item = this.list.getItem(this.index);
    this.index = this.index + 1;
    return item;
  }
}

class MatrixIterator implements Iterator {
  private rowIndex: number = 0;
  private columnIndex: number = 0;
  private rowCount: number;
  private columnCount: number;
  constructor(private matrix: Matrix) {
    this.rowCount = matrix.getRowCount();
    this.columnCount = matrix.getColumnCount();
  }
  private incrementIndex(): void {
    if (this.columnIndex >= this.columnCount) {
      this.rowIndex = this.rowIndex + 1;
      this.columnIndex = 0;
    } else {
      this.columnIndex = this.columnIndex + 1;
    }
  }
  hasNext(): boolean {
    if (this.rowIndex > this.rowCount - 1) {
      return false;
    }
    return true;
  }
  next(): any {
    const item = this.matrix.getItem(this.rowIndex, this.columnIndex);
    this.incrementIndex();
    return item;
  }
}
```

Os agregados implementam a mesma interface, portanto podemos criar uma nova impressora de agregados que depende apenas desta interface.

```ts
class AggregatePrinter {
  private aggregate: Aggregate;
  setAggregate(aggregate: Aggregate): void {
    this.aggregate = aggregate;
  }
  print(): void {
    const iterator: Iterator = this.aggregate.createIterator();
    while (iterator.hasNext()) {
      console.log(iterator.next() + " ");
    }
  }
}
```

Vamos testar a nova impressora de agregados.

```ts
const list: List = new List(9);
list.addItem(1);
list.addItem(2);
list.addItem(3);
list.addItem(4);
list.addItem(5);
list.addItem(6);
list.addItem(7);
list.addItem(8);
list.addItem(9);
list.addItem(10);
const matrix: Matrix = new Matrix(3, 3);
matrix.addItem(1);
matrix.addItem(2);
matrix.addItem(3);
matrix.addItem(4);
matrix.addItem(5);
matrix.addItem(6);
matrix.addItem(7);
matrix.addItem(8);
matrix.addItem(9);
matrix.addItem(10);
const client: AggregatePrinter = new AggregatePrinter();

client.setAggregate(list);
console.log("List Elements: ");
client.print();

client.setAggregate(matrix);
console.log("Matrix Elements: ");
client.print();
```

Saída:

```
Elementos da Lista:
1 2 3 4 5 6 7 8 9
Elementos da Matriz:
1 2 3 4 5 6 7 8 9
```

Toda a responsabilidade de como iterar sobre os elementos são das classes que implementam o Iterator que são ListIterator e MatrixIterator, essa responsabilidade deixa de ser do cliente.

Da mesma forma a criação do Iterator e a adição de elementos passam a ser responsabilidade das classe List e Matrix que implementam a interface Aggregate.

Com o Iterator é possível implementar novos tipos de agregados, de modo que ao passá-los para o cliente, nada precise ser modificado nele.

No nosso exemplo foram utilizadas estruturas de dados e iterações simples, porém o iterator também pode ser utilizado para iterar sobre estruturas de dados mais complexas, como um grafo por exemplo, fazendo uma busca em largura ou busca em profundidade.

### Motivação

- Coleções (agregados) como listas, matrizes, pilhas ou árvores têm estruturas internas distintas;
- O padrão Iterator permite acessar elementos de forma padronizada, sem que o cliente precise conhecer a organização interna dos dados;
- Suporta múltiplos tipos de iteração (ex.: linear, bidimensional, busca em largura/profundidade em grafos) e iterações simultâneas.

### Componentes

- Cliente: Usa o Iterator para acessar elementos do agregado;
- Agregado: Interface que define a criação de um Iterator;
- AgregadoConcreto: Implementa o Agregado, gerenciando uma coleção e retornando um Iterator específico;
- Iterator: Interface com métodos hasNext() (verifica se há próximo elemento) e next() (retorna o próximo elemento);
- IteratorConcreto: Implementa a lógica de iteração para um agregado específico.

### Consequências

- Encapsula a lógica de iteração, simplificando a interface dos agregados;
- Permite iteração polimórfica (mesmo código para diferentes estruturas);
- Suporta múltiplas iterações simultâneas;
- Segue o princípio de responsabilidade única (Iterator gerencia iteração) e aberto/fechado (novos agregados sem alterar o cliente).

### Aplicabilidade

- Acessar conteúdo de agregados sem expor sua estrutura;
- Suportar diferentes tipos de iteração;
- Fornecer interface uniforme para estruturas variadas.

## Outro exemplo

```ts
interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
}

interface Aggregate<T> {
  createIterator(): Iterator<T>;
}

class ArrayIterator<T> implements Iterator<T> {
  private index: number = 0;

  constructor(private collection: T[]) {}

  public next(): T | null {
    if (this.hasNext()) return this.collection[this.index++];
    return null;
  }

  public hasNext(): boolean {
    return this.index < this.collection.length;
  }
}

class ArrayCollection<T> implements Aggregate<T> {
  constructor(private items: T[]) {}

  public createIterator(): Iterator<T> {
    return new ArrayIterator<T>(this.items);
  }
}

class BookIterator implements Iterator<Book> {
  private books: Book[];
  constructor(
    private books: Book[],
    private reverse: boolean = false,
  ) {
    if (reverse) {
      this.index = books.length - 1;
    }
  }
  public next(): Book | null {
    if (this.hasNext())
      return this.books[this.reverse ? this.index-- : this.index++];
    return null;
  }
  public hasNext(): boolean {
    return this.reverse ? this.index >= 0 : this.index < this.books.length;
  }
}

class BookCollection implements Aggregate<Book> {
  private books: Book[] = [];
  public addBook(book: Book): void {
    this.books.push(book);
  }
  public createIterator(reverse: boolean = false): Iterator<Book> {
    return new BookIterator(this.books, reverse);
  }
}

function* generatorIterator<T>(collection: T[]): Iterator<T> {
  for (const item of collection) {
    yield item;
  }
}

class GeneratorCollection<T> implements Aggregate<T> {
  constructor(private items: T[]) {}
  public createIterator(): Iterator<T> {
    return generatorIterator(this.items);
  }
}

// Basic Iterator Example
const items = ["Item 1", "Item 2", "Item 3"];
const collection = new ArrayCollection(items);
const iterator = collection.createIterator();

console.log("Basic Iterator:");
while (iterator.hasNext()) {
  console.log(iterator.next());
}

// Book Collection Example
const bookCollection = new BookCollection();
bookCollection.addBook({ title: "Book 1", author: "Author 1" });
bookCollection.addBook({ title: "Book 2", author: "Author 2" });
bookCollection.addBook({ title: "Book 3", author: "Author 3" });

console.log("\nForward Book Iterator:");
const bookIterator = bookCollection.createIterator();
while (bookIterator.hasNext()) {
  const book = bookIterator.next();
  if (book) console.log(`${book.title} by ${book.author}`);
}

console.log("\nReverse Book Iterator:");
const reverseBookIterator = bookCollection.createIterator(true);
while (reverseBookIterator.hasNext()) {
  const book = reverseBookIterator.next();
  if (book) console.log(`${book.title} by ${book.author}`);
}

// Generator Iterator Example
const genItems = ["Gen Item 1", "Gen Item 2", "Gen Item 3"];
const genCollection = new GeneratorCollection(genItems);
const genIterator = genCollection.createIterator();

console.log("\nGenerator Iterator:");
let result = genIterator.next();
while (!result.done) {
  console.log(result.value);
  result = genIterator.next();
}
```

Saída:

```
Basic Iterator:
Item 1
Item 2
Item 3

Forward Book Iterator:
Book 1 by Author 1
Book 2 by Author 2
Book 3 by Author 3

Reverse Book Iterator:
Book 3 by Author 3
Book 2 by Author 2
Book 1 by Author 1

Generator Iterator:
Gen Item 1
Gen Item 2
Gen Item 3
```
# Design Patterns - Behavioral - Iterator

Um padrão comportamental que permite acessar sequencialmente os elementos de um objeto agregado (como listas ou matrizes) sem expor sua estrutura interna.

Ele encapsula a lógica de iteração, promovendo reutilização, flexibilidade e conformidade com princípios como responsabilidade única e aberto/fechado.

### Resumo

Fornecer uma interface uniforme para iterar sobre diferentes estruturas de dados, ocultando sua representação interna e delegando a responsabilidade da iteração a classes específicas (Iterators).

Para iterar sobre os elementos da $lista podemos utilizar um código parecido com o abaixo:

```ts
const size: number = 9;
const list: number[] = [];

for (let i: number = 0; i < size; i++) {
  console.log(list[i] + " ");
}
```

Já para iterar sobre a $matriz é necessário algo como:

```ts
const rowCount: number = 3;
const columnCount: number = 3;
const matrix: number[][] = [];

for (let row: number = 0; row < rowCount; row++) {
  for (let column: number = 0; column < columnCount; column++) {
    console.log(matrix[row][column] + " ");
  }
}
```

### Código

A interface iterator exige que uma classe implemente dois métodos:

```ts
interface Iterator {
  hasNext(): boolean;
  next(): any;
}
```

Vamos criar uma classe que gerencie uma lista utilizando o padrão Iterator.

```ts
class ListIterator implements Iterator {
  private index: number = 0;
  private size: number;
  constructor(private list: any[]) {
    this.size = list.length;
  }
  hasNext(): boolean {
    if (this.index >= this.size) return false;
    return true;
  }
  next(): any {
    const item = this.list[this.index];
    this.index = this.index + 1;
    return item;
  }
}
```

Vamos ver agora como implementar um Iterator para a matriz.

```ts
class MatrixIterator implements Iterator {
  private rowIndex: number = 0;
  private columnIndex: number = 0;
  private rowCount: number;
  private columnCount: number;
  constructor(private matrix: any[][]) {
    this.rowCount = matrix.length;
    this.columnCount = matrix[0].length;
  }
  private incrementIndex(): void {
    if (this.columnIndex >= this.columnCount) {
      this.rowIndex = this.rowIndex + 1;
      this.columnIndex = 0;
    } else {
      this.columnIndex = this.columnIndex + 1;
    }
  }
  hasNext(): boolean {
    if (this.rowIndex > this.rowCount - 1) return false;
    return true;
  }
  next(): any {
    const item = this.matrix[this.rowIndex][this.columnIndex];
    this.incrementIndex();
    return item;
  }
}
```

Vamos criar uma pequena classe que itera sobre os elementos de um Iterator.

```ts
class AggregatePrinter {
  static print(iterator: Iterator): void {
    while (iterator.hasNext()) {
      console.log(iterator.next() + " ");
    }
  }
}
```

Hora de testar.

```ts
const list: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const listIterator: Iterator = new ListIterator(list);
const matrixIterator: Iterator = new MatrixIterator(matrix);

console.log("List Elements: ");
AggregatePrinter.print(listIterator);

console.log("Matrix Elements: ");
AggregatePrinter.print(matrixIterator);
```

Saída:

```
Elementos da Lista:
1 2 3 4 5 6 7 8 9

Elementos da Matriz:
1 2 3 4 5 6 7 8 9
```

Já temos os Iterators implementados para a lista e para a matriz, mas como pode ser observado no teste acima o cliente ainda está criando listas e matrizes nativas. Embora o cliente não precise conhecer suas estruturas internas para fazer a iteração, ele ainda precisa conhecê-las para fazer a inserção de elementos.

### Aggregates

O padrão Iterator diz que os agregados também devem implementar uma interface comum, isso permite que o cliente possa esperar um supertipo ao invés de um objeto (agregado) concreto. Vamos criar a interface para os agregados:

```ts
interface Aggregate {
  createIterator(): Iterator;
}
```

Vamos criar os agregados propriamente ditos. Poderíamos implementar nos agregados métodos para diversas finalidades, tais comos:

```ts
class List implements Aggregate {
  private list: any[] = [];
  constructor(private size: number) {}
  addItem(item: any): boolean {
    if (this.list.length <= this.size - 1) {
      this.list.push(item);
      return true;
    }
    return false;
  }
  getItem(index: number): any {
    return this.list[index];
  }
  getSize(): number {
    return this.size;
  }
  createIterator(): Iterator {
    return new ListIterator(this);
  }
}

class Matrix implements Aggregate {
  private matrix: any[][] = [];
  private currentRow: number = 0;
  private currentColumn: number = 0;
  constructor(
    private rowCount: number,
    private columnCount: number,
  ) {}
  addItem(item: any): boolean {
    if (
      this.currentRow === this.rowCount - 1 &&
      this.currentColumn === this.columnCount
    ) {
      return false;
    }
    if (this.currentColumn === this.columnCount) {
      this.currentRow = this.currentRow + 1;
      this.currentColumn = 0;
    }
    if (!this.matrix[this.currentRow]) {
      this.matrix[this.currentRow] = [];
    }
    this.matrix[this.currentRow][this.currentColumn] = item;
    this.currentColumn = this.currentColumn + 1;
    return true;
  }
  getItem(row: number, column: number): any {
    return this.matrix[row][column];
  }
  getRowCount(): number {
    return this.rowCount;
  }
  getColumnCount(): number {
    return this.columnCount;
  }
  createIterator(): Iterator {
    return new MatrixIterator(this);
  }
}
```

Precisamos agora adaptar os iterators ListIterator e MatrixIterator para atuar sobre os agregados que acabamos de criar.

```ts
class ListIterator implements Iterator {
  private index: number = 0;
  private size: number;
  constructor(private list: List) {
    this.size = list.getSize();
  }
  hasNext(): boolean {
    if (this.index >= this.size) {
      return false;
    }
    return true;
  }
  next(): any {
    const item = this.list.getItem(this.index);
    this.index = this.index + 1;
    return item;
  }
}

class MatrixIterator implements Iterator {
  private rowIndex: number = 0;
  private columnIndex: number = 0;
  private rowCount: number;
  private columnCount: number;
  constructor(private matrix: Matrix) {
    this.rowCount = matrix.getRowCount();
    this.columnCount = matrix.getColumnCount();
  }
  private incrementIndex(): void {
    if (this.columnIndex >= this.columnCount) {
      this.rowIndex = this.rowIndex + 1;
      this.columnIndex = 0;
    } else {
      this.columnIndex = this.columnIndex + 1;
    }
  }
  hasNext(): boolean {
    if (this.rowIndex > this.rowCount - 1) {
      return false;
    }
    return true;
  }
  next(): any {
    const item = this.matrix.getItem(this.rowIndex, this.columnIndex);
    this.incrementIndex();
    return item;
  }
}
```

Os agregados implementam a mesma interface, portanto podemos criar uma nova impressora de agregados que depende apenas desta interface.

```ts
class AggregatePrinter {
  private aggregate: Aggregate;
  setAggregate(aggregate: Aggregate): void {
    this.aggregate = aggregate;
  }
  print(): void {
    const iterator: Iterator = this.aggregate.createIterator();
    while (iterator.hasNext()) {
      console.log(iterator.next() + " ");
    }
  }
}
```

Vamos testar a nova impressora de agregados.

```ts
const list: List = new List(9);
list.addItem(1);
list.addItem(2);
list.addItem(3);
list.addItem(4);
list.addItem(5);
list.addItem(6);
list.addItem(7);
list.addItem(8);
list.addItem(9);
list.addItem(10);
const matrix: Matrix = new Matrix(3, 3);
matrix.addItem(1);
matrix.addItem(2);
matrix.addItem(3);
matrix.addItem(4);
matrix.addItem(5);
matrix.addItem(6);
matrix.addItem(7);
matrix.addItem(8);
matrix.addItem(9);
matrix.addItem(10);
const client: AggregatePrinter = new AggregatePrinter();

client.setAggregate(list);
console.log("List Elements: ");
client.print();

client.setAggregate(matrix);
console.log("Matrix Elements: ");
client.print();
```

Saída:

```
Elementos da Lista:
1 2 3 4 5 6 7 8 9
Elementos da Matriz:
1 2 3 4 5 6 7 8 9
```

Toda a responsabilidade de como iterar sobre os elementos são das classes que implementam o Iterator que são ListIterator e MatrixIterator, essa responsabilidade deixa de ser do cliente.

Da mesma forma a criação do Iterator e a adição de elementos passam a ser responsabilidade das classe List e Matrix que implementam a interface Aggregate.

Com o Iterator é possível implementar novos tipos de agregados, de modo que ao passá-los para o cliente, nada precise ser modificado nele.

No nosso exemplo foram utilizadas estruturas de dados e iterações simples, porém o iterator também pode ser utilizado para iterar sobre estruturas de dados mais complexas, como um grafo por exemplo, fazendo uma busca em largura ou busca em profundidade.

### Motivação

- Coleções (agregados) como listas, matrizes, pilhas ou árvores têm estruturas internas distintas;
- O padrão Iterator permite acessar elementos de forma padronizada, sem que o cliente precise conhecer a organização interna dos dados;
- Suporta múltiplos tipos de iteração (ex.: linear, bidimensional, busca em largura/profundidade em grafos) e iterações simultâneas.

### Componentes

- Cliente: Usa o Iterator para acessar elementos do agregado;
- Agregado: Interface que define a criação de um Iterator;
- AgregadoConcreto: Implementa o Agregado, gerenciando uma coleção e retornando um Iterator específico;
- Iterator: Interface com métodos hasNext() (verifica se há próximo elemento) e next() (retorna o próximo elemento);
- IteratorConcreto: Implementa a lógica de iteração para um agregado específico.

### Consequências

- Encapsula a lógica de iteração, simplificando a interface dos agregados;
- Permite iteração polimórfica (mesmo código para diferentes estruturas);
- Suporta múltiplas iterações simultâneas;
- Segue o princípio de responsabilidade única (Iterator gerencia iteração) e aberto/fechado (novos agregados sem alterar o cliente).

### Aplicabilidade

- Acessar conteúdo de agregados sem expor sua estrutura;
- Suportar diferentes tipos de iteração;
- Fornecer interface uniforme para estruturas variadas.

## Outro exemplo

```ts
interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
}

interface Aggregate<T> {
  createIterator(): Iterator<T>;
}

class ArrayIterator<T> implements Iterator<T> {
  private index: number = 0;

  constructor(private collection: T[]) {}

  public next(): T | null {
    if (this.hasNext()) return this.collection[this.index++];
    return null;
  }

  public hasNext(): boolean {
    return this.index < this.collection.length;
  }
}

class ArrayCollection<T> implements Aggregate<T> {
  constructor(private items: T[]) {}

  public createIterator(): Iterator<T> {
    return new ArrayIterator<T>(this.items);
  }
}

class BookIterator implements Iterator<Book> {
  private books: Book[];
  constructor(
    private books: Book[],
    private reverse: boolean = false,
  ) {
    if (reverse) {
      this.index = books.length - 1;
    }
  }
  public next(): Book | null {
    if (this.hasNext())
      return this.books[this.reverse ? this.index-- : this.index++];
    return null;
  }
  public hasNext(): boolean {
    return this.reverse ? this.index >= 0 : this.index < this.books.length;
  }
}

class BookCollection implements Aggregate<Book> {
  private books: Book[] = [];
  public addBook(book: Book): void {
    this.books.push(book);
  }
  public createIterator(reverse: boolean = false): Iterator<Book> {
    return new BookIterator(this.books, reverse);
  }
}

function* generatorIterator<T>(collection: T[]): Iterator<T> {
  for (const item of collection) {
    yield item;
  }
}

class GeneratorCollection<T> implements Aggregate<T> {
  constructor(private items: T[]) {}
  public createIterator(): Iterator<T> {
    return generatorIterator(this.items);
  }
}

// Basic Iterator Example
const items = ["Item 1", "Item 2", "Item 3"];
const collection = new ArrayCollection(items);
const iterator = collection.createIterator();

console.log("Basic Iterator:");
while (iterator.hasNext()) {
  console.log(iterator.next());
}

// Book Collection Example
const bookCollection = new BookCollection();
bookCollection.addBook({ title: "Book 1", author: "Author 1" });
bookCollection.addBook({ title: "Book 2", author: "Author 2" });
bookCollection.addBook({ title: "Book 3", author: "Author 3" });

console.log("\nForward Book Iterator:");
const bookIterator = bookCollection.createIterator();
while (bookIterator.hasNext()) {
  const book = bookIterator.next();
  if (book) console.log(`${book.title} by ${book.author}`);
}

console.log("\nReverse Book Iterator:");
const reverseBookIterator = bookCollection.createIterator(true);
while (reverseBookIterator.hasNext()) {
  const book = reverseBookIterator.next();
  if (book) console.log(`${book.title} by ${book.author}`);
}

// Generator Iterator Example
const genItems = ["Gen Item 1", "Gen Item 2", "Gen Item 3"];
const genCollection = new GeneratorCollection(genItems);
const genIterator = genCollection.createIterator();

console.log("\nGenerator Iterator:");
let result = genIterator.next();
while (!result.done) {
  console.log(result.value);
  result = genIterator.next();
}
```

Saída:

```
Basic Iterator:
Item 1
Item 2
Item 3

Forward Book Iterator:
Book 1 by Author 1
Book 2 by Author 2
Book 3 by Author 3

Reverse Book Iterator:
Book 3 by Author 3
Book 2 by Author 2
Book 1 by Author 1

Generator Iterator:
Gen Item 1
Gen Item 2
Gen Item 3
```

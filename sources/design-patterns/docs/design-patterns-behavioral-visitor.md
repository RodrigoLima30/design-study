# Design Patterns - Behavioral - Visitor

Separa algoritmos da estrutura de objetos, permitindo adicionar novas operações sem modificar as classes dos objetos. É útil quando:

- Uma estrutura de objetos tem várias classes com interfaces distintas, e operações dependem de suas classes concretas;
- Múltiplas operações distintas precisam ser executadas sem sobrecarregar as classes com responsabilidades adicionais;
- A estrutura de objetos é estável, mas novas operações são frequentemente necessárias.

Uma das vantagens desse padrão é a possibilidade de adicionar novas operações a uma estrutura de objetos já existente.

Durante o desenvolvimento de software é comum encontrar funcionalidades que não são exatamente parte de um objeto ou outro. Logo, colocar tais funcionalidades dentro da classe dos próprios objetos poderia poluir o código das classes e abrir brechas para o surgimento de bugs.

## Exemplo

Para exemplificar, considere as classes abaixo que fazem parte do sistema de uma rede de supermercados. Temos uma hierarquia de classes:

- Existem vários supermercados;
- Em cada supermercado existem vários departamentos;
- Cada departamento possui uma série de produtos.

No exemplo, uma rede de supermercados com classes Supermercado, Departamento e Produto utiliza o padrão Visitor para calcular lucratividade.

As interfaces Visitor e Element permitem que novas funcionalidades sejam adicionadas criando novos Visitors, sem alterar as classes existentes. A classe Lucratividade implementa a interface Visitor para calcular o lucro de produtos, departamentos e supermercados.

A classe Profitability implementa a interface Visitor. Ela é a classe que terá os métodos invocados pelo método accept() das classes que implementam Element.

Veja abaixo a hierarquia de objetos utilizados.

```ts
interface Visitor {
  visitSupermarket(supermarket: Supermarket): number;
  visitDepartment(department: Department): number;
  visitProduct(product: Product): number;
}

interface Element {
  accept(visitor: Visitor): number;
}

class Product implements Element {
  constructor(
    private name: string,
    private price: number,
    private profitMargin: number,
  ) {}

  getName(): string {
    return this.name;
  }
  getPrice(): number {
    return this.price;
  }
  getProfitMargin(): number {
    return this.profitMargin;
  }
  accept(visitor: Visitor): number {
    return visitor.visitProduct(this);
  }
}

class Department implements Element {
  private products: Product[] = [];

  constructor(private name: string) {}

  addProduct(product: Product): void {
    this.products.push(product);
  }
  getName(): string {
    return this.name;
  }
  getProducts(): Product[] {
    return this.products;
  }
  accept(visitor: Visitor): number {
    return visitor.visitDepartment(this);
  }
}

class Supermarket implements Element {
  private departments: Department[] = [];

  constructor(private name: string) {}

  addDepartment(department: Department): void {
    this.departments.push(department);
  }
  getName(): string {
    return this.name;
  }
  getDepartments(): Department[] {
    return this.departments;
  }
  accept(visitor: Visitor): number {
    return visitor.visitSupermarket(this);
  }
}

class Profitability implements Visitor {
  visitSupermarket(supermarket: Supermarket): number {
    let profitability = 0;
    const departments = supermarket.getDepartments();
    for (const department of departments) {
      const products = department.getProducts();
      for (const product of products) {
        profitability += this.calculateProductProfitability(product);
      }
    }
    return profitability;
  }

  visitDepartment(department: Department): number {
    let profitability = 0;
    const products = department.getProducts();
    for (const product of products) {
      profitability += this.calculateProductProfitability(product);
    }
    return profitability;
  }

  visitProduct(product: Product): number {
    return this.calculateProductProfitability(product);
  }

  private calculateProductProfitability(product: Product): number {
    return (product.getPrice() * product.getProfitMargin()) / 100;
  }
}

const supermarket = new Supermarket("Corner Supermarket");
const department1 = new Department("Basic Food");
const rice = new Product("Rice 5Kg", 18, 30);
const pasta = new Product("Pasta", 3.2, 15);
department1.addProduct(rice);
department1.addProduct(pasta);

const department2 = new Department("Hygiene");
const toiletPaper = new Product("Toilet Paper", 11, 35);
const soap = new Product("Soap", 1.2, 10);
department2.addProduct(toiletPaper);
department2.addProduct(soap);

supermarket.addDepartment(department1);
supermarket.addDepartment(department2);

const profitabilityVisitor = new Profitability();
console.log(
  `Supermarket Profitability: R$${supermarket.accept(profitabilityVisitor)}`,
);
console.log(
  `Department 1 Profitability: R$${department1.accept(profitabilityVisitor)}`,
);
console.log(`Rice Profitability: R$${rice.accept(profitabilityVisitor)}`);
console.log(`Pasta Profitability: R$${pasta.accept(profitabilityVisitor)}`);
console.log(
  `Department 2 Profitability: R$${department2.accept(profitabilityVisitor)}`,
);
console.log(
  `Toilet Paper Profitability: R$${toiletPaper.accept(profitabilityVisitor)}`,
);
console.log(`Soap Profitability: R$${soap.accept(profitabilityVisitor)}`);
```

Saída:

```
Supermarket Profitability: R$9.85

Department 1 Profitability: R$5.88
Rice Profitability: R$5.4
Pasta Profitability: R$0.48

Department 2 Profitability: R$3.97
Toilet Paper Profitability: R$3.85
Soap Profitability: R$0.12
```

### Componentes

- Visitor: Declara métodos visit para cada tipo de elemento;
- ConcreteVisitor: Implementa os métodos visit para diferentes elementos;
- Element: Define o método accept que recebe um Visitor;
- ConcreteElement: Implementa accept para chamar o método apropriado do Visitor;
- ObjectStructure: Opcional, gerencia a coleção de elementos.

### Consequências

- Facilita adicionar novas operações via novos Visitors;
- Centraliza operações relacionadas em uma única classe Visitor;
- Dificulta adicionar novas classes de elementos, pois exige alterações em todos os Visitors;
- Pode quebrar o encapsulamento, exigindo que elementos exponham seu estado interno.

### Quando usar

- Quando a estrutura de objetos é estável, mas os algoritmos mudam frequentemente;
- Evitar se as classes de elementos mudam com frequência, pois a manutenção do Visitor pode ser complexa.

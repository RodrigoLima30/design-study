# Design Patterns - Behavioral - Strategy

Define uma família de algoritmos, encapsula cada um e os torna intercambiáveis, permitindo que o algoritmo varie independentemente dos clientes.

### Resumo

O padrão Strategy é usado para externalizar comportamentos de objetos em uma família de algoritmos, promovendo flexibilidade e reuso. O exemplo do documento é um sistema de e-commerce que calcula fretes (Comum e Expresso) para pedidos, evoluindo de uma implementação inicial com métodos na classe Pedido para uma solução usando Strategy, que encapsula os cálculos de frete em classes separadas.

### Introdução

Exemplo inicial com a classe Pedido com métodos calculaFreteComum e calculaFreteExpresso.

```ts
class Pedido {
  protected valor: number;
  constructor(valor: number) {
    this.valor = valor;
  }
  getValor(): number {
    return this.valor;
  }
  setValor(valor: number): void {
    this.valor = valor;
  }
  calculaFreteComum(): number {
    return this.valor * 0.05;
  }
  calculaFreteExpresso(): number {
    return this.valor * 0.1;
  }
}
```

Vejamos um teste da classe pedido.

```ts
const pedido = new Pedido();

pedido.setValor(100);

console.log(`Frete Comum: R$${pedido.calculaFreteComum()}`);
console.log(`Frete Expresso: R$${pedido.calculaFreteExpresso()}`);
```

Saída:

```
Frete Comum: R$5
Frete Expresso: R$10
```

## Evolução com Herança

O e-commerce cresce, dividindo pedidos em setores (Móveis e Eletrônicos). A classe Pedido torna-se abstrata, e subclasses (PedidoEletronicos, PedidoMoveis) herdam os métodos de cálculo.

```ts
abstract class Pedido {
  protected valor: number;
  getValor(): number {
    return this.valor;
  }
  setValor(valor: number): void {
    this.valor = valor;
  }
  calculaFreteComum(): number {
    return this.valor * 0.05;
  }
  calculaFreteExpresso(): number {
    return this.valor * 0.1;
  }
}

class PedidoEletronicos extends Pedido {
  private nomeSetor: string = "Eletrônicos";
  getNomeSetor(): string {
    return this.nomeSetor;
  }
}
```

### Problema com Herança

O setor de Móveis aceita apenas frete comum. Métodos abstratos são usados, mas duplicam código nas subclasses, aumentando manutenção.

```ts
abstract class Pedido {
  protected valor: number;
  abstract calculaFreteComum(): number;
  abstract calculaFreteExpresso(): number;
}

class PedidoMoveis extends Pedido {
  private nomeSetor: string = "Móveis";
  calculaFreteComum(): number {
    return this.valor * 0.05;
  }
  calculaFreteExpresso(): number {
    throw new Error("Indisponível");
  }
}
```

### Aplicação do Padrão Strategy

Introduz a interface Frete e classes concretas FreteComum e FreteExpresso. A classe Pedido é adaptada para usar composição, delegando cálculos ao objeto Frete.

```ts
interface Frete {
  calcula(valorPedido: number): number;
}

class FreteComum implements Frete {
  calcula(valorPedido: number): number {
    return valorPedido * 0.05;
  }
}

class FreteExpresso implements Frete {
  calcula(valorPedido: number): number {
    return valorPedido * 0.1;
  }
}

abstract class Pedido {
  protected valor: number;
  private frete: Frete;
  setTipoFrete(frete: Frete): void {
    this.frete = frete;
  }
  calculaFrete(): number {
    return this.frete.calcula(this.valor);
  }
}

class PedidoEletronicos extends Pedido {
  private nomeSetor = "Eletrônicos";
  public getNomeSetor(): string {
    return this.nomeSetor;
  }
  public setNomeSetor(nomeSetor: string): void {
    this.nomeSetor = nomeSetor;
  }
}

class PedidoMoveis extends Pedido {
  private nomeSetor = "Móveis";
  public getNomeSetor(): string {
    return this.nomeSetor;
  }
  public setNomeSetor(nomeSetor: string): void {
    this.nomeSetor = nomeSetor;
  }
}
```

Testando…

````ts
const freteComum = new FreteComum();
const freteExpresso = new FreteExpresso();
const pedido = new PedidoEletronicos();

pedido.setValor(100);
pedido.setTipoFrete(freteComum);

console.log(`Eletrônicos Frete Comum: R$${pedido.calculaFrete()}`);

pedido.setTipoFrete(freteExpresso);

console.log(`Eletrônicos Frete Expresso: R$${pedido.calculaFrete()}`);

const pedidoMoveis = new PedidoMoveis();

pedidoMoveis.setValor(100);
pedidoMoveis.setTipoFrete(freteComum);

console.log(`Móveis Frete Comum: R$${pedidoMoveis.calculaFrete()}`);
```

Saída:

```
Eletrônicos Frete Comum: R$5
Eletrônicos Frete Expresso: R$10
Móveis Frete Comum: R$5
```

### Benefícios e consequências

#### Benefícios

Flexibilidade, reuso, remoção de condicionais, aderência a princípios como Open/Closed e composição sobre herança.

#### Desvantagens

Clientes precisam conhecer as estratégias, aumento de classes, custo de comunicação entre Context e Strategy.

### Componentes

- Contexto: Pedido, que delega a estratégia;
- Strategy: Interface Frete;
- Estrategia concreta: FreteComum e FreteExpresso.

### Aplicabilidade

Quando há variantes de algoritmos, necessidade de ocultar lógica ou remover condicionais.

### Conclusão

O padrão Strategy resolve os problemas de duplicação e rigidez da herança, encapsulando algoritmos de frete em classes separadas.

Ele promove flexibilidade e manutenção, mas aumenta o número de classes.

As imagens (diagramas de classes) ilustram a evolução do design, culminando na estrutura do padrão Strategy.
````

# Design Patterns - Behavioral - Template Method

Define o esqueleto de um algoritmo em uma superclasse, permitindo que subclasses implementem passos específicos sem alterar a estrutura geral.

### Resumo

Definição: O Template Method define um algoritmo em um método, delegando passos específicos para subclasses. Isso promove reutilização de código e controle sobre a execução.

Motivação: Permite criar algoritmos com partes fixas e variáveis, onde subclasses implementam as partes variáveis. Evita duplicação de código e facilita extensibilidade.

Exemplo Prático: Um módulo de pagamentos de uma loja de confecções com três formas de pagamento (Crédito, Débito, Dinheiro) é refatorado para usar o Template Method, permitindo adicionar novas formas de pagamento sem modificar o código existente.

#### Regras

- Taxas:
  - Crédito: 5% sobre o valor;
  - Débito: R$ 4 fixos;
  - Dinheiro: Sem taxa.
- Descontos:
  - Crédito: 2% para valores > R$300;
  - Débito: 5% sobre o valor;
  - Dinheiro: 10% sobre o valor.

Problema inicial: As classes PagamentoCredito, PagamentoDebito e PagamentoDinheiro tinham código repetido no método realizaCobranca() e variáveis comuns (valor, gateway).

```ts
class Gateway {
  cobrar(valor: number): boolean {
    console.log(`R$${valor}`);
    return Math.random() > 0.5; // Simula retorno aleatório
  }
}

class PagamentoCredito {
  constructor(
    private readonly valor: number,
    private readonly gateway: Gateway,
  ) {}

  public calcularTaxa(): number {
    return this.valor * 0.05;
  }

  public calcularDesconto(): number {
    if (this.valor > 300) {
      return this.valor * 0.02;
    }
    return 0;
  }

  public realizaCobranca(): boolean {
    const valorFinal =
      this.valor + this.calcularTaxa() - this.calcularDesconto();
    return this.gateway.cobrar(valorFinal);
  }
}

class PagamentoDebito {
  constructor(
    private readonly valor: number,
    private readonly gateway: Gateway,
  ) {}

  public calcularTaxa(): number {
    return 4;
  }

  public calcularDesconto(): number {
    return this.valor * 0.05;
  }

  public realizaCobranca(): boolean {
    const valorFinal =
      this.valor + this.calcularTaxa() - this.calcularDesconto();
    return this.gateway.cobrar(valorFinal);
  }
}

class PagamentoDinheiro {
  constructor(
    private readonly valor: number,
    private readonly gateway: Gateway,
  ) {}

  public calcularTaxa(): number {
    return 0;
  }

  public calcularDesconto(): number {
    return this.valor * 0.1;
  }

  public realizaCobranca(): boolean {
    const valorFinal =
      this.valor + this.calcularTaxa() - this.calcularDesconto();
    return this.gateway.cobrar(valorFinal);
  }
}
```

Testando…

```ts
const valor = 1000;
const gateway = new Gateway();

const pagamentoCredito = new PagamentoCredito(valor, gateway);
console.log(`Crédito: ${pagamentoCredito.realizaCobranca()}`);

const pagamentoDebito = new PagamentoDebito(valor, gateway);
console.log(`Débito: ${pagamentoDebito.realizaCobranca()}`);

const pagamentoDinheiro = new PagamentoDinheiro(valor, gateway);
console.log(`Dinheiro: ${pagamentoDinheiro.realizaCobranca()}`);
```

Saída:

```
Crédito: 1000 + 50 - 20 = 1030
Débito: 1000 + 4 - 50 = 954
Dinheiro: 1000 + 0 - 100 = 900
```

### O que vimos até aqui

- Classes PagamentoCredito, PagamentoDebito e PagamentoDinheiro com código redundante;
- Método realizaCobranca() repetido e espalhado.

### Solução com Template Method

- Uma superclasse abstrata Pagamento define o método realizaCobranca() como final (não sobrescrito) e métodos abstratos ou hooks (calcularTaxa, calcularDesconto) para implementação nas subclasses;
- Subclasses (PagamentoCredito, PagamentoDebito, PagamentoDinheiro) implementam apenas os métodos variáveis e conforme a necessidade.

```ts
class Gateway {
  cobrar(valor: number): boolean {
    console.log(`R$${valor}`);
    return Math.random() > 0.5; // Simula retorno aleatório
  }
}

abstract class Pagamento {
  constructor(private readonly valor: number, private readonly gateway: Gateway) {}

  // Hook - Implementação mínima. Pode ser sobrescrito pelas subclasses.
  public calcularTaxa(): number {
    return 0;
  }

  // Será implementado pelas subclasses.
  abstract calcularDesconto(): number;

  public final realizaCobranca(): boolean {
    const valorFinal = this.valor + this.calcularTaxa() - this.calcularDesconto();
    return this.gateway.cobrar(valorFinal);
  }
}

class PagamentoCredito extends Pagamento {
    public calcularTaxa(): number {
        return this.valor * 0.05;
    }
    public calcularDesconto(): number {
        if (this.valor > 300) return this.valor * 0.02;
        return 0;
    }
}

class PagamentoDebito extends Pagamento {
    public calcularTaxa(): number {
        return 4;
    }
    public calcularDesconto(): number {
        return this.valor * 0.05;
    }
}

class PagamentoDinheiro extends Pagamento {
  public calcularDesconto(): number {
    return this.valor * 0.1;
  }
}
```

Testando...

```ts
const valor: number = 1000;
const gateway: Gateway = new Gateway();

console.log("Crédito: ");
const pagamentoCredito: PagamentoCredito = new PagamentoCredito(valor, gateway);
pagamentoCredito.realizaCobranca();

console.log("Débito: ");
const pagamentoDebito: PagamentoDebito = new PagamentoDebito(valor, gateway);
pagamentoDebito.realizaCobranca();

console.log("Dinheiro: ");
const pagamentoDinheiro: PagamentoDinheiro = new PagamentoDinheiro(
  valor,
  gateway,
);
pagamentoDinheiro.realizaCobranca();
```

Saída:

```
Crédito: 1000 + 50 - 20 = 1030
Débito: 1000 + 4 - 50 = 954
Dinheiro: 1000 + 0 - 100 = 900
```

### Componentes do padrão

- ClasseAbstrata: Define o Template Method e métodos concretos/abstratos;
- ClasseConcreta: Implementa métodos abstratos conforme necessário.

### Consequências

- Reutilização de código;
- Inversão de dependência (subclasses dependem da superclasse);
- Controle da sequência de execução;
- Suporte a hooks e métodos abstratos.

### Aplicabilidade

- Implementar algoritmos com partes fixas e variáveis;
- Controlar extensões de subclasses;
- Evitar duplicação de código.

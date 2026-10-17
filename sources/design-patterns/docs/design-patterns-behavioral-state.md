# Design Patterns - Behavioral - State

Um padrão comportamental que permite a um objeto alterar seu comportamento quando seu estado interno muda, dando a impressão de que ele mudou de classe.

### Resumo

Definição e motivação: O padrão State é usado quando um objeto deve mudar seu comportamento com base em seu estado interno.

Sem o padrão, classes podem se tornar complexas, com muitas condicionais para gerenciar transições de estado, resultando em código difícil de manter.

O exemplo dado é um sistema de pedidos com estados: aguardando pagamento, pago, cancelado e enviado, modelado como uma máquina de estados.

#### Máquina de estados

- Aguardando pagamento: Estado inicial. Pode transitar para Pago (com "Sucesso ao Pagar") ou Cancelado (com "Cancelar Pedido");
- Pago: Pode transitar para Cancelado (com "Cancelar Pedido") ou Enviado (com "Despachar Pedido");
- Cancelado: Estado final, sem transições;
- Enviado: Estado final, sem transições.

### Implementação sem o padrão State

Uma implementação inicial da classe Pedido usa constantes numéricas AGUARDANDO_PAGAMENTO = 1
e condicionais para gerenciar transições.

Isso gera código confuso e difícil de escalar.

```ts
class Pedido {
  static readonly AGUARDANDO_PAGAMENTO = 1;
  static readonly PAGO = 2;
  static readonly CANCELADO = 3;
  static readonly ENVIADO = 4;

  private estadoAtual: number;

  public constructor() {
    this.estadoAtual = Pedido.AGUARDANDO_PAGAMENTO;
  }

  public sucessoAoPagar(): void {
    if (this.estadoAtual === Pedido.AGUARDANDO_PAGAMENTO) {
      this.estadoAtual = Pedido.PAGO;
    } else {
      console.log("O pedido não está aguardando pagamento");
    }
  }

  public cancelarPedido(): void {
    if (this.estadoAtual === Pedido.AGUARDANDO_PAGAMENTO) {
      this.estadoAtual = Pedido.CANCELADO;
    } else if (this.estadoAtual === Pedido.PAGO) {
      this.estadoAtual = Pedido.CANCELADO;
    } else {
      console.log("O pedido não pode ser cancelado");
    }
  }

  public despacharPedido(): void {
    if (this.estadoAtual === Pedido.PAGO) {
      this.estadoAtual = Pedido.ENVIADO;
    } else {
      console.log("O pedido se encontra cancelado");
    }
  }
}
```

### Implementação com o padrão State

O padrão sugere criar uma interface State com métodos para cada transição (sucessoAoPagar, cancelarPedido, despacharPedido).

Cada estado é uma classe concreta que implementa essa interface, encapsulando o comportamento específico.

A classe Pedido mantém referências aos estados e delega solicitações ao estado atual.

```ts
enum PEDIDO_ESTADO {
  AGUARDANDO_PAGAMENTO = 1,
  PAGO = 2,
  CANCELADO = 3,
  ENVIADO = 4,
}

interface State {
  sucesso(): void;
  cancelar(): void;
  despachar(): void;
}

// Muitas das vezes será o estado inicial
class AguardandoPagamentoState implements State {
  public readonly estado = PEDIDO_ESTADO.AGUARDANDO_PAGAMENTO;
  constructor(private readonly pedido: Pedido) {}
  sucesso(): void {
    this.pedido.setEstadoAtual(new PagoState(this.pedido));
  }
  cancelar(): void {
    this.pedido.setEstadoAtual(new CanceladoState(this.pedido));
  }
  despachar(): void {
    throw new Error("Operação não suportada, o pedido ainda não foi pago.");
  }
}

class PagoState implements State {
  public readonly estado = PEDIDO_ESTADO.PAGO;
  constructor(private readonly pedido: Pedido) {}
  sucesso(): void {
    throw new Error("Operação não suportada, o pedido já foi pago.");
  }
  cancelar(): void {
    this.pedido.setEstadoAtual(new CanceladoState(this.pedido));
  }
  despachar(): void {
    this.pedido.setEstadoAtual(new EnviadoState(this.pedido));
  }
}

class CanceladoState implements State {
  public readonly estado = PEDIDO_ESTADO.CANCELADO;
  constructor(private readonly pedido: Pedido) {}
  sucesso(): void {
    throw new Error("Operação não suportada, o pedido se encontra cancelado.");
  }
  cancelar(): void {
    throw new Error("Operação não suportada, pedido já cancelado.");
  }
  despachar(): void {
    throw new Error("Operação não suportada, o pedido se encontra cancelado.");
  }
}

class EnviadoState implements State {
  public readonly estado = PEDIDO_ESTADO.ENVIADO;
  constructor(private readonly pedido: Pedido) {}
  sucesso(): void {
    throw new Error("Operação não suportada, o pedido já foi pago e enviado.");
  }
  cancelar(): void {
    throw new Error("Operação não suportada, o pedido já foi enviado.");
  }
  despachar(): void {
    throw new Error("Operação não suportada, o pedido já foi enviado.");
  }
}

class Pedido {
  public estadoAtual: State;
  constructor() {
    this.estadoAtual = new AguardandoPagamentoState(this);
  }
  sucesso(): void {
    try {
      this.estadoAtual.sucesso();
    } catch (e) {
      console.log(e.message);
    }
  }
  cancelar(): void {
    try {
      this.estadoAtual.cancelar();
    } catch (e) {
      console.log(e.message);
    }
  }
  despachar(): void {
    try {
      this.estadoAtual.despachar();
    } catch (e) {
      console.log(e.message);
    }
  }
  setEstadoAtual(estadoAtual: State): void {
    this.estadoAtual = estadoAtual;
  }
  getEstadoAtual(): PEDIDO_ESTADO {
    this.estadoAtual.estado;
  }
}
```

Testando...

```ts
const pedido = new Pedido();

console.log(`Estado inicial: ${pedido.getEstadoAtual()}`);

pedido.despachar(); // Erro: Operação não suportada, o pedido ainda não foi pago.

pedido.sucesso();

console.log(`Após ter pago: ${pedido.getEstadoAtual()}`);

pedido.sucesso(); // Erro: Operação não suportada, o pedido já foi pago.

pedido.despachar();

console.log(`Após despachar: ${pedido.getEstadoAtual()}`);

pedido.cancelar(); // Erro: Operação não suportada, o pedido já foi enviado.
```

Saída:

```
Estado inicial: 1 // PEDIDO_ESTADO.AGUARDANDO_PAGAMENTO
Após ter pago: 2 // PEDIDO_ESTADO.PAGO
Após despachar: 4 // PEDIDO_ESTADO.ENVIADO
```

### Diagrama de Classes

O documento inclui um diagrama de classes (não detalhado no texto, mas mencionado) que ilustra a relação entre a classe Pedido (context), a interface State e as classes concretas: AguardandoPagamentoState, PagoState, CanceladoState, EnviadoState.

### Componentes

- Context (Pedido): Mantém o estado atual e delega solicitações ao estado;
- State: Interface que define métodos de transição;
- EstadoConcreto: Classes que implementam o comportamento específico de cada estado.

### Aplicabilidade

- Usar o padrão quando o comportamento de um objeto depende do estado interno e muda em tempo de execução;
- Útil para eliminar condicionais complexas baseadas em estados.

### Consequências

- Encapsula o comportamento por estado, facilitando manutenção;
- Transições de estado são explícitas, evitando atribuições implícitas;
- Protege contra transições inconsistentes, pois a lógica está nos estados;
- Simplifica a adição de novos estados.

### Considerações

O padrão State organiza a lógica de transição de estados, reduzindo a complexidade da classe de contexto e facilitando a manutenção e escalabilidade.

````ts
```

Saída:

```
```
````

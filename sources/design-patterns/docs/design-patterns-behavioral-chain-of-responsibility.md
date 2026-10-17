# Design Patterns - Behavioral - Chain of Responsibility

Evita o acoplamento entre o remetente e o receptor de uma solicitação, permitindo que múltiplos objetos tenham a chance de tratá-la. Ele organiza objetos em uma cadeia, passando a solicitação até que um ou mais deles a processe.

### Exemplo sem o padrão

```ts
class Example {
  public attribute: number;
  public testAttribute(): void {
    if (this.attribute < 10) {
      // ...
    } else if (this.attribute < 200) {
      // ...
    } else if (this.attribute < 500) {
      // ...
    } else {
      // ...
    }
  }
}
```

### Cenário

Uma hamburgueria implementa um programa de fidelidade onde pontos são calculados com base no valor do pedido, com regras diferentes para a primeira e segunda quinzena do mês:

| Critério         | Primeira Quinzena   | Segunda Quinzena     |
| ---------------- | ------------------- | -------------------- |
| Pedido ≥ R$69,99 | 1 ponto a cada R$5  | 2 pontos a cada R$5  |
| Pedido ≥ R$39,99 | 1 ponto a cada R$7  | 2 pontos a cada R$7  |
| Pedido ≥ R$19,99 | 1 ponto a cada R$10 | 2 pontos a cada R$10 |
| Pedido < R$20,00 | 0 pontos            | 0 pontos             |

Sem a aplicação do padrão, o problema poderia ser resolvido da seguinte maneira:

```ts
class Order {
  private value: number;

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value;
  }
}

class PointsCalculator {
  public execute(order: Order, day: number): number {
    let points: number;
    if (order.getValue() >= 70) {
      points = Math.floor(order.getValue() / 5);
    } else if (order.getValue() >= 40) {
      points = Math.floor(order.getValue() / 7);
    } else if (order.getValue() >= 20) {
      points = Math.floor(order.getValue() / 10);
    } else {
      return 0;
    }
    if (day >= 16 && day <= 31) return points * 2;
    return points;
  }
}
```

## Código

O código organiza uma cadeia de objetos que implementam uma interface comum (PointCalculator), cada um responsável por um critério de pontuação. A solicitação é passada pela cadeia até ser tratada ou atingir o fim (retornando 0 pontos).

#### Interfaces e classe de executação

```ts
interface PointCalculator {
  calculatePoints(order: Order): number;
  setNext(next: PointCalculator): void;
}

class Order {
  private value: number = 0;
  setValue(value: number): void {
    this.value = value;
  }
  getValue(): number {
    return this.value;
  }
}

class PointsCalculator {
  execute(order: Order, day: number): number {
    const points70 = new Points70();
    const points40 = new Points40();
    const points20 = new Points20();
    const noPoints = new NoPoints();

    points70.setNext(points40);
    points40.setNext(points20);
    points20.setNext(noPoints);

    if (day >= 16 && day <= 31) {
      return points70.calculatePoints(order) * 2;
    }

    return points70.calculatePoints(order);
  }
}
```

#### Classes com as regras

```ts
class Points70 implements PointCalculator {
  private nextCalculator: PointCalculator | null = null;
  calculatePoints(order: Order): number {
    if (order.getValue() >= 70) {
      return Math.floor(order.getValue() / 5);
    }
    return this.nextCalculator!.calculatePoints(order);
  }
  setNext(next: PointCalculator): void {
    this.nextCalculator = next;
  }
}

class Points40 implements PointCalculator {
  private nextCalculator: PointCalculator | null = null;
  calculatePoints(order: Order): number {
    if (order.getValue() >= 40) {
      return Math.floor(order.getValue() / 7);
    }
    return this.nextCalculator!.calculatePoints(order);
  }
  setNext(next: PointCalculator): void {
    this.nextCalculator = next;
  }
}

class Points20 implements PointCalculator {
  private nextCalculator: PointCalculator | null = null;
  calculatePoints(order: Order): number {
    if (order.getValue() >= 20) {
      return Math.floor(order.getValue() / 10);
    }
    return this.nextCalculator!.calculatePoints(order);
  }
  setNext(next: PointCalculator): void {
    this.nextCalculator = next;
  }
}
```

#### Regra “em branco”

```ts
class NoPoints implements PointCalculator {
  calculatePoints(order: Order): number {
    return 0;
  }
  setNext(next: PointCalculator): void {}
}
```

#### Exemplo

```ts
const order = new Order();
const pointsCalculator = new PointsCalculator();

order.setValue(21);

console.log(`Day 15: ${pointsCalculator.execute(order, 15)} points`);
console.log(`Day 16: ${pointsCalculator.execute(order, 16)} points`);

console.log("-----------------");

order.setValue(100);

console.log(`Day 15: ${pointsCalculator.execute(order, 15)} points`);
console.log(`Day 16: ${pointsCalculator.execute(order, 16)} points`);
```

Saída:

```
Day 15: 2 points
Day 16: 4 Points
-----------------
Day 15: 20 points
Day 16: 40 points
```

### Motivação

Evita código com múltiplas condições aninhadas (como if-elseif) que podem crescer descontroladamente, dificultando manutenção e aumentando acoplamento. O padrão encapsula cada critério de tratamento em objetos separados, facilitando extensibilidade.

### Aplicabilidade

- Quando múltiplos objetos podem tratar uma solicitação, e o tratador é escolhido automaticamente;
- Quando a solicitação deve ser enviada a um de vários objetos sem especificar qual;
- Quando a cadeia de tratadores pode ser definida dinamicamente.

### Consequências

Vantagens:

- Reduz acoplamento, pois o cliente não precisa conhecer o tratador;
- Aumenta flexibilidade para adicionar ou alterar responsabilidades.

# 3.7 · Factory (no domínio)

## Problema

Criar um `Pedido` a partir de um carrinho exige: converter cada item, aplicar o cupom, calcular o frete escolhido e validar o endereço. Se esse código fica espalhado em vários usecases, cada um cria pedidos de um jeito.

## Ideia

> 💡 Uma **Factory** encapsula a **criação** de um objeto complexo e garante que ele **nasça válido**. Ela não tem regra de negócio de comportamento, só de montagem.

## Formas de factory, da mais simples para a mais completa

### 1. Static factory method (na própria classe)

```ts
export class Money {
  private constructor(readonly cents: number, readonly currency: Currency) {}
  static fromCents(cents: number, currency: Currency = 'BRL') { return new Money(cents, currency) }
  static fromDecimal(value: number, currency: Currency = 'BRL') { return new Money(Math.round(value * 100), currency) }
  static zero(currency: Currency = 'BRL') { return new Money(0, currency) }
}
```

Use quando há **várias formas de criar** o mesmo objeto e cada uma merece um nome.

### 2. Método de criação no aggregate

```ts
export class Order {
  private constructor(readonly id: string, readonly customerId: string) {}

  static create(id: string, customerId: string) {
    return new Order(id, customerId)
  }

  // reconstrução a partir do banco: não dispara eventos nem revalida regras de criação
  static restore(props: OrderProps): Order { /* ... */ }
}
```

> 💡 Separe **`create`** (nascimento: valida regras de criação e registra eventos) de **`restore`** (reidratação vinda do banco: só remonta o estado). Confundir os dois gera eventos duplicados a cada leitura.

### 3. Classe Factory dedicada

Quando a criação envolve **outros objetos** do domínio:

```ts
// domain/factories/order-factory.ts
export class OrderFactory {
  constructor(private readonly discountPolicy: DiscountPolicy) {}

  fromCart(id: string, cart: Cart, now: Date): Order {
    if (cart.isEmpty()) throw new Error('Cannot create an order from an empty cart')

    const order = Order.create(id, cart.customerId)
    for (const line of cart.lines) {
      order.addItem(line.productId, line.unitPrice, line.quantity)
    }
    if (cart.coupon) {
      order.applyDiscount(this.discountPolicy.discountFor(cart.coupon, order.total(), now))
    }
    return order
  }
}
```

### 4. Factory Method por tipo (família do negócio)

Quando o **tipo** decide **qual** classe criar:

```ts
// data/freight.ts
export interface FreightService {
  calculatePrice(weightKg: number): Money
}

// domain/services/freight-express.ts
export class FreightExpressService implements FreightService {
  calculatePrice(weightKg: number) { return Money.fromCents(weightKg * 2000) }
}

// domain/services/freight-economy.ts
export class FreightEconomyService implements FreightService {
  calculatePrice(weightKg: number) { return Money.fromCents(weightKg * 1000) }
}

// domain/factories/freight-factory.ts
export class FreightFactory {
  static create(type: 'express' | 'economy'): FreightService {
    switch (type) {
      case 'express': return new FreightExpressService()
      case 'economy': return new FreightEconomyService()
    }
  }
}
```

> 📌 **Regra prática para escolher:**
> - **Factory Method**: para **famílias do negócio** que fogem de nomes arquiteturais (tipos de frete, de pagamento, de documento).
> - **Abstract Factory**: para **famílias arquiteturais** (fábrica de usecases, de repositories, de controllers). Isso aparece no Módulo 4.

## Factory x Builder

| | Factory | Builder |
|---|---|---|
| Decide | **Qual** objeto criar | **Como** montar, passo a passo |
| Chamada | Uma só | Encadeada: `.withX().withY().build()` |
| Bom para | Escolher entre tipos, nomes claros | Muitos parâmetros opcionais |

Os dois estão no Módulo 6.

## Quando usar / quando não usar

| Use | Evite |
|---|---|
| A criação tem várias etapas ou depende de outros objetos | Quando um `new` com construtor validado basta |
| Há várias formas nomeadas de criar | Para "esconder" um `new` sem lógica nenhuma |
| É preciso separar criação (com eventos) de reidratação (sem eventos) | |

## Para fixar

1. Por que separar `create` de `restore`?
2. Quando uma classe Factory é melhor que um static method?

<details>
<summary>Respostas</summary>

1. `create` é o nascimento: valida regras de criação e registra eventos. `restore` só remonta o estado salvo; se disparasse eventos, cada leitura do banco geraria eventos falsos.
2. Quando a criação depende de outros objetos ou serviços (uma política de desconto, por exemplo) que não fazem sentido dentro da classe criada.

</details>

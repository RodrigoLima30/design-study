# 7.2 · Testando cada bloco

Um roteiro do **que** testar em cada peça, com exemplos curtos.

## Checklist por peça

| Peça | Teste que... |
|---|---|
| **Value Object** | Rejeita valores inválidos · normaliza · compara por valor · operações devolvem novos objetos |
| **Entity** | Nasce válida · métodos de negócio mudam o estado corretamente · rejeita transições inválidas · igualdade por ID |
| **Aggregate** | Cada **invariante** do conjunto · coleções não podem ser alteradas de fora · eventos registrados |
| **Domain Service** | Resultado para entradas conhecidas · casos de borda · estratégia trocável |
| **Factory / Mapper** | Entrada crua vira objeto válido · entrada inválida propaga erro · ida e volta (`toDto(toDomain(x))`) |
| **Usecase** | Fluxo feliz · cada regra de aplicação (não encontrado, duplicado) · persistiu · publicou evento |
| **Controller** | Valida input (400) · permissão (403) · chama o usecase · formato da resposta |
| **Handler** | Mensagem inválida → `nack(false)` · sucesso → `ack()` · erro transitório → `nack(true)` · idempotência |
| **Repository real** | Salva e lê de volta (ida e volta) · consultas específicas · concorrência |
| **Adapter** | Traduz a resposta externa corretamente · trata erros da API |

## Value Object

```ts
describe('Postcode', () => {
  test.each(['12345', '123456789', 'abcde-fgh', ''])('rejects %p', (value) => {
    expect(() => new Postcode(value)).toThrow()
  })

  test('normalizes the dash', () => {
    expect(new Postcode('01310-100').value).toBe('01310100')
  })

  test('compares by value', () => {
    expect(new Postcode('01310-100').equals(new Postcode('01310100'))).toBe(true)
  })
})
```

## Aggregate: uma invariante por teste

```ts
describe('Order', () => {
  const now = new Date('2026-01-01')
  const price = Money.fromCents(1000)

  test('total is the sum of the items', () => {
    const order = Order.create('o-1', 'c-1')
    order.addItem('p-1', price, 2)
    order.addItem('p-2', price, 1)
    expect(order.total().cents).toBe(3000)
  })

  test('adding the same product increases the quantity', () => {
    const order = Order.create('o-1', 'c-1')
    order.addItem('p-1', price, 1)
    order.addItem('p-1', price, 2)
    expect(order.items).toHaveLength(1)
    expect(order.items[0].quantity).toBe(3)
  })

  test('cannot be placed empty', () => {
    expect(() => Order.create('o-1', 'c-1').place(now)).toThrow('empty')
  })

  test('cannot change items after being placed', () => {
    const order = Order.create('o-1', 'c-1')
    order.addItem('p-1', price, 1)
    order.place(now)
    expect(() => order.addItem('p-2', price, 1)).toThrow()
  })

  test('paid orders cannot be cancelled', () => {
    const order = Order.create('o-1', 'c-1')
    order.addItem('p-1', price, 1)
    order.place(now)
    order.markAsPaid(now)
    expect(() => order.cancel('x', now)).toThrow('refunded')
  })

  test('items cannot be changed from the outside', () => {
    const order = Order.create('o-1', 'c-1')
    order.addItem('p-1', price, 1)
    ;(order.items as OrderItem[]).length = 0
    expect(order.items).toHaveLength(1)
  })

  test('placing records OrderPlaced', () => {
    const order = Order.create('o-1', 'c-1')
    order.addItem('p-1', price, 1)
    order.place(now)
    expect(order.pullEvents().map((e) => e.name)).toEqual(['order.placed'])
  })
})
```

## Handler

```ts
describe('ShipmentStatusUpdatedHandler', () => {
  const setup = () => {
    const ack = vi.fn()   // ou jest.fn() / mock() do bun
    const nack = vi.fn()
    const repositories = new ShippingMemoryRepositoryFactory()
    const handler = new ShipmentStatusUpdatedHandler(new ShippingUseCaseFactory(repositories, new InMemoryPublisher()))
    return { ack, nack, handler, repositories }
  }

  test('rejects invalid messages without requeue', async () => {
    const { ack, nack, handler } = setup()
    await handler.handle({ wrong: true }, ack, nack)
    expect(nack).toHaveBeenCalledWith(false)
    expect(ack).not.toHaveBeenCalled()
  })

  test('acks after processing a valid message', async () => {
    const { ack, handler, repositories } = setup()
    await repositories.shipment().save(new ShipmentBuilder().withId('s-1').posted().build())
    await handler.handle({ shipmentId: 's-1', status: 'DELIVERED' }, ack, vi.fn())
    expect(ack).toHaveBeenCalledOnce()
  })
})
```

Aqui `ack` e `nack` são **spies**: verificar como foram chamados é exatamente o comportamento esperado do handler.

## Mapper: ida e volta

```ts
test('order survives a round trip through the persistence mapper', () => {
  const order = new OrderBuilder().withItem('p-1', 1000, 2).build()
  const restored = OrderMapper.toDomain(OrderMapper.toRow(order), OrderMapper.toItemRows(order))
  expect(restored.toJSON()).toEqual(order.toJSON())
})
```

## Repository real: teste de integração

Use um banco descartável (Testcontainers, ou um Postgres em Docker no CI) e rode as **mesmas** expectativas que o fake cumpre. Assim, o fake e o real ficam garantidamente equivalentes.

```ts
function repositoryContract(name: string, make: () => Promise<OrderRepository>) {
  describe(`${name} honors the OrderRepository contract`, () => {
    test('saves and finds by id', async () => {
      const repo = await make()
      const order = new OrderBuilder().withId('o-1').build()
      await repo.save(order)
      expect((await repo.findById('o-1'))?.toJSON()).toEqual(order.toJSON())
    })

    test('returns null when not found', async () => {
      expect(await (await make()).findById('missing')).toBeNull()
    })
  })
}

repositoryContract('memory', async () => new OrderMemoryRepository())
repositoryContract('postgres', async () => new OrderPostgresRepository(await testDatabase()))
```

> 💡 **Teste de contrato compartilhado**: o mesmo conjunto de testes roda contra o fake e contra o real. Se o fake divergir do real, o teste acusa.

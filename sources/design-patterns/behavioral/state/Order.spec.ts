import Order from './Order'

test('Deve criar um pedido e o status deve ser open', () => {
  const order = new Order()
  expect(order.status.value).toBe('open')
})

test('Deve criar um pedido mudar o status para confirmed', () => {
  const order = new Order()
  order.confirm()
  expect(order.status.value).toBe('confirmed')
})

test('Deve criar um pedido mudar o status para cancelled', () => {
  const order = new Order()
  order.cancel()
  expect(order.status.value).toBe('cancelled')
})

test('Deve criar um pedido, mudar o status para confirmed e mudar o status para open', () => {
  const order = new Order()
  order.confirm()
  expect(() => order.open()).toThrow(new Error('The order is already confirmed'))
})

test('Deve criar um pedido, mudar o status para confirmed e mudar o status para open', () => {
  const order = new Order()
  order.cancel()
  expect(() => order.open()).toThrow(new Error('The order is already cancelled'))
})

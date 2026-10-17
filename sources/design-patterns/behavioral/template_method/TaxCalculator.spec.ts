import Beer from './Beer'
import Cigar from './Cigar'
import TaxCalculator from './TaxCalculator'
import Water from './Water'

test('Deve calcular o valor do produto cerveja', () => {
  const product = new Beer(10)
  const taxCalculator = new TaxCalculator()
  const amount = taxCalculator.calculate(product)
  expect(amount).toBe(1)
})

test('Deve calcular o valor do produto cigarro', () => {
  const product = new Cigar(20)
  const taxCalculator = new TaxCalculator()
  const amount = taxCalculator.calculate(product)
  expect(amount).toBe(4)
})

test('Deve calcular o valor do produto água', () => {
  const product = new Water(5)
  const taxCalculator = new TaxCalculator()
  const amount = taxCalculator.calculate(product)
  expect(amount).toBe(0)
})

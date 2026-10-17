import ProductTax from './ProductTax'

export default class Beer extends ProductTax {
  constructor(price: number) {
    super('Beer', price, 10)
  }
}

import ProductTax from './ProductTax'

export default class Cigar extends ProductTax {
  constructor(price: number) {
    super('Cigar', price, 20)
  }
}

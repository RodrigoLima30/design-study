import Beer from './Beer'
import Product from './Product'
import ProductTax from './ProductTax'

export default class TaxCalculator {
  constructor() {}

  calculate(product: Product) {
    if (product instanceof ProductTax) {
      return (product.price * product.tax) / 100
    }
    return 0
  }
}

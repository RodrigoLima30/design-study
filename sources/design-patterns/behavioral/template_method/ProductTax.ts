import Product from './Product'

export default class ProductTax extends Product {
  tax: number

  constructor(name: string, price: number, tax: number) {
    super(name, price)

    this.tax = tax
  }
}

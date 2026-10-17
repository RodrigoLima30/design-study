import Product from './Product'

export default class Water extends Product {
  constructor(price: number) {
    super('Water', price)
  }
}

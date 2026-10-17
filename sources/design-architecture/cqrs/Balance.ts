export default class Balance {
  id: number
  amount: number
  created_at: Date

  constructor(id: number, amount: number, created_at: Date) {
    this.id = id
    this.amount = amount
    this.created_at = created_at
  }
}

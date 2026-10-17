export default class Account {
  id: number
  balance: number

  constructor(id: number, balance: number) {
    this.id = id
    this.balance = balance
  }

  debit(amount: number): void {
    this.balance -= amount
  }

  credit(amount: number): void {
    this.balance += amount
  }
}

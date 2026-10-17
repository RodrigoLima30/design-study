import Balance from './Balance'

export default class BalanceRepositoryMemory {
  balances: Balance[]

  constructor() {
    this.balances = []
  }

  getLastBalance(): Balance {
    return this.balances[this.balances.length - 1]
  }

  credit(balance: Balance): void {
    this.balances.push(balance)
  }

  debit(balance: Balance): void {
    this.balances.push(balance)
  }
}

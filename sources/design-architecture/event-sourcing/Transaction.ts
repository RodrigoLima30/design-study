import Account from './Account'

export default class Transaction {
  amount: number
  account: Account

  constructor(amount: number, account: Account) {
    this.amount = amount
    this.account = account
  }
}

import Account from './Account'

export default class CreditCommand {
  account: Account

  constructor(account: Account) {
    this.account = account
  }

  handle(amount: number): void {
    this.account.credit(amount)
  }
}

import Account from './Account'

export default class DebitCommand {
  account: Account

  constructor(account: Account) {
    this.account = account
  }

  handle(amount: number): void {
    this.account.debit(amount)
  }
}

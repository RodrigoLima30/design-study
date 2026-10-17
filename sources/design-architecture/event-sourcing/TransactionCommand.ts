import CreditCommand from './CreditCommand'
import DebitCommand from './DebitCommand'

export default class TransactionCommand {
  amount: number
  debitCommand: DebitCommand
  creditCommand: CreditCommand

  constructor(amount: number, debitCommand: DebitCommand, creditCommand: CreditCommand) {
    this.amount = amount
    this.debitCommand = debitCommand
    this.creditCommand = creditCommand
  }

  handle(): void {
    this.debitCommand.handle(this.amount)
    this.creditCommand.handle(this.amount)
  }
}

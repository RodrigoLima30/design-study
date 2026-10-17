import TransactionCommand from './TransactionCommand'

export default class TransactionEventBus {
  transactions = new Map<number, TransactionCommand>()

  publish(id: number, transaction: TransactionCommand): void {
    this.transactions.set(id, transaction)
  }
}

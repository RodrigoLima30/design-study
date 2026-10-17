import TransactionEventBus from './TransactionEventBus'

export default class CentralBank {
  transactionEventBus?: TransactionEventBus

  addTransactionEventBus(transactionEventBus: TransactionEventBus) {
    this.transactionEventBus = transactionEventBus
  }

  processTransactions(): void {
    if (!this.transactionEventBus) return

    for (const [id, transaction] of this.transactionEventBus.transactions) {
      transaction.handle()

      this.transactionEventBus.transactions.delete(id)
    }
  }
}

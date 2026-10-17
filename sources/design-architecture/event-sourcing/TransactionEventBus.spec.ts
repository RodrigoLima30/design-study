import Account from './Account'
import CentralBank from './CentralBank'
import CreditCommand from './CreditCommand'
import DebitCommand from './DebitCommand'
import ReversalTransactionCommand from './ReversalTransactionCommand'
import TransactionCommand from './TransactionCommand'
import TransactionEventBus from './TransactionEventBus'

test('Deve fazer um PIX', () => {
  const fromAccount = new Account(1, 1000)
  const toAccount = new Account(1, 0)
  const debitCommand = new DebitCommand(fromAccount)
  const creditCommand = new CreditCommand(toAccount)
  const transactionCommand = new TransactionCommand(500, debitCommand, creditCommand)
  const centralBank = new CentralBank()
  const transactionEventBus = new TransactionEventBus()

  transactionEventBus.publish(1, transactionCommand)
  centralBank.addTransactionEventBus(transactionEventBus)
  centralBank.processTransactions()

  expect(fromAccount.balance).toBe(500)
  expect(toAccount.balance).toBe(500)
})

test('Deve fazer um PIX e logo após estornar', () => {
  const fromAccount = new Account(1, 1000)
  const toAccount = new Account(1, 0)
  const debitCommand = new DebitCommand(fromAccount)
  const creditCommand = new CreditCommand(toAccount)
  const transactionCommand = new TransactionCommand(500, debitCommand, creditCommand)
  const centralBank = new CentralBank()
  const transactionEventBus = new TransactionEventBus()

  transactionEventBus.publish(1, transactionCommand)
  centralBank.addTransactionEventBus(transactionEventBus)
  centralBank.processTransactions()

  expect(fromAccount.balance).toBe(500)
  expect(toAccount.balance).toBe(500)

  const reversalDebitCommand = new DebitCommand(toAccount)
  const reversalCreditCommand = new CreditCommand(fromAccount)

  const reversalTransactionCommand = new ReversalTransactionCommand(
    transactionCommand.amount,
    reversalDebitCommand,
    reversalCreditCommand,
  )

  transactionEventBus.publish(2, reversalTransactionCommand)
  centralBank.processTransactions()

  expect(fromAccount.balance).toBe(1000)
  expect(toAccount.balance).toBe(0)
})

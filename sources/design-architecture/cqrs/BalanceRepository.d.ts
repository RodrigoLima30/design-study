import Balance from './Balance'

export default interface BalanceRepository {
  getLastBalance(): Balance
  credit(balance: Balance): void
  debit(balance: Balance): void
}

import Balance from './Balance'
import BalanceRepository from './BalanceRepository'
import CommandHandler from './CommandHandler'

export default class GetLastBalanceCommandHandler implements CommandHandler<Balance> {
  balanceRepository: BalanceRepository

  constructor(balanceRepository: BalanceRepository) {
    this.balanceRepository = balanceRepository
  }

  handle(): Balance {
    return this.balanceRepository.getLastBalance()
  }
}

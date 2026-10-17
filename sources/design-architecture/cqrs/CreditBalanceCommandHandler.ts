import CommandHandler from './CommandHandler.d'
import BalanceRepository from './BalanceRepository.d'
import CreditBalanceCommand from './CreditBalanceCommand'

export default class CreditBalanceCommandHandler implements CommandHandler<void> {
  balanceRepository: BalanceRepository

  constructor(balanceRepository: BalanceRepository) {
    this.balanceRepository = balanceRepository
  }

  handle(command: CreditBalanceCommand): void {
    this.balanceRepository.credit(command)
  }
}

import BalanceRepositoryMemory from './BalanceRepositoryMemory'
import CreditBalanceCommand from './CreditBalanceCommand'
import CreditBalanceCommandHandler from './CreditBalanceCommandHandler'
import GetLastBalanceCommandHandler from './GetLastBalanceCommandHandler'

test('Deve creditar na conta bancária', () => {
  const balanceRepository = new BalanceRepositoryMemory()
  const command = new CreditBalanceCommand(1, 1000, new Date('2022-01-31T00:00:00'))
  const creditBalanceCommandHandler = new CreditBalanceCommandHandler(balanceRepository)
  creditBalanceCommandHandler.handle(command)
  expect(balanceRepository.getLastBalance()?.amount).toBe(1000)
})

test('Deve creditar na conta bancária e obter o saldo via command', () => {
  const balanceRepository = new BalanceRepositoryMemory()
  const command = new CreditBalanceCommand(1, 1000, new Date('2022-01-31T00:00:00'))
  const creditBalanceCommandHandler = new CreditBalanceCommandHandler(balanceRepository)
  creditBalanceCommandHandler.handle(command)
  const getLastBalanceCommandHandler = new GetLastBalanceCommandHandler(balanceRepository)
  const balance = getLastBalanceCommandHandler.handle()
  expect(balance.amount).toBe(1000)
})

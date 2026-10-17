import Command from './Command.d'

export default interface CommandHandler<T> {
  handle(command: Command): T
}

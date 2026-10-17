import Observer from './Observer'

export default abstract class Observable {
  public observers: Observer[] = []

  register(observer: Observer) {
    this.observers.push(observer)
  }

  notifyAll() {
    for (const observer of this.observers) {
      observer.notify(this.getName(), this.getValue())
    }
  }

  abstract getName(): string

  abstract getValue(): string
}

import Observable from './Observable'

export default class InputText extends Observable {
  public value: string = ''

  constructor(private name: string) {
    super()
  }

  setValue(value: string) {
    this.value = value
    this.notifyAll()
  }

  getName(): string {
    return this.name
  }

  getValue(): string {
    return this.value
  }
}

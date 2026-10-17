import Observer from './Observer'

export default class Label implements Observer {
  public value: string = ''

  constructor(private expression: string) {
    this.expression = expression
  }

  notify(name: string, value: string): void {
    this.value = this.expression.replace(`{{${name}}}`, value)
  }
}

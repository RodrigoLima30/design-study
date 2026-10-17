import TicketCalculator from './TicketCalculator'

export default class ShoppingTicketCalculator implements TicketCalculator {
  calculate(period: number, checkinDate: Date, checkoutDate: Date): number {
    let amount = 0
    if (checkinDate.getHours() >= 12 && checkoutDate.getHours() <= 14) {
      amount = 0
    } else {
      amount = period * 3
    }
    return amount
  }
}

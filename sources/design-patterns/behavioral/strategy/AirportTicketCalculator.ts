import TicketCalculator from './TicketCalculator'

export default class AirportTicketCalculator implements TicketCalculator {
  calculate(period: number, checkinDate: Date, checkoutDate: Date): number {
    const minimumAmount = 10
    const minimumHours = 3
    const remainingHours = period - minimumHours
    let amount = minimumAmount
    if (remainingHours > 0) {
      amount += remainingHours * 3
    }
    return amount
  }
}

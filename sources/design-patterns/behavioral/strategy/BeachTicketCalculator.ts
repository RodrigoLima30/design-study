import TicketCalculator from './TicketCalculator'

export default class BeachTicketCalculator implements TicketCalculator {
  calculate(period: number, checkinDate: Date, checkoutDate: Date): number {
    const amount = period * 5
    return amount
  }
}

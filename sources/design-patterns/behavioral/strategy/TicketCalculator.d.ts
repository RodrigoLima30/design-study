export default interface TicketCalculator {
  calculate(period: number, checkinDate: Date, checkoutDate: Date): number
}

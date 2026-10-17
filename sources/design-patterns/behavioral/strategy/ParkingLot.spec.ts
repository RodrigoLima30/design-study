import AirportTicketCalculator from './AirportTicketCalculator'
import BeachTicketCalculator from './BeachTicketCalculator'
import ParkingLot from './ParkingLot'
import ShoppingTicketCalculator from './ShoppingTicketCalculator'

test('Deve calcular o valor do ticket para um carro que ficou 3 horas estacionado na praia', () => {
  const parkingLot = new ParkingLot('beach', new BeachTicketCalculator())
  parkingLot.checkin('ABC-1234', new Date('2022-01-25T10:00:00'))
  const ticket = parkingLot.checkout('ABC-1234', new Date('2022-01-25T13:00:00'))
  expect(ticket.amount).toBe(15)
})

test('Deve calcular o valor do ticket para um carro que ficou 10 horas estacionado na aeroporto', () => {
  const parkingLot = new ParkingLot('airport', new AirportTicketCalculator())
  parkingLot.checkin('ABC-1234', new Date('2022-01-25T10:00:00'))
  const ticket = parkingLot.checkout('ABC-1234', new Date('2022-01-25T20:00:00'))
  expect(ticket.amount).toBe(31)
})

test('Deve calcular o valor do ticket para um carro que ficou 2 horas estacionado no shopping', () => {
  const parkingLot = new ParkingLot('shopping', new ShoppingTicketCalculator())
  parkingLot.checkin('ABC-1234', new Date('2022-01-25T12:00:00'))
  const ticket = parkingLot.checkout('ABC-1234', new Date('2022-01-25T14:00:00'))
  expect(ticket.amount).toBe(0)
})

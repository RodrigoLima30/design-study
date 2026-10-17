import ChatRoom from './ChatRoom'
import Participant from './Participant'

test('Deve trocar mensagens diretamente', () => {
  const participantA = new Participant('A')
  const participantB = new Participant('B')
  const participantC = new Participant('C')
  participantA.send(participantB, 'Hello!')
  participantA.send(participantC, 'Hello!')
  participantB.send(participantA, 'Hello!')
  participantB.send(participantC, 'Hello!')
  participantC.send(participantA, 'Hello!')
  participantC.send(participantB, 'Hello!')
})

test('Deve trocar mensagens pelo chatroom', () => {
  const participantA = new Participant('A')
  const participantB = new Participant('B')
  const participantC = new Participant('C')
  const chatRoom = new ChatRoom()
  chatRoom.register(participantA)
  chatRoom.register(participantB)
  chatRoom.register(participantC)
  chatRoom.sendAll(participantA, 'Hello!')
  chatRoom.sendAll(participantB, 'Hello!')
  chatRoom.sendAll(participantC, 'Hello!')
})

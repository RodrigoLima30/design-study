# Design Patterns - Behavioral - Mediator

Encapsula a comunicação entre objetos por meio de um mediador, promovendo baixo acoplamento e permitindo alterações independentes nas interações. Ele evita conexões diretas entre objetos, reduzindo a complexidade de sistemas com muitas interdependências, mas pode tornar o mediador um componente complexo.

### Motivação

- A distribuição de comportamento em orientação a objetos pode levar a muitas interconexões, reduzindo a reutilização de código e criando sistemas monolíticos;
- O Mediator centraliza a comunicação, substituindo relações muitos-para-muitos por um-para-muitos, facilitando manutenção e reutilização.

## Exemplo

Um sistema de chat é usado para ilustrar o padrão:

- Existem várias salas de chat, cada uma com um ChatBot moderador;
- Usuários (humanos ou ChatBot) podem ser adicionados/removedos dinamicamente, pertencendo a apenas uma sala por vez;
- Mensagens são enviadas via mediador, e o ChatBot bloqueia mensagens consecutivas do mesmo usuário.

Quanto mais usuários estiverem no chat, mais ligações serão necessárias entre eles e maior será o acoplamento.

Para contornar isso, podemos utilizar um Mediator.

Deste modo os usuários não irão mais se comunicar de forma direta. Na verdade, nem saberão que os outros usuários existem, pois só conhecerão e se comunicarão com o mediador.

### Estrutura

- Mediator: Define métodos para gerenciar usuários e mensagens;
- Colega: Base para usuários, com métodos para enviar/receber mensagens;
- MediadorConcreto: Implementa a lógica de comunicação, gerenciando usuários e validando mensagens via ChatBot.

## Código

```ts
interface ChatRoomMediator {
  new (chatBot: ChatBot, name: string): void;
  sendMessage(message: string, user: User): void;
  addUser(user: User): void;
  removeUser(user: User): void;
  getName(): string;
}

abstract class User {
  protected mediator: ChatRoomMediator | null = null;
  constructor(private name: string) {
    this.name = name;
  }
  setMediator(mediator: ChatRoomMediator): void {
    if (this.mediator !== null) {
      this.mediator.removeUser(this);
    }
    this.mediator = mediator;
    this.mediator.addUser(this);
  }
  getName(): string {
    return this.name;
  }
  abstract send(message: string): void;
  abstract receive(message: string): void;
}

class Human extends User {
  send(message: string): void {
    console.log(`\n--- ${this.mediator!.getName()} ---`);
    console.log(`${this.getName()} sent: ${message}`);
    this.mediator!.sendMessage(message, this);
  }
  receive(message: string): void {
    console.log(`${this.getName()} received: ${message}`);
  }
}

class ChatBot extends User {
  private lastUser: User;
  constructor() {
    super("CHATBOT");
    this.lastUser = this;
  }
  send(message: string): void {
    console.log(`## ${this.getName()} sent: ${message} ##\n---`);
    this.mediator!.sendMessage(message, this);
  }
  receive(message: string): void {
    console.log(`${this.getName()} received: ${message}`);
  }
  validateMessage(user: User): boolean {
    if (this.lastUser === user) {
      this.send(`A message from ${user.getName()} was denied`);
      return false;
    }
    this.lastUser = user;
    return true;
  }
}

class ChatRoomMediator implements ChatRoomMediator {
  private users: User[] = [];
  constructor(
    private chatBot: ChatBot,
    private name: string,
  ) {
    this.chatBot.setMediator(this);
  }
  sendMessage(message: string, user: User): void {
    if (this.chatBot.validateMessage(user)) {
      for (const u of this.users) {
        if (u !== user) {
          u.receive(message);
        }
      }
    }
  }
  addUser(user: User): void {
    this.users.push(user);
  }
  removeUser(user: User): void {
    this.users = this.users.filter((u) => u !== user);
  }
  getName(): string {
    return this.name;
  }
}

const chatBot1 = new ChatBot();
const chatRoom1 = new ChatRoomMediator(chatBot1, "Chat Room 1");

const chatBot2 = new ChatBot();
const chatRoom2 = new ChatRoomMediator(chatBot2, "Chat Room 2");

const john = new Human("John");
const mary = new Human("Mary");
const paul = new Human("Paul");
const lucia = new Human("Lucia");
const peter = new Human("Peter");

john.setMediator(chatRoom1);
mary.setMediator(chatRoom1);
paul.setMediator(chatRoom1);
lucia.setMediator(chatRoom2);
peter.setMediator(chatRoom2);

console.log("[Room 1] John sends his first message");
john.send("Hello everyone in room 1, all good?");

console.log("\n[Room 2] Lucia sends her first message");
lucia.send("Hello Peter, all good?");

console.log("\n[Room 1] Paul responds to John");
paul.send("All good with me!");

console.log("\n[Room 1] Paul tries to send two consecutive messages");
paul.send("And with you?");

console.log(
  "\n[Room 2] Peter does not respond, Lucia tries to send another message",
);
lucia.send("Peter, are you there?");

console.log("\nLucia switches chat room");
lucia.setMediator(chatRoom1);

console.log("\n[Room 1] Lucia sends her first message in room 1");
lucia.send("Hello people in room 1, I’m Lucia. All good?");
```

Saída:

```
[Room 1] John sends his first message
--- Chat Room 1 ---
John sent: Hello everyone in room 1, all good?
CHATBOT received: Hello everyone in room 1, all good?
Mary received: Hello everyone in room 1, all good?
Paul received: Hello everyone in room 1, all good?

[Room 2] Lucia sends her first message
--- Chat Room 2 ---
Lucia sent: Hello Peter, all good?
CHATBOT received: Hello Peter, all good?
Peter received: Hello Peter, all good?

[Room 1] Paul responds to John
--- Chat Room 1 ---
Paul sent: All good with me!
CHATBOT received: All good with me!
John received: All good with me!
Mary received: All good with me!

[Room 1] Paul tries to send two consecutive messages
--- Chat Room 1 ---
Paul sent: And with you?
## CHATBOT sent: A message from Paul was denied ##
---
John received: A message from Paul was denied
Mary received: A message from Paul was denied
Paul received: A message from Paul was denied

[Room 2] Peter does not respond, Lucia tries to send another message
--- Chat Room 2 ---
Lucia sent: Peter, are you there?
## CHATBOT sent: A message from Lucia was denied ##
---
Lucia received: A message from Lucia was denied
Peter received: A message from Lucia was denied

Lucia switches chat room

[Room 1] Lucia sends her first message in room 1
--- Chat Room 1 ---
Lucia sent: Hello people in room 1, I’m Lucia. All good?
CHATBOT received: Hello people in room 1, I’m Lucia. All good?
John received: Hello people in room 1, I’m Lucia. All good?
Mary received: Hello people in room 1, I’m Lucia. All good?
Paul received: Hello people in room 1, I’m Lucia. All good?
```

### Consequências

Vantagens:

- Centraliza comportamento;
- Segue princípios Aberto/Fechado e Responsabilidade Única;
- Facilita manutenção e abstrai interações.

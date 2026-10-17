# Design Patterns - Structural - Bridge

Desacopla uma abstração de sua implementação, permitindo que ambas variem independentemente.

Ele divide uma classe ou conjunto de classes em duas hierarquias separadas: uma para abstração e outra para implementação.

Isso resolve problemas de herança excessiva, onde a criação de subclasses para cada combinação de abstração e implementação resulta em um crescimento exponencial de classes.

### Motivação

O uso de herança para suportar múltiplas implementações de uma abstração vincula permanentemente a abstração à implementação, dificultando modificações, extensões e reutilizações independentes.

Por exemplo, em um sistema de mensagens com tipos de usuário (administrador e usuário) e canais de envio (e-mail, SMS), a herança cria subclasses para cada combinação, como MensagemAdminEmail e MensagemUsuarioSMS.

Adicionar novos canais ou tipos de usuário aumenta significativamente o número de classes.

### Contexto

O padrão resolve isso seguindo o princípio de "priorizar composição sobre herança".

A hierarquia de abstração (e.g., tipos de usuário) referencia uma hierarquia de implementação (e.g., canais de envio) por meio de uma interface, permitindo extensibilidade sem modificar as hierarquias existentes.

No exemplo, a classe Mensagem mantém uma referência a uma interface CanalDeEnvioInterface, que define o método de envio, enquanto classes concretas como Email e SMS implementam essa interface.

## Exemplo

Vamos ver como ficaria o código do diagrama de classes acima

```ts
interface MessageChannel {
  sendMessage(subject: string, message: string): void;
}

class Email implements MessageChannel {
  sendMessage(subject: string, message: string): void {
    console.log("=== Message Sent via EMAIL ===");
    console.log(`SUBJECT: ${subject}`);
    console.log(`MESSAGE: ${message}\n`);
  }
}

class SMS implements MessageChannel {
  sendMessage(subject: string, message: string): void {
    console.log("=== Message Sent via SMS ===");
    console.log(`SUBJECT: ${subject}`);
    console.log("-----");
    console.log(`MESSAGE: ${message}\n`);
  }
}

abstract class Message {
  protected channel: MessageChannel;
  protected subject: string;
  protected message: string;

  constructor(channel: MessageChannel) {
    this.channel = channel;
    this.subject = "";
    this.message = "";
  }

  setSubject(subject: string): void {
    this.subject = subject;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  abstract send(): void;
}

class AdminMessage extends Message {
  send(): void {
    console.log("Message sent by ADMIN");
    this.channel.sendMessage(this.subject, this.message);
  }
}

class UserMessage extends Message {
  send(): void {
    console.log("Message sent by USER");
    this.channel.sendMessage(this.subject, this.message);
  }
}

const emailChannel = new Email();
let message = new AdminMessage(emailChannel);
message.setSubject("First message");
message.setMessage("Hello User");
message.send();

message = new UserMessage(emailChannel);
message.setSubject("First message");
message.setMessage("Hello Admin");
message.send();

const smsChannel = new SMS();
message = new AdminMessage(smsChannel);
message.setSubject("Second message");
message.setMessage("Hello User");
message.send();

message = new UserMessage(smsChannel);
message.setSubject("Second message");
message.setMessage("Hello Admin");
message.send();
```

Saída:

```ts
Mensagem enviada pelo ADMINISTRADOR
=== Mensagem Enviada por E-MAIL ===
ASSUNTO: Primeira mensagem
-----------------
MENSAGEM: Olá Usuário
Mensagem enviada por um USUÁRIO
=== Mensagem Enviada por E-MAIL ===
ASSUNTO: Primeira mensagem
-----------------
MENSAGEM: Olá Administrador
Mensagem enviada pelo ADMINISTRADOR
=== Mensagem Enviada por SMS ===
ASSUNTO: Segunda mensagem
-----------------
MENSAGEM: Olá Usuário
Mensagem enviada por um USUÁRIO
=== Mensagem Enviada por SMS ===
ASSUNTO: Segunda mensagem
-----------------
MENSAGEM: Olá Administrador
```

Agora existem hierarquias de classes separadas, uma para o tipo de usuário e outra para o canal de envio.

Com a nova configuração a Mensagem pode delegar qualquer trabalho referente ao canal de envio para o objeto ligado a CanalDeEnvioInterface.

Essa referência vai agir como uma ponte (em inglês bridge) entre as classes Mensagem e CanalDeEnvioInterface.

De agora em diante, para adicionar novos canais de envio ou novos usuários não será necessário mudar a hierarquia de Mensagem e vice-versa.

### Componentes

- Abstracao: Define a interface da abstração e mantém uma referência ao implementador;
- RedefinicaoDaAbstracao (opcional): Estende a abstração;
- Implementador: Define a interface para as classes de implementação. Geralmente com operações primitivas;
- ConcretoImplementor: Implementa a interface do implementador.

### Aplicabilidade

- Evitar ligação permanente entre abstração e implementação;
- Permitir extensibilidade independente de abstrações e implementações;
- Evitar impacto em clientes ao mudar implementações;
- Reduzir proliferação de classes em hierarquias complexas;
- Compartilhar implementações entre objetos sem expor detalhes ao cliente.

### Benefícios

- Extensibilidade aprimorada, permitindo adicionar novas abstrações ou implementações sem alterar as existentes;
- Ocultação de detalhes de implementação dos clientes.

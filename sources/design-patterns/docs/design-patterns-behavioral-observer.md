# Design Patterns - Behavioral - Observer

Um padrão comportamental que estabelece uma dependência um-para-muitos entre objetos, permitindo que mudanças no estado de um objeto (subject) notifiquem automaticamente seus dependentes (observers).

### Resumo

Definição: O padrão Observer define uma relação um-para-muitos, onde um objeto (subject) notifica seus observadores sobre mudanças de estado sem acoplamento forte, promovendo flexibilidade e reutilização.

### Motivação

- Mantém consistência entre objetos relacionados sem acoplamento forte;
- Permite interação entre objetos sem expor estruturas internas;
- Exemplo: Uma newsletter (subject) notifica assinantes (observers), como clientes, funcionários, parceiros e fornecedores, sobre novos e-mails.

```ts
interface Observer {
    update(mensagem: string): void;
    getNome(): string;
    getEmail(): string;
}

interface Subject {
    registerObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
}

class Email {
    static enviarEmail(observer: Observer, mensagem: string): void {
        console.log(`Email enviado para ${observer.getNome()} - ${observer.getEmail()}`);
        console.log(`Mensagem: ${mensagem}\n`);
    }
}

class Cliente implements Observer {
    constructor(private readonly nome: string, private readonly email: string, private readonly subject: Subject) {
        this.subject.registerObserver(this);
    }
    update(mensagem: string): void {
        Email.enviarEmail(this, mensagem);
    }
    getNome(): string {
        return this.nome;
    }
    getEmail(): string {
        return this.email;
    }
}

class Funcionario implements Observer {
    constructor(private readonly nome: string, private readonly email: string, private readonly subject: Subject) {
        this.subject.registerObserver(this);
    }
    update(mensagem: string): void {
        Email.enviarEmail(this, mensagem);
    }
    getNome(): string {
        return this.nome;
    }
    getEmail(): string {
        return this.email;
    }
}

class Parceiro implements Observer {
    constructor(private readonly nome: string, private readonly email: string, private readonly subject: Subject) {
        this.subject.registerObserver(this);
    }
    update(mensagem: string): void {
        Email.enviarEmail(this, mensagem);
    }
    getNome(): string {
        return this.nome;
    }
    getEmail(): string {
        return this.email;
    }
}

class Fornecedor implements Observer {
    constructor(private readonly nome: string, private readonly email: string, private readonly subject: Subject) {
        this.subject.registerObserver(this);
    }
    update(mensagem: string): void {
        Email.enviarEmail(this, mensagem);
    }
    getNome(): string {
        return this.nome;
    }
    getEmail(): string {
        return this.email;
    }
}

class Newsletter implements Subject {
    private observers: Observer[] = [];
    private mensagens: string[] = [];
    registerObserver(private readonly observer: Observer): void {
        this.observers.push(observer);
    }
    removeObserver(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.mensagens[this.mensagens.length - 1]);
        }
    }
    addMensagem(mensagem: string): void {
        this.mensagens.push(mensagem);
        this.notifyObservers();
    }
}
```

Testando...

```ts
const newsletter = new Newsletter();
const funcionario1 = new Funcionario(
  "Funcionario 1",
  "funcionario1@email.com",
  newsletter,
);
const funcionario2 = new Funcionario(
  "Funcionario 2",
  "funcionario2@email.com",
  newsletter,
);
const cliente = new Cliente("Cliente 1", "cliente1@email.com", newsletter);
const parceiro = new Parceiro("Parceiro 1", "parceiro1@email.com", newsletter);
const fornecedor = new Fornecedor(
  "Fornecedor 1",
  "fornecedor1@email.com",
  newsletter,
);

newsletter.addMensagem("Primeira Mensagem");
console.log("#####\n");
newsletter.removeObserver(funcionario2);
newsletter.addMensagem("Segunda Mensagem");
console.log("#####\n");
newsletter.registerObserver(funcionario2);
newsletter.addMensagem("Terceira Mensagem");
```

Exemplo de saída:

```
Email enviado para Funcionario 1 - funcionario1@email.com
Mensagem: Primeira Mensagem
#####
Email enviado para Funcionario 1 - funcionario1@email.com
Mensagem: Segunda Mensagem
#####
Email enviado para Funcionario 2 - funcionario2@email.com
Mensagem: Terceira Mensagem
```

### Aplicabilidade

- Quando uma abstração tem aspectos interdependentes que precisam variar independentemente;
- Quando mudanças em um objeto requerem atualizações em outros, sem saber quantos;
- Quando objetos devem notificar outros sem acoplamento forte.

### Componentes principais

- Subject: Interface para registrar/remover observadores e notificá-los;
- Observer: Interface para objetos que recebem atualizações;
- AssuntoConcreto: Implementa Subject, gerencia observadores e notifica mudanças;
- ObservadoresConcretos: Implementam Observer, registram-se no Subject e recebem atualizações.

### Consequências

- Permite variação independente de Subjects e Observers;
- Acoplamento abstrato via interfaces;
- Suporte a comunicação por broadcast;
- Pode causar atualizações inesperadas se dependências não forem bem gerenciadas.

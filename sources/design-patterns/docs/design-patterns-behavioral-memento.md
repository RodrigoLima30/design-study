# Design Patterns - Behavioral - Memento

Permite capturar e armazenar o estado interno de um objeto (Originador) sem violar o encapsulamento, possibilitando sua restauração posterior.

O padrão é útil para implementar funcionalidades como pontos de verificação (checkpoints) e operações de desfazer (undo), mantendo a integridade dos atributos privados do objeto.

### Implementações

Usando classes aninhadas

A classe Memento é aninhada no Originador, permitindo acesso amplo aos seus dados privados.

O Cuidador tem acesso limitado, garantindo encapsulamento.

#### Usando interface intermediária

Uma interface (MementoInterface) limita o acesso do Cuidador ao Memento, que só pode recuperar estados via métodos específicos;

O Originador usa uma interface ampla para criar/restaurar Mementos.

#### Encapsulamento mais restritivo

O Memento mantém uma referência ao Originador e implementa o método de restauração (restaurar()), eliminando a dependência direta do Cuidador sobre o Originador;

Permite gerenciar múltiplos Originadores de forma independente.

## Exemplo

Este exemplo demonstra como o padrão Memento gerencia estados de um objeto, permitindo salvar e restaurar snapshots sem violar o encapsulamento, com um Cuidador que armazena e recupera Mementos de forma segura.

```ts
class Originator {
  constructor(private state: string) {
    console.log(`Originator: My initial state is: ${state}`);
  }
  public doSomething(): void {
    console.log("Originator: I'm doing something important.");
    this.state = this.generateRandomString(30);
    console.log(`Originator: and my state has changed to: ${this.state}`);
  }
  private generateRandomString(length: number = 10): string {
    const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.apply(null, { length })
      .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
      .join("");
  }
  public save(): Memento {
    return new ConcreteMemento(this.state);
  }
  public restore(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Originator: My state has changed to: ${this.state}`);
  }
}

interface Memento {
  getState(): string;
  getName(): string;
  getDate(): string;
}

class ConcreteMemento implements Memento {
  private date: string;
  constructor(private state: string) {
    this.date = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
  public getState(): string {
    return this.state;
  }
  public getName(): string {
    return `${this.date} / (${this.state.substr(0, 9)}...)`;
  }
  public getDate(): string {
    return this.date;
  }
}

class Caretaker {
  private mementos: Memento[] = [];
  constructor(private originator: Originator) {}
  public backup(): void {
    console.log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }
  public undo(): void {
    if (!this.mementos.length) {
      return;
    }
    const memento = this.mementos.pop();
    console.log(`Caretaker: Restoring state to: ${memento.getName()}`);
    this.originator.restore(memento);
  }
  public showHistory(): void {
    console.log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
  }
}

const originator = new Originator("Super-duper-super-puper-super.");
const caretaker = new Caretaker(originator);

caretaker.backup();
originator.doSomething();

caretaker.backup();
originator.doSomething();

caretaker.backup();
originator.doSomething();

console.log("");
caretaker.showHistory();

console.log("\nClient: Now, let's rollback!\n");
caretaker.undo();

console.log("\nClient: Once more!\n");
caretaker.undo();
```

Saída:

```
Originator: My initial state is: Super-duper-super-puper-super.

Caretaker: Saving Originator's state...
Originator: I'm doing something important.
Originator: and my state has changed to: qXqxgTcLSCeLYdcgElOghOFhPGfMxo

Caretaker: Saving Originator's state...
Originator: I'm doing something important.
Originator: and my state has changed to: iaVCJVryJwWwbipieensfodeMSWvUY

Caretaker: Saving Originator's state...
Originator: I'm doing something important.
Originator: and my state has changed to: oSUxsOCiZEnohBMQEjwnPWJLGnwGmy

Caretaker: Here's the list of mementos:
2019-02-17 15:14:05 / (Super-dup...)
2019-02-17 15:14:05 / (qXqxgTcLS...)
2019-02-17 15:14:05 / (iaVCJVryJ...)

Client: Now, let's rollback!

Caretaker: Restoring state to: 2019-02-17 15:14:05 / (iaVCJVryJ...)
Originator: My state has changed to: iaVCJVryJwWwbipieensfodeMSWvUY

Client: Once more!

Caretaker: Restoring state to: 2019-02-17 15:14:05 / (qXqxgTcLS...)
Originator: My state has changed to: qXqxgTcLSCeLYdcgElOghOFhPGfMxo
```

### Motivação

- Necessidade de salvar o estado interno de um objeto para operações como "desfazer" (Ctrl+Z) ou recuperação de erros;
- Evitar a exposição direta de atributos privados, preservando o encapsulamento;
- Um Memento armazena um "snapshot" do estado do Originador, permitindo sua restauração sem comprometer a estrutura interna.

### Componentes

- Memento: Armazena o estado interno do Originador. Possui duas interfaces:
- Interface mínima: Usada pelo Cuidador, que apenas armazena e passa o Memento, sem acessar ou modificar seu conteúdo;
- Interface ampla: Usada pelo Originador para acessar e restaurar o estado;
- Geralmente imutável, com dados passados pelo construtor.
- Originador: Cria o Memento com o estado atual e o utiliza para restaurar estados anteriores;
- Cuidador: Gerencia os Mementos, armazenando-os em uma pilha e os recuperando para restauração, sem manipular o conteúdo interno.

### Aplicabilidade

- Quando é necessário salvar um estado (total ou parcial) de um objeto para restauração futura;
- Quando se deseja evitar a exposição direta do estado interno, preservando o encapsulamento.

### Consequências

- Vantagens:
  - Preserva o encapsulamento, evitando exposição de dados privados;
  - Simplifica o Originador, delegando o gerenciamento de estados ao Cuidador.
- Desvantagens:
  - Pode ser custoso em termos de memória se o Memento armazenar grandes quantidades de dados;
  - Em linguagens sem classes aninhadas, garantir o encapsulamento pode ser desafiador;
  - O Cuidador pode enfrentar sobrecarga ao gerenciar muitos Mementos sem conhecer seu tamanho.

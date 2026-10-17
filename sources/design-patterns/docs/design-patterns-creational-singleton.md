# Design Patterns - Creational - Singleton

Garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela.

É útil em cenários como conexões com bancos de dados, onde múltiplas instâncias podem causar perda de desempenho.

No exemplo, a classe MySQL é implementada como Singleton para compartilhar uma única conexão entre contextos, usando um método estático getInstance() para controlar a criação da instância.

### Contexto

Considere que temos as classes abaixo já implementadas no sistema:

Em cada contexto distinto de um sistema, sempre que o método executeQuery() é necessário, uma nova instância de MySql precisa ser criada previamente.

Uma instância de MySQL pode ser compartilhada entre todos os contextos de um código e por meio do Singleton podemos ter apenas um objeto criado.

## Exemplo

```ts
interface Connection {
  executeQuery(query: string): Array<any> | null;
}

class MySQL implements Connection {
  private static instance: MySQL | null = null;
  private host: string;
  private user: string;
  private password: string;
  private constructor() {
    this.host = "mysql:host=localhost;dbname=database";
    this.user = "pedrosilva";
    this.password = "pedro123";
  }
  private clone(): void {}
  private wakeup(): void {}
  public static getInstance(): MySQL {
    if (MySQL.instance === null) {
      MySQL.instance = new MySQL();
    }
    return MySQL.instance;
  }
  public static executeQuery(query: string): Array<any> | null {
    console.log(`A query: \n${query}\nfoi executada com sucesso\n`);
    return null;
  }
  public setHost(host: string): void {
    this.host = host;
  }
  public setUser(user: string): void {
    this.user = user;
  }
  public setPassword(password: string): void {
    this.password = password;
  }
  public toString(): string {
    return JSON.stringify({
      host: this.host,
      user: this.user,
      password: this.password,
    });
  }
}

const bancoMySql1 = MySQL.getInstance();

const query = `CREATE TABLE usuario (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(60),
  senha VARCHAR(100)
)`;

MySQL.executeQuery(query);

console.log("\n==== bancoMySql1 ====\n");

console.log(bancoMySql1.toString());

const bancoMySql2 = MySQL.getInstance();

console.log("\n==== bancoMySql2 ====\n");

console.log(bancoMySql2.toString());

console.log("\n==== MUDANÇA DE USUÁRIO EM bancoMySql1 ====\n");

bancoMySql1.setUser("mariaDaSilva");

console.log("\n==== bancoMySql1 ====\n");

console.log(bancoMySql1.toString());

console.log("\n==== bancoMySql2 ====\n");

console.log(bancoMySql2.toString());
```

```
A query:
'CREATE TABLE usuario (
id INT(11) AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(60),
senha VARCHAR(100)
)'
foi executada com sucesso

==== bancoMySql1 ====

{"host":"mysql:host=localhost;dbname=bancoDeDados","user":"pedrosilva","password":"pedro123"}

==== bancoMySql2 ====

{"host":"mysql:host=localhost;dbname=bancoDeDados","user":"pedrosilva","password":"pedro123"}

==== MUDANÇA DE USUÁRIO EM bancoMySql1 ====

==== bancoMySql1 ====

{"host":"mysql:host=localhost;dbname=bancoDeDados","user":"mariaDaSilva","password":"pedro123"}

==== bancoMySql2 ====

{"host":"mysql:host=localhost;dbname=bancoDeDados","user":"mariaDaSilva","password":"pedro123"}
```

Repare na saída que ao editar o valor do atributo user de bancoMySql1 ele também foi editado em bancoMySql2.

Isso ocorre devido ao fato de bancoMySql1 e bancoMySql2 serem exatamente a mesma instância de MySQL.

### Componentes

#### Singleton

Esse diagrama de classes é composto por apenas uma classe.

- O atributo uniqueInstance contém a única instância de Singleton;
- O método getInstance() é estático, o que significa que é um método de classe, então pode ser acessado a partir de qualquer lugar do código utilizando Singleton::getInstance.

### Características

- Um atributo estático instance armazena a única instância;
- Construtor privado impede instanciação direta;
- Métodos clone e wakeup privados evitam duplicação;
- O método getInstance() cria a instância apenas na primeira chamada.

### Vantagens

- Controle de acesso à instância única;
- Permite refinamento via subclasses;
- Flexibilidade para ajustar o número de instâncias.

### Desvantagens

- Atua como variável global, podendo causar efeitos colaterais;
- Dificulta testes unitários devido a acoplamento;
- Viola o Princípio de Responsabilidade Única;
- Não é thread-safe por padrão;
- Pode ser comprometido por clonagem ou serialização se não tratado.

### Aplicabilidade

Usar quando uma única instância é necessária e deve ser acessível globalmente, com controle estrito de acesso.

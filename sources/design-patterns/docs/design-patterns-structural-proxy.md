# Design Patterns - Structural - Proxy

Fornece um substituto para gerenciar o acesso a um objeto, sendo útil para objetos remotos, custosos ou que requerem segurança. Existem três tipos principais:

### Proxy Remoto

Controla acesso a objetos em diferentes espaços de endereçamento, como em sistemas distribuídos, onde o proxy atua como representante local, delegando solicitações ao objeto real via rede.

### Proxy Virtual

Adia a criação de objetos custosos (lazy initialization) até que sejam necessários, otimizando recursos.

### Proxy de Proteção

Gerencia acesso a objetos com base em permissões, verificando se o cliente tem direitos para acessar ou modificar recursos.

## Exemplo

O documento apresenta um exemplo prático com a classe PessoaFisicaReceitaFederal, que consome uma API lenta (5 segundos para instanciar, 2-3 segundos por método).

Para otimizar, é implementado um proxy virtual (PessoaFisicaReceitaFederalProxy) que adia a criação do objeto real até que métodos como getNome(), getIdade() ou CPFAtivo() sejam chamados, reduzindo o tempo de execução quando apenas dados do usuário são necessários.

A classe Usuario usa o Proxy, implementando uma interface ReceitaFederalInterface para garantir compatibilidade.

O Proxy também pode armazenar respostas em cache para evitar chamadas repetidas à API.

```ts
interface FederalRevenueInterface {
  new (cpf: string): void;
  getName(): string;
  getAge(): number;
  isCPFActive(): boolean;
}

class FederalRevenuePerson implements FederalRevenueInterface {
  private name: string;
  private age: number;
  private cpfActive: boolean;
  constructor(private cpf: string) {
    this.cpf = cpf;
    this.name = "John Doe";
    this.age = 25;
    this.cpfActive = true;
    setTimeout(() => {}, 5000);
    console.log("FederalRevenuePerson created successfully");
  }
  getName(): string {
    setTimeout(() => {}, 2000);
    return this.name;
  }
  getAge(): number {
    setTimeout(() => {}, 2000);
    return this.age;
  }
  isCPFActive(): boolean {
    setTimeout(() => {}, 3000);
    return this.cpfActive;
  }
}

class FederalRevenuePersonProxy implements FederalRevenueInterface {
  private personRf: FederalRevenueInterface | null = null;

  constructor(private cpf: string) {}

  private createFederalRevenuePerson(): void {
    if (!this.personRf) {
      this.personRf = new FederalRevenuePerson(this.cpf);
    }
  }

  getName(): string {
    this.createFederalRevenuePerson();
    return this.personRf!.getName();
  }

  getAge(): number {
    this.createFederalRevenuePerson();
    return this.personRf!.getAge();
  }

  isCPFActive(): boolean {
    this.createFederalRevenuePerson();
    return this.personRf!.isCPFActive();
  }
}

class User {
  private person: FederalRevenueInterface;
  constructor(
    private name: string,
    private cpf: string,
    private age: number,
  ) {
    this.person = new FederalRevenuePersonProxy(cpf);
  }
  validateName(): boolean {
    return this.name === this.person.getName();
  }
  verifyCPFActive(): boolean {
    return this.person.isCPFActive();
  }
  verifyMajority(): boolean {
    return this.age >= 18 && this.age === this.person.getAge();
  }
  getName(): string {
    return this.name;
  }
  getCpf(): string {
    return this.cpf;
  }
  getAge(): number {
    return this.age;
  }
}
```

Desta forma, a execução após instanciação da classe Usuário será feita instantaneamente.

```ts
const user = new User("John Doe", "11122233344", 25);

console.log(user.getName());
```

Saída:

```
João da Silva
```

Isso se dá devido ao fato da classe PessoaFisicaReceitaFederal não ser mais instanciada no construtor da classe Usuario, portanto, serão economizados os 5 segundos que a classe PessoaFisicaReceitaFederal leva para ser instanciada.

Isso é possível graças a Proxy que está intermediando essa comunicação.

Os métodos validarNome(), VerificaCPFAtivo() e verificarMaioridade() da classe Usuario, precisam de uma instância da classe PessoaFisicaReceitaFederal.

Somente quando eles são chamados essa classe será instanciada.

````ts
const user = new User('John Doe', '11122233344', 25);

if (user.verifyMajority()) {
  console.log("The user is of legal age");
} else {
  console.log("The user is not of legal age");
}
```

Saída:

```
O usuário é maior de idade
```

### Aplicabilidade

- Proxy remoto: para objetos em espaços diferentes;
- Proxy virtual: para criação sob demanda de objetos custosos;
- Proxy de proteção: para controle de acesso;
- Referências inteligentes: para contagem de referências, carregamento persistente ou verificação de bloqueio.

### Componentes

- Cliente: Consome o proxy;
- Objeto: Interface comum para proxy e objeto real;
- Objeto Real: Executa as solicitações;
- Proxy: Controla acesso, cria ou exclui o objeto real.

### Consequências

- Oculta a localização de objetos (proxy remoto);
- Otimiza criação (proxy virtual);
- Permite controle de acesso (proxy de proteção);
- Respeita o princípio Aberto/Fechado;
- Pode aumentar complexidade e latência.
````

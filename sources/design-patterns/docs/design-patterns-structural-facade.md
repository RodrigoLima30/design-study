# Design Patterns - Structural - Decorator

Permite adicionar responsabilidades a objetos dinamicamente, sendo uma alternativa flexível à herança para estender funcionalidades.

No exemplo de uma pizzaria, onde pizzas (Frango: R$19,00, Calabresa: R$25,00, Queijo: R$22,00) podem receber acréscimos (borda recheada: R$8,50, massa integral: R$5,00), o padrão evita a criação de subclasses para cada combinação possível, que seria inviável devido ao crescimento exponencial de classes.

Usar herança é inflexível, pois acréscimos são definidos estaticamente, o que não é ideal para casos como pizzas doces, onde certos acréscimos (ex.: borda recheada) não fazem sentido.

O Decorator permite adicionar acréscimos em tempo de execução, como em uma pizza de queijo com borda recheada e massa integral, totalizando R$35,50 (R$22,00 + R$8,50 + R$5,00).

O padrão utiliza um supertipo comum (Pizza) para pizzas e decoradores, com classes concretas (ChickenPizza, PepperoniPizza, CheesePizza) e decoradores (StuffedCrust, WholeWheatCrust) que implementam a mesma interface.

Decoradores mantêm uma referência ao objeto decorado e adicionam comportamento antes ou depois de delegar tarefas, permitindo combinações dinâmicas.

## Exemplo

Todas as pizzas devem possuir um preço e uma descrição. Seria inviável criar uma classe para cada combinação possível, como PizzaCalabresaBordaRequeijao ou PizzaQueijoMassaIntragral.

A cada novo tipo de pizza ou novo acréscimo o número de classes cresceria exponencialmente.

Deste modo PizzaFrango, PizzaCalabresa e PizzaQueijo teriam que implementar seu próprio método getPreco() e herdariam todos os demais métodos e atributos da classe abstrata Pizza.

O problema do uso de herança no caso das pizzas é a inflexibilidade que ela trás. Todos os acréscimos são atribuídos às subclasses em tempo de compilação.

Imagine que a pizzaria começasse a servir pizzas doces, todas elas teriam o atributo comBordaRequeijao, o que não faz sentido.

Neste caso seria ideal se fosse possível expandir as pizzas em tempo de execução, onde os acréscimos pudessem ser adicionados a elas conforme a necessidade surgisse.

É aí que o padrão Decorator pode entrar.

Suponha que queremos uma pizza de queijo com borda recheada de requeijão e massa integral. Vamos iniciar com uma pizza de queijo e decorá-la com os acréscimos.

| **1 - Começamos com o objeto PizzaQueijo.**                                           | **2 - Adicionamos borda recheada de requeijão.**                                                                                                                                                                                                                                                                                                                                                                  | **3 - Adicionamos também a massa integral.**                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PizzaQueijo                                                                           | Borda+Pizza                                                                                                                                                                                                                                                                                                                                                                                                       | Massa+Borda+Pizza                                                                                                                                                                                                                                                                                                                                                                  |
| **PizzaQueijo** herda os métodos de **Pizza** e implementa seu método **getPreco()**. | O objeto **BordaRequeijao** é um _decorator_, seu tipo deve ser igual ao do objeto que está decorando. <br><br> Então, **BordaRequeijao** e **PizzaQueijo** devem ter o mesmo supertipo **Pizza**. <br><br> Portanto **BordaRequeijao** também implementa um método **getPreco()**, e por meio do polimorfismo qualquer pizza englobada por **BordaRequeijao** pode ser tratada como um objeto do tipo **Pizza**. | **MassaIntegral** também é um _decorator_ então também tem o mesmo tipo que **PizzaQueijo** e implementa seu método **getPreco()**. <br><br> Deste modo, **PizzaQueijo** englobada por **BordaRequeijao** e por **MassaIntegral** continua sendo uma **Pizza**, é possível fazer com ela tudo o que se pode fazer com **PizzaQueijo**, inclusive chamar seu método **getPreco()**. |

Veja abaixo como aconteceria o cálculo do valor total de uma pizza de queijo com borda recheada de requeijão e com massa integral.

Os passos de 1 a 6 realizam a soma R$22,00 + R$8,50 + R$5,00 que é valor da pizza somado ao valores dos acréscimos, totalizando R$35,50.

```ts
abstract class Pizza {
  protected description: string = "Undefined description";
  protected price: number;
  abstract getDescription(): string;
  abstract getPrice(): number;
}
class ChickenPizza extends Pizza {
  constructor() {
    super();
    this.description = "Delicious chicken pizza";
  }
  getDescription(): string {
    return this.description;
  }
  getPrice(): number {
    return 19;
  }
}
class PepperoniPizza extends Pizza {
  constructor() {
    super();
    this.description = "Delicious pepperoni pizza";
  }
  getDescription(): string {
    return this.description;
  }
  getPrice(): number {
    return 25;
  }
}
class CheesePizza extends Pizza {
  constructor() {
    super();
    this.description = "Delicious cheese pizza";
  }
  getDescription(): string {
    return this.description;
  }
  getPrice(): number {
    return 22;
  }
}
abstract class ToppingDecorator extends Pizza {
  constructor(protected pizza: Pizza) {}

  abstract getDescription(): string;

  abstract getPrice(): number;
}
class StuffedCrust extends ToppingDecorator {
  getDescription(): string {
    return this.pizza.getDescription() + ", Stuffed crust";
  }

  getPrice(): number {
    return this.pizza.getPrice() + 8.5;
  }
}
class WholeWheatCrust extends ToppingDecorator {
  getDescription(): string {
    return this.pizza.getDescription() + ", Whole wheat crust";
  }

  getPrice(): number {
    return this.pizza.getPrice() + 5;
  }
}
const cheesePizza = new CheesePizza();
console.log(`Description: ${cheesePizza.getDescription()}`);
console.log(`Price: R$${cheesePizza.getPrice()}`);

const cheesePizzaWithStuffedCrust = new StuffedCrust(cheesePizza);
console.log("\nAdding stuffed crust");
console.log(`Description: ${cheesePizzaWithStuffedCrust.getDescription()}`);
console.log(`Price: R$${cheesePizzaWithStuffedCrust.getPrice()}`);

const cheesePizzaWithStuffedCrustAndWholeWheat = new WholeWheatCrust(
  cheesePizzaWithStuffedCrust,
);
console.log("\nAdding whole wheat crust");
console.log(
  `Description: ${cheesePizzaWithStuffedCrustAndWholeWheat.getDescription()}`,
);
console.log(`Price: R$${cheesePizzaWithStuffedCrustAndWholeWheat.getPrice()}`);
```

Saída:

```
Description: Delicious cheese pizza
Price: R$22

Adding stuffed crust
Description: Delicious cheese pizza, Stuffed crust
Price: R$30.5

Adding whole wheat crust
Description: Delicious cheese pizza, Stuffed crust, Whole wheat crust
Price: R$35.5
```

No teste acima nós adicionamos dois acréscimos a pizza de queijo, e eles foram adicionados em tempo de execução.

Isso torna nosso código muito flexível, pois caso um novo acréscimo ou pizza fosse criado pelos donos da pizzaria, bastaria criar uma nova classe sem a necessidade de modificar as classes existentes.

### Aplicabilidade

- Adicionar comportamentos dinamicamente sem afetar outros objetos;
- Gerenciar comportamentos essenciais para alguns objetos, mas desnecessários para outros;
- Evitar explosão de subclasses para combinações de comportamentos.

### Componentes

- Component: É o supertipo comum entre componente Concreto e Decorator. Pode ser uma classe abstrata ou interface. Cada Component pode ser usado sozinho ou englobado por um decorator;
- ComponenteConcreto: É o objeto ao qual novos comportamentos serão adicionados dinamicamente por meio dos Decorators. Ele estende Component;
- Decorator: Cada decorator TEM-UM (engloba um) Component. Isso significa que todo Decorator deve manter uma referência a um Component. Os Decorators implementam a mesma interface ou classe abstrata que o componente que irão decorar;
- DecoratorConcreto: Implementam a classe abstrata ou interface Decorator, graças ao polimorfismo também são do supertipo Component. Podem adicionar novos métodos ao componente que decoram, no entanto, novo comportamento geralmente é adicionado fazendo cálculos antes e/ou depois de um método existente no componente.

### Consequências

- Mais flexível que herança estática, permitindo adicionar/remover comportamentos em tempo de execução;
- Pode gerar muitas classes pequenas, aumentando a complexidade;
- Facilita personalização incremental, mas sistemas com muitos objetos podem ser difíceis de aprender e depurar;
- Um objeto decorado não é idêntico ao original, o que exige cuidado com identidade de objetos.

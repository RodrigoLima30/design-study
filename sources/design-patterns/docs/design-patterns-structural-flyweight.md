# Design Patterns - Structural - Flyweight

Visa otimizar o uso de memória ao compartilhar estados imutáveis (intrínsecos) entre múltiplos objetos de granularidade fina, reduzindo redundâncias.

Ele é particularmente útil em sistemas que manipulam grandes quantidades de objetos pequenos, onde o compartilhamento de estados comuns pode levar a uma significativa economia de recursos, especialmente memória RAM.

### Granularidade

Em programação orientada a objetos, a granularidade de um objeto refere-se ao nível de detalhe que ele contém.

Objetos de granularidade grossa são poucos, grandes e autossuficientes, realizando muitas operações com pouca interação.

Já objetos de granularidade fina são numerosos, pequenos e realizam operações específicas, dependendo de interações com outros objetos.

O padrão é aplicado em cenários com muitos objetos de granularidade fina, que consomem muita memória se instanciados individualmente.

Ele permite compartilhar estados imutáveis, reduzindo o consumo de recursos.

### Conceito

O padrão separa os estados de um objeto em:

#### Estado Intrínseco

Dados imutáveis e independentes do contexto, que podem ser compartilhados entre múltiplos objetos.

#### Estado Extrínseco

Dados mutáveis, dependentes do contexto, que não podem ser compartilhados e variam para cada instância.

Por exemplo, em um sistema com quatro objetos, cada um com uma parte imutável de 50 kB.

O uso do Flyweight reduz o consumo de memória de 200 kB (quatro instâncias) para 50 kB (uma instância compartilhada).

## Exemplo

O documento apresenta um cenário de um software de planejamento de reflorestamento, onde árvores são posicionadas em coordenadas (x, y) em um plano bidimensional. Cada árvore possui:

- Atributos extrínsecos: Posição x e y (mutáveis);
- Atributos intrínsecos: Nome da espécie, cor e altura máxima (imutáveis, compartilháveis).

O padrão é usado para compartilhar os atributos intrínsecos de uma espécie entre todas as árvores dessa espécie, reduzindo o uso de memória.

### Ilustração

Para ilustrar considere como exemplo o cenário onde precisamos construir o back-end um software para planejamento de projetos de reflorestamento de áreas desmatadas. Precisamos permitir que o usuário coloque uma determinada espécie de árvore em uma coordenada X, Y de um plano (duas dimensões).

Cada árvore possui os seguintes atributos:

- Posição no eixo X;
- Posição no eixo y;
- Nome da espécie;
- Cor;
- Altura máxima.

Os únicos atributos que variam são as posições nos eixos x e y.

Devido ao compartilhamento de estados, não é interessante que o cliente crie diretamente os flyweights. Por este motivo, iremos terceirizar essa tarefa para um objeto fábrica que pode decidir entre criar um flyweight ou retornar um já criado.

Vejamos como ficaria o diagrama de classes do nosso projeto.

Interpretando o diagrama de classes podemos notar que Arvore pertence a uma EspecieFlyweight e EspecieFabrica mantêm as instâncias EspecieFlyweight que já foram criadas.

### Código

Uma fábrica (EspecieFabrica) gerencia a criação e reutilização de objetos EspecieFlyweight, enquanto a classe Arvore mantém os estados extrínsecos e uma referência ao Flyweight. A classe Plantacao gerencia a criação de árvores, delegando a criação de espécies à fábrica.

### Exemplo

```ts
class SpeciesFlyweight {
  private name: string;
  private color: string;
  private maxHeight: number;
  constructor(name: string, color: string, maxHeight: number) {
    this.name = name;
    this.color = color;
    this.maxHeight = maxHeight;
  }
  getName(): string {
    return this.name;
  }
  getColor(): string {
    return this.color;
  }
  getMaxHeight(): number {
    return this.maxHeight;
  }
  getSpecies() {
    return {
      name: this.name,
      color: this.color,
      maxHeight: this.maxHeight,
    };
  }
}

class Tree {
  private x: number;
  private y: number;
  private flyweight: SpeciesFlyweight;
  constructor(x: number, y: number, flyweight: SpeciesFlyweight) {
    this.x = x;
    this.y = y;
    this.flyweight = flyweight;
  }
  getTree() {
    return {
      x: this.x,
      y: this.y,
      species: this.flyweight.getSpecies(),
    };
  }
}

class SpeciesFactory {
  private species: SpeciesFlyweight[] = [];

  getSpecies(name: string, color: string, maxHeight: number): SpeciesFlyweight {
    let species = this.species.find(
      (e) =>
        e.getName() === name &&
        e.getColor() === color &&
        e.getMaxHeight() === maxHeight,
    );
    if (!species) {
      species = new SpeciesFlyweight(name, color, maxHeight);
      this.species.push(species);
    }
    return species;
  }

  getAllSpecies() {
    return this.species.map((s) => s.getSpecies());
  }
}

class Plantation {
  private trees: Tree[] = [];
  private speciesFactory: SpeciesFactory;

  constructor() {
    this.speciesFactory = new SpeciesFactory();
  }

  addTree(
    x: number,
    y: number,
    name: string,
    color: string,
    maxHeight: number,
  ): void {
    const species = this.speciesFactory.getSpecies(name, color, maxHeight);
    const tree = new Tree(x, y, species);
    this.trees.push(tree);
  }

  getSpecies() {
    return this.speciesFactory.getAllSpecies();
  }

  getTrees() {
    return this.trees.map((t) => t.getTree());
  }
}

const iterations = 10;
const plantation = new Plantation();

for (let i = 0; i < iterations; i++) {
  plantation.addTree(
    Math.floor(Math.random() * 501),
    Math.floor(Math.random() * 501),
    "Ipe",
    "#2caf1e",
    10,
  );
  plantation.addTree(
    Math.floor(Math.random() * 501),
    Math.floor(Math.random() * 501),
    "Palm",
    "#008a29",
    7,
  );
  plantation.addTree(
    Math.floor(Math.random() * 501),
    Math.floor(Math.random() * 501),
    "Jabuticaba",
    "#00b626",
    5,
  );
}

console.log("### Species ###");
console.log(plantation.getSpecies());

console.log("### Trees ###");
console.log(plantation.getTrees());
```

Saída:

```ts
### Species ###
[
  { name: "Ipe", color: "#2caf1e", maxHeight: 10 },
  { name: "Palm", color: "#008a29", maxHeight: 7 },
  { name: "Jabuticaba", color: "#00b626", maxHeight: 5 }
]

### Trees ###
[
  { x: 123, y: 456, species: { name: "Ipe", color: "#2caf1e", maxHeight: 10 } },
  { x: 234, y: 345, species: { name: "Palm", color: "#008a29", maxHeight: 7 } },
  { x: 456, y: 123, species: { name: "Jabuticaba", color: "#00b626", maxHeight: 5 } },
  { x: 321, y: 432, species: { name: "Ipe", color: "#2caf1e", maxHeight: 10 } },
  { x: 111, y: 222, species: { name: "Palm", color: "#008a29", maxHeight: 7 } },
  { x: 333, y: 444, species: { name: "Jabuticaba", color: "#00b626", maxHeight: 5 } },
  // ... continua até a posição 29, totalizando 30 árvores
]
```

Nosso teste possui apenas 10 iterações, a cada iteração 3 árvores são criadas, totalizando assim 30 árvores. Repare que temos apenas 3 instâncias da classe espécie. As informações das espécies são alocadas apenas uma vez na memória RAM, depois são apenas referenciadas pelas árvores.

Deste modo existe um compartilhamento de espécies entre as árvores. No exemplo estamos trabalhando com pequenas strings e um float. Imagine um cenário onde os atributos de espécie sejam consideravelmente mais custosos para a RAM.

- Especie - 10kB;
- Cor - 5kB;
- AlturaMaxima - 2kB.

Considere também que ao invés de 10 (dez) iterações temos 1.000.000 (um milhão).

Sem o compartilhamento promovido pelo padrão Flyweight teríamos 3 milhões de árvores e cada uma delas alocaria os atributos de espécie na memória RAM (17kB por árvore).

Por outro lado, com o compartilhamento tal redundância de recursos não existiria.

Com Flyweight teremos uma economia de 51GB para 51kB para os atributos intrínsecos.

### Implementação

A implementação inclui:

- EspecieFlyweight: Armazena estados intrínsecos (nome, cor, altura máxima) e fornece métodos para acessá-los.
- Arvore: Mantém estados extrínsecos (x, y) e uma referência ao EspecieFlyweight.
- EspecieFabrica: Gerencia a criação e compartilhamento de EspecieFlyweight, verificando se uma espécie já existe antes de criar uma nova.
- Plantacao: Classe cliente que adiciona árvores, solicitando espécies à fábrica e armazenando as árvores criadas.

Um teste cria 30 árvores (10 iterações, 3 espécies por iteração), mas apenas 3 instâncias de EspecieFlyweight são alocadas, demonstrando o compartilhamento eficiente.

### Aplicabilidade

O Flyweight é recomendado quando:

- A aplicação utiliza muitos objetos.
- O custo de armazenamento é alto devido à quantidade de objetos.
- É possível separar estados extrínsecos dos intrínsecos.
- Grupos de objetos podem ser substituídos por poucos objetos compartilhados.
- A identidade dos objetos não é crítica, já que objetos compartilhados podem ser idênticos em testes de identidade.

### Componentes

- Flyweight: Interface que define como Flyweights recebem estados extrínsecos.
- FlyweightConcreto: Implementa a interface, armazenando estados intrínsecos e sendo compartilhável.
- FlyweightConcretoNaoCompartilhavel: Subclasses não obrigatoriamente compartilháveis, que podem conter Flyweights compartilháveis.
- FabricaFlyweight: Cria e gerencia Flyweights, garantindo compartilhamento adequado.
- Cliente: Mantém referências aos Flyweights e gerencia estados extrínsecos.

### Consequências

O Flyweight reduz o consumo de memória ao compartilhar estados intrínsecos, especialmente quando muitos objetos são criados. A economia depende de:

- Redução do número de instâncias.
- Quantidade de estado intrínseco por objeto.
- Se o estado extrínseco é calculado ou armazenado.

No entanto, pode aumentar o custo de tempo de execução devido à manipulação de estados extrínsecos. A remoção de Flyweights exige cuidado para garantir que não sejam mais referenciados.

# Design Patterns - Structural - Composite

Organiza objetos em uma estrutura de árvore para representar hierarquias parte-todo, permitindo que clientes tratem objetos individuais (folhas) e composições (nós) de forma uniforme.

Ele é útil em sistemas como gerenciadores de arquivos, onde pastas (nós) e arquivos (folhas) formam uma hierarquia.

O padrão elimina a necessidade de verificações condicionais (como instanceof) ao manipular objetos, promovendo transparência.

A implementação envolve uma classe abstrata Component, que define métodos comuns para pastas e arquivos, como adicionar, remover, recuperarFilho, exibir, getName e getPath.

Métodos inadequados para certos objetos lançam uma exceção (UnsupportedOperationException).

A classe File (folha) implementa apenas métodos relevantes, como exibir, getName e getPath.

A classe Folder (nó) implementa todos os métodos, gerenciando uma lista de componentes (arquivos ou subpastas).

A classe FileManager, que não faz parte do padrão, atua como cliente, inicializando a estrutura e exibindo a hierarquia recursivamente.

## Exemplo

Considere a hierarquia do sistema de diretórios acima, nosso objetivo a nível de explicação é organizar essa estrutura e tornar possível a inclusão, remoção e consulta de arquivos. Tal consulta pode ser a nível geral, por pastas ou subpastas. Este mesmo sistema de arquivos organizado como árvore ficaria da seguinte forma:

Devemos criar uma classe que será comum aos arquivos (folhas) e pastas (nós), ou seja, eles terão o mesmo supertipo.

```ts
abstract class Component {
  adicionar(component: Component): void {
    throw new Error("Unsupported operation");
  }

  remover(component: Component): void {
    throw new Error("Unsupported operation");
  }

  recuperarFilho(index: number): Component {
    throw new Error("Unsupported operation");
  }

  exibir(): void {
    throw new Error("Unsupported operation");
  }

  getName(): string {
    throw new Error("Unsupported operation");
  }

  getPath(): string {
    throw new Error("Unsupported operation");
  }
}

class File extends Component {
  constructor(
    private name: string,
    private path: string,
  ) {}

  getName(): string {
    return this.name;
  }

  getPath(): string {
    return this.path;
  }

  exibir(): void {
    console.log(` - ${this.getName()} - [${this.getPath()}]`);
  }
}

class Folder extends Component {
  private components: Component[] = [];

  constructor(
    private name: string,
    private path: string,
  ) {}

  adicionar(component: Component): void {
    this.components.push(component);
  }

  remover(component: Component): void {
    const index = this.components.indexOf(component);
    if (index !== -1) {
      this.components.splice(index, 1);
    }
  }

  recuperarFilho(index: number): Component {
    return this.components[index];
  }

  getName(): string {
    return this.name;
  }

  getPath(): string {
    return this.path;
  }

  exibir(): void {
    console.log(`## ${this.getName()} - [${this.getPath()}]`);
    this.components.forEach((component) => {
      console.log("  ");
      component.exibir();
    });
  }
}

class FileManager {
  constructor(private root: Component) {}
  exibirTodos(): void {
    this.root.exibir();
  }
}

const root = new Folder("Root", "/");
const folder1 = new Folder("Folder 1", "folder1");
const folder2 = new Folder("Folder 2", "folder2");
const folder2_1 = new Folder("Folder 2.1", "folder2-1");
const folder3 = new Folder("Folder 3", "folder3");

root.adicionar(folder1);
root.adicionar(folder2);
root.adicionar(folder3);
folder2.adicionar(folder2_1);

const file1 = new File("File 1", "/file1");
const file2 = new File("File 2", "/file2");
const file3 = new File("File 3", "/file3");
const file4 = new File("File 4", "/file4");
const file5 = new File("File 5", "/file5");
const file6 = new File("File 6", "/file6");

folder1.adicionar(file1);
folder1.adicionar(file2);
folder2.adicionar(file3);
folder2.adicionar(file4);
folder2_1.adicionar(file5);
folder3.adicionar(file6);

const manager = new FileManager(root);
manager.exibirTodos();
```

Saída:

```
## Root - [/]
## Folder 1 - [folder1]
   - File 1 - [/file1]
   - File 2 - [/file2]
## Folder 2 - [folder2]
   - File 3 - [/file3]
   - File 4 - [/file4]
## Folder 2.1 - [folder2-1]
   - File 5 - [/file5]
## Folder 3 - [folder3]
   - File 6 - [/file6]
```

### Aplicabilidade

- Representar hierarquias parte-todo;
- Tratar objetos individuais e composições uniformemente.

### Componentes

- Cliente: Usa a interface Component para manipular objetos;
- Component: Interface abstrata para todos os objetos;
- File (Folha): Representa objetos sem filhos;
- Folder (Composite): Gerencia objetos com filhos.

### Consequências

- Permite hierarquias recursivas e tratamento uniforme;
- Facilita adicionar novos tipos de componentes;
- Pode ser genérico demais, exigindo verificações em tempo de execução para restrições de tipo;
- Alternativa: separar Component em duas classes (uma para folhas, outra para nós), aumentando segurança, mas perdendo transparência.

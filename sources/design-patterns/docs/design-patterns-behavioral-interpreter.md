# Design Patterns - Behavioral - Interpreter

Define uma representação para a gramática de uma linguagem e um interpretador para processar suas sentenças.

É útil para problemas frequentes que podem ser expressos como sentenças em uma linguagem simples, como a notação polonesa inversa (RPN), onde operadores seguem operandos.

A gramática é composta por símbolos terminais (números, variáveis, operadores) e não terminais (regras como ADICAO, SUBTRACAO).

A implementação utiliza uma interface Expressao com um método interpretar, classes para operações (Adicao, Subtracao, etc.), números (Numero, Digito) e variáveis (Variavel).

Uma árvore sintática abstrata é construída manualmente ou via parser, que processa expressões RPN e as interpreta recursivamente com base em um contexto (ex.: valores de variáveis).

O padrão é ideal para gramáticas simples, mas pode ser difícil de manter com gramáticas complexas e não é otimizado para eficiência.

### Contexto

É importante ressaltar que estamos tratando de linguagens no contexto da teoria da computação.

De maneira informal, entenda as linguagens como uma forma de comunicação.

Obs: A definição formal de uma linguagem exige uma série de conceitos de base que não serão abordados aqui.

### Expressão

O padrão Interpreter nos diz que devemos usar uma classe para definir cada regra de produção da gramática.

Temos 8 regras de produção, portanto teremos ao menos 8 classes já que esse número pode crescer caso seja feita alguma subclassificação.

## Tabela

A tabela a seguir relaciona as regras da gramática com as classes que as representam.

Toda vez que chegarmos em uma dessas regras uma instância apropriada de uma das classes da representação será criada.

Por exemplo, ao chegar na regra ADICAO criaremos um objeto da classe Adicao que precisa de duas expressões em seu construtor.

Onde EXPRESSAO deve ser uma instância de qualquer classe que implemente a interface Expressao.

| **Regra**     | **Criação de instância de representação**                  |
| ------------- | ---------------------------------------------------------- |
| EXPRESSAO     | Sem instância já que **Expressao** é uma interface.        |
| ADICAO        | `new Adicao(EXPRESSAO, EXPRESSAO);`                        |
| SUBTRACAO     | `new Subtracao(EXPRESSAO, EXPRESSAO);`                     |
| MULTIPLICACAO | `new Multiplicacao(EXPRESSAO, EXPRESSAO);`                 |
| DIVISAO       | `new Divisao(EXPRESSAO, EXPRESSAO);`                       |
| NUMERO        | `new Numero(DIGITO);` **OU** `new Numero(DIGITO, NUMERO);` |
| VARIAVEL      | `new Variavel(string);`                                    |
| DIGITO        | `new Digito(string);`                                      |

## Exemplo

```ts
interface Expression {
  interpret(context: { [key: string]: number }): number;
}
abstract class Operation implements Expression {
  constructor(
    protected left: Expression,
    protected right: Expression,
  ) {}
  abstract interpret(context: { [key: string]: number }): number;
}
class Addition extends Operation {
  interpret(context: { [key: string]: number }): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}
class Subtraction extends Operation {
  interpret(context: { [key: string]: number }): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}
class Multiplication extends Operation {
  interpret(context: { [key: string]: number }): number {
    return this.left.interpret(context) * this.right.interpret(context);
  }
}
class Division extends Operation {
  interpret(context: { [key: string]: number }): number {
    return Math.floor(
      this.left.interpret(context) / this.right.interpret(context),
    );
  }
}
class Number implements Expression {
  constructor(
    private left: Digit,
    private right: Number | null = null,
  ) {}
  interpret(context: { [key: string]: number }): number {
    if (this.right === null) return this.left.interpret(context);
    return parseInt(
      this.left.interpret(context) + this.right.interpret(context).toString(),
    );
  }
}
class Digit implements Expression {
  constructor(private value: string) {}
  interpret(context: { [key: string]: number }): number {
    return parseInt(this.value);
  }
}
class Variable implements Expression {
  constructor(private variable: string) {}
  private validateVariable(): boolean {
    const alphabet = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    return alphabet.includes(this.variable);
  }
  interpret(context: { [key: string]: number }): number {
    if (this.validateVariable() && context[this.variable] !== undefined) {
      return context[this.variable];
    }
    throw new Error(
      "The variable must be a letter from a-z and defined in the context!",
    );
  }
}
class Digito implements Expressao {
  constructor(private valor: string) {}
  interpretar(contexto: { [key: string]: number }): number {
    return parseInt(this.valor);
  }
}
class Variavel implements Expressao {
  constructor(private variavel: string) {}
  private validarVariavel(): boolean {
    const alfabeto = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    return alfabeto.includes(this.variavel);
  }
  interpretar(contexto: { [key: string]: number }): number {
    if (this.validarVariavel() && contexto[this.variavel] !== undefined) {
      return contexto[this.variavel];
    }
    throw new Error(
      "A variável precisa ser uma letra de a-z e estar definida no contexto!",
    );
  }
}
class Parser {
  private stack: Expression[] = [];
  private expression: string;
  constructor(expression: string) {
    this.expression = expression.trim();
  }
  private isOperation(token: string): boolean {
    const operations = ["+", "-", "*", "/"];
    return operations.includes(token);
  }
  private parseNumber(token: string): Number {
    const numberStack: Digit[] = [];
    const operandLength = token.length;
    let right: Number | null = null;
    for (let i = 0; i < operandLength; i++) {
      const tokenPart = token[i];
      if (i === operandLength - 1) {
        numberStack.push(new Digit(tokenPart));
        while (numberStack.length > 0) {
          const stackTop = numberStack[numberStack.length - 1];
          if (stackTop instanceof Digit) {
            if (right === null) {
              right = new Number(stackTop);
              numberStack.pop();
            } else {
              right = new Number(stackTop, right);
              numberStack.pop();
            }
          }
        }
      } else {
        numberStack.push(new Digit(tokenPart));
      }
    }
    return right!;
  }
  parse(): Expression {
    const expression = this.expression.split(" ");
    for (const token of expression) {
      if (this.isOperation(token)) {
        const rightOperand = this.stack.pop()!;
        const leftOperand = this.stack.pop()!;
        switch (token) {
          case "+":
            this.stack.push(new Addition(leftOperand, rightOperand));
            break;
          case "-":
            this.stack.push(new Subtraction(leftOperand, rightOperand));
            break;
          case "*":
            this.stack.push(new Multiplication(leftOperand, rightOperand));
            break;
          case "/":
            this.stack.push(new Division(leftOperand, rightOperand));
            break;
        }
      } else if (!isNaN(Number(token))) {
        this.stack.push(this.parseNumber(token));
      } else {
        this.stack.push(new Variable(token));
      }
    }
    return this.stack[this.stack.length - 1];
  }
}

const parser = new Parser("9 5 + x - 20 2 * 10 - y / -");
const tree = parser.parse();
const context = { x: 2, y: 3 };

console.log(tree.interpret(context));
```

Saída:

```
2
```

### Aplicabilidade

O padrão Interpreter pode ser utilizado quando existe uma linguagem para interpretar e é possível representar instruções da linguagem como árvores sintáticas abstratas. O Interpreter funciona melhor quando:

#### A gramática é simples

Para gramáticas complexas, a hierarquia de classes da gramática se torna grande e incontrolável.

#### Eficiência não é uma preocupação crítica

Os Interpreters mais eficientes geralmente não são implementados pela interpretação direta de árvores de análise sintática abstrata, mas pela tradução primeiro para outra forma.

### Componentes

#### ExpressaoAbstrata

Declara um método abstrato interpretar() comum a todos os nós na árvore sintática abstrata.

#### ExpressaoNaoTerminal

É necessária uma classe desse tipo para cada regra R ::= R1 R2 .. .Rn da gramática;

Mantém variáveis de instância do tipo ExpressaoAbstrata para cada um dos símbolos R1 a Rn;

Implementa um método interpretar() associado aos símbolos não terminais da gramática. O método interpretar() chama a si próprio recursivamente nas variáveis que representam R1 a Rn.

#### ExpressaoTerminal

Implementa um método interpretar() associado aos símbolos terminais da gramática, ele define o caso base da recursão iniciada por uma ExpressaoNaoTerminal;

É necessária uma instância para cada símbolo terminal em uma sentença.

#### Contexto

Contém informação que é global para o interpretador.

#### Cliente

Constrói ou recebe uma árvore sintática abstrata que representa uma determinada sentença da linguagem definida pela gramática.

A árvore sintática abstrata é montada a partir de instâncias das classes ExpressaoNaoTerminal e ExpressaoTerminal.

### Consequências

#### Se torna fácil alterar e estender a gramática

Como o padrão usa classes para representar regras gramaticais, é possível usar herança para alterar ou estender a gramática. As expressões existentes podem ser modificadas incrementalmente, e novas expressões podem ser definidas como variações das antigas;

#### A implementação da gramática também fica fácil

As classes que definem os nós na árvore de sintaxe abstrata têm implementações semelhantes e são fáceis de escrever;

#### Gramáticas complexas são difíceis de manter

O padrão Interpreter define pelo menos uma classe para cada regra da gramática. Portanto, gramáticas contendo muitas regras podem ser difíceis de gerenciar e manter.
# Design Patterns - Behavioral - Interpreter

Define uma representação para a gramática de uma linguagem e um interpretador para processar suas sentenças.

É útil para problemas frequentes que podem ser expressos como sentenças em uma linguagem simples, como a notação polonesa inversa (RPN), onde operadores seguem operandos.

A gramática é composta por símbolos terminais (números, variáveis, operadores) e não terminais (regras como ADICAO, SUBTRACAO).

A implementação utiliza uma interface Expressao com um método interpretar, classes para operações (Adicao, Subtracao, etc.), números (Numero, Digito) e variáveis (Variavel).

Uma árvore sintática abstrata é construída manualmente ou via parser, que processa expressões RPN e as interpreta recursivamente com base em um contexto (ex.: valores de variáveis).

O padrão é ideal para gramáticas simples, mas pode ser difícil de manter com gramáticas complexas e não é otimizado para eficiência.

### Contexto

É importante ressaltar que estamos tratando de linguagens no contexto da teoria da computação.

De maneira informal, entenda as linguagens como uma forma de comunicação.

Obs: A definição formal de uma linguagem exige uma série de conceitos de base que não serão abordados aqui.

### Expressão

O padrão Interpreter nos diz que devemos usar uma classe para definir cada regra de produção da gramática.

Temos 8 regras de produção, portanto teremos ao menos 8 classes já que esse número pode crescer caso seja feita alguma subclassificação.

## Tabela

A tabela a seguir relaciona as regras da gramática com as classes que as representam.

Toda vez que chegarmos em uma dessas regras uma instância apropriada de uma das classes da representação será criada.

Por exemplo, ao chegar na regra ADICAO criaremos um objeto da classe Adicao que precisa de duas expressões em seu construtor.

Onde EXPRESSAO deve ser uma instância de qualquer classe que implemente a interface Expressao.

| **Regra**     | **Criação de instância de representação**                  |
| ------------- | ---------------------------------------------------------- |
| EXPRESSAO     | Sem instância já que **Expressao** é uma interface.        |
| ADICAO        | `new Adicao(EXPRESSAO, EXPRESSAO);`                        |
| SUBTRACAO     | `new Subtracao(EXPRESSAO, EXPRESSAO);`                     |
| MULTIPLICACAO | `new Multiplicacao(EXPRESSAO, EXPRESSAO);`                 |
| DIVISAO       | `new Divisao(EXPRESSAO, EXPRESSAO);`                       |
| NUMERO        | `new Numero(DIGITO);` **OU** `new Numero(DIGITO, NUMERO);` |
| VARIAVEL      | `new Variavel(string);`                                    |
| DIGITO        | `new Digito(string);`                                      |

## Exemplo

```ts
interface Expression {
  interpret(context: { [key: string]: number }): number;
}
abstract class Operation implements Expression {
  constructor(
    protected left: Expression,
    protected right: Expression,
  ) {}
  abstract interpret(context: { [key: string]: number }): number;
}
class Addition extends Operation {
  interpret(context: { [key: string]: number }): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}
class Subtraction extends Operation {
  interpret(context: { [key: string]: number }): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}
class Multiplication extends Operation {
  interpret(context: { [key: string]: number }): number {
    return this.left.interpret(context) * this.right.interpret(context);
  }
}
class Division extends Operation {
  interpret(context: { [key: string]: number }): number {
    return Math.floor(
      this.left.interpret(context) / this.right.interpret(context),
    );
  }
}
class Number implements Expression {
  constructor(
    private left: Digit,
    private right: Number | null = null,
  ) {}
  interpret(context: { [key: string]: number }): number {
    if (this.right === null) return this.left.interpret(context);
    return parseInt(
      this.left.interpret(context) + this.right.interpret(context).toString(),
    );
  }
}
class Digit implements Expression {
  constructor(private value: string) {}
  interpret(context: { [key: string]: number }): number {
    return parseInt(this.value);
  }
}
class Variable implements Expression {
  constructor(private variable: string) {}
  private validateVariable(): boolean {
    const alphabet = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    return alphabet.includes(this.variable);
  }
  interpret(context: { [key: string]: number }): number {
    if (this.validateVariable() && context[this.variable] !== undefined) {
      return context[this.variable];
    }
    throw new Error(
      "The variable must be a letter from a-z and defined in the context!",
    );
  }
}
class Digito implements Expressao {
  constructor(private valor: string) {}
  interpretar(contexto: { [key: string]: number }): number {
    return parseInt(this.valor);
  }
}
class Variavel implements Expressao {
  constructor(private variavel: string) {}
  private validarVariavel(): boolean {
    const alfabeto = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    return alfabeto.includes(this.variavel);
  }
  interpretar(contexto: { [key: string]: number }): number {
    if (this.validarVariavel() && contexto[this.variavel] !== undefined) {
      return contexto[this.variavel];
    }
    throw new Error(
      "A variável precisa ser uma letra de a-z e estar definida no contexto!",
    );
  }
}
class Parser {
  private stack: Expression[] = [];
  private expression: string;
  constructor(expression: string) {
    this.expression = expression.trim();
  }
  private isOperation(token: string): boolean {
    const operations = ["+", "-", "*", "/"];
    return operations.includes(token);
  }
  private parseNumber(token: string): Number {
    const numberStack: Digit[] = [];
    const operandLength = token.length;
    let right: Number | null = null;
    for (let i = 0; i < operandLength; i++) {
      const tokenPart = token[i];
      if (i === operandLength - 1) {
        numberStack.push(new Digit(tokenPart));
        while (numberStack.length > 0) {
          const stackTop = numberStack[numberStack.length - 1];
          if (stackTop instanceof Digit) {
            if (right === null) {
              right = new Number(stackTop);
              numberStack.pop();
            } else {
              right = new Number(stackTop, right);
              numberStack.pop();
            }
          }
        }
      } else {
        numberStack.push(new Digit(tokenPart));
      }
    }
    return right!;
  }
  parse(): Expression {
    const expression = this.expression.split(" ");
    for (const token of expression) {
      if (this.isOperation(token)) {
        const rightOperand = this.stack.pop()!;
        const leftOperand = this.stack.pop()!;
        switch (token) {
          case "+":
            this.stack.push(new Addition(leftOperand, rightOperand));
            break;
          case "-":
            this.stack.push(new Subtraction(leftOperand, rightOperand));
            break;
          case "*":
            this.stack.push(new Multiplication(leftOperand, rightOperand));
            break;
          case "/":
            this.stack.push(new Division(leftOperand, rightOperand));
            break;
        }
      } else if (!isNaN(Number(token))) {
        this.stack.push(this.parseNumber(token));
      } else {
        this.stack.push(new Variable(token));
      }
    }
    return this.stack[this.stack.length - 1];
  }
}

const parser = new Parser("9 5 + x - 20 2 * 10 - y / -");
const tree = parser.parse();
const context = { x: 2, y: 3 };

console.log(tree.interpret(context));
```

Saída:

```
2
```

### Aplicabilidade

O padrão Interpreter pode ser utilizado quando existe uma linguagem para interpretar e é possível representar instruções da linguagem como árvores sintáticas abstratas. O Interpreter funciona melhor quando:

#### A gramática é simples

Para gramáticas complexas, a hierarquia de classes da gramática se torna grande e incontrolável.

#### Eficiência não é uma preocupação crítica

Os Interpreters mais eficientes geralmente não são implementados pela interpretação direta de árvores de análise sintática abstrata, mas pela tradução primeiro para outra forma.

### Componentes

#### ExpressaoAbstrata

Declara um método abstrato interpretar() comum a todos os nós na árvore sintática abstrata.

#### ExpressaoNaoTerminal

É necessária uma classe desse tipo para cada regra R ::= R1 R2 .. .Rn da gramática;

Mantém variáveis de instância do tipo ExpressaoAbstrata para cada um dos símbolos R1 a Rn;

Implementa um método interpretar() associado aos símbolos não terminais da gramática. O método interpretar() chama a si próprio recursivamente nas variáveis que representam R1 a Rn.

#### ExpressaoTerminal

Implementa um método interpretar() associado aos símbolos terminais da gramática, ele define o caso base da recursão iniciada por uma ExpressaoNaoTerminal;

É necessária uma instância para cada símbolo terminal em uma sentença.

#### Contexto

Contém informação que é global para o interpretador.

#### Cliente

Constrói ou recebe uma árvore sintática abstrata que representa uma determinada sentença da linguagem definida pela gramática.

A árvore sintática abstrata é montada a partir de instâncias das classes ExpressaoNaoTerminal e ExpressaoTerminal.

### Consequências

#### Se torna fácil alterar e estender a gramática

Como o padrão usa classes para representar regras gramaticais, é possível usar herança para alterar ou estender a gramática. As expressões existentes podem ser modificadas incrementalmente, e novas expressões podem ser definidas como variações das antigas;

#### A implementação da gramática também fica fácil

As classes que definem os nós na árvore de sintaxe abstrata têm implementações semelhantes e são fáceis de escrever;

#### Gramáticas complexas são difíceis de manter

O padrão Interpreter define pelo menos uma classe para cada regra da gramática. Portanto, gramáticas contendo muitas regras podem ser difíceis de gerenciar e manter.

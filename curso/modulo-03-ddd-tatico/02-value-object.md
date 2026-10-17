# 3.2 · Value Object

## Problema

```ts
function cobrar(valor: number, moeda: string, email: string) { /* ... */ }

cobrar(-50, 'reais', 'nao-e-um-email') // compila e roda
```

Tipos primitivos aceitam qualquer valor. A validação fica espalhada (ou esquecida) em cada função. Isso se chama **Primitive Obsession**.

## Ideia

> 💡 Um **Value Object** é um objeto **sem identidade**, **imutável**, **comparado pelo valor** e **auto-validado**. Se ele existe, ele é válido.

| Característica | Significado |
|---|---|
| **Sem identidade** | Dois `Money(10, 'BRL')` são intercambiáveis |
| **Imutável** | Para "mudar", crie outro. `dinheiro.somar(x)` devolve um novo objeto |
| **Igualdade por valor** | `a.equals(b)` compara atributos, não referência |
| **Auto-validado** | O construtor rejeita valores inválidos |
| **Comportamento** | Carrega as operações do conceito: `somar`, `isBefore`, `formatar` |

## Exemplo 1: Email

```ts
// data/email.ts — formato e tipo (camada data)
import { z } from 'zod'

export const emailSchema = z.string().trim().toLowerCase().email()
export type EmailInput = z.input<typeof emailSchema>
```

```ts
// domain/value-objects/email.ts
import { emailSchema } from '../../data/email'

export class Email {
  readonly #value: string

  constructor(input: string) {
    this.#value = emailSchema.parse(input) // lança se inválido
  }

  get value() { return this.#value }

  get domain() { return this.#value.split('@')[1] }

  equals(other: Email) { return this.#value === other.value }

  toJSON() { return this.#value }
}
```

```ts
new Email(' Joao@Exemplo.com ').value // 'joao@exemplo.com'
new Email('invalido')                 // lança erro
```

## Exemplo 2: Money (com comportamento)

> ⚠️ **Nunca use `number` com casas decimais para dinheiro.** `0.1 + 0.2 !== 0.3`. Guarde em **centavos** (inteiro).

```ts
export type Currency = 'BRL' | 'USD'

export class Money {
  private constructor(
    readonly cents: number,
    readonly currency: Currency,
  ) {
    if (!Number.isInteger(cents)) throw new Error('Money: cents must be an integer')
  }

  static fromCents(cents: number, currency: Currency = 'BRL') {
    return new Money(cents, currency)
  }

  static zero(currency: Currency = 'BRL') {
    return new Money(0, currency)
  }

  add(other: Money): Money {
    this.assertSameCurrency(other)
    return new Money(this.cents + other.cents, this.currency) // novo objeto
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other)
    return new Money(this.cents - other.cents, this.currency)
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency)
  }

  isNegative() { return this.cents < 0 }

  isGreaterThan(other: Money) {
    this.assertSameCurrency(other)
    return this.cents > other.cents
  }

  equals(other: Money) {
    return this.cents === other.cents && this.currency === other.currency
  }

  format(locale = 'pt-BR') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: this.currency })
      .format(this.cents / 100)
  }

  private assertSameCurrency(other: Money) {
    if (other.currency !== this.currency) throw new Error('Money: currency mismatch')
  }
}
```

```ts
const preco = Money.fromCents(1990)
const frete = Money.fromCents(1500)
preco.add(frete).format() // 'R$ 34,90'
preco.cents               // 1990 (não mudou: imutável)
```

Note os padrões usados:
- **Construtor privado + Static Factory** (`fromCents`, `zero`): nomes claros para formas de criar.
- **Operações devolvem novo objeto**: imutabilidade.

## Exemplo 3: Value Object composto

Um VO pode ter vários atributos. O que importa é que **o conjunto** é o valor.

```ts
export class Periodo {
  constructor(readonly inicio: Date, readonly fim: Date) {
    if (fim < inicio) throw new Error('Periodo: fim antes do início')
  }

  contem(data: Date) { return data >= this.inicio && data <= this.fim }

  sobrepoe(outro: Periodo) { return this.inicio <= outro.fim && outro.inicio <= this.fim }

  duracaoEmDias() {
    return Math.ceil((this.fim.getTime() - this.inicio.getTime()) / 86_400_000)
  }
}
```

Outros exemplos clássicos: `Endereco`, `Dimensoes` (altura × largura × comprimento), `Coordenada`, `FaixaDeCep`, `Cpf`, `Telefone`, `Porcentagem`.

## Value Object como identificador

IDs também podem ser VOs. Isso evita passar o ID de um pedido onde se espera o de um cliente.

```ts
export class PedidoId {
  constructor(readonly value: string) {
    if (!/^[0-9a-f-]{36}$/i.test(value)) throw new Error('PedidoId inválido')
  }
  equals(other: PedidoId) { return this.value === other.value }
}

function buscar(id: PedidoId) {}
buscar(new ClienteId('...')) // ❌ erro de compilação se as classes tiverem formas diferentes
```

> ⚠️ TypeScript compara tipos **pela estrutura**. Se `PedidoId` e `ClienteId` tiverem exatamente os mesmos campos, um vai aceitar o outro. Use um campo privado (`#brand`) ou um *branded type* para diferenciá-los.

## Padrão de implementação com schema

Quando o VO tem vários campos, um molde útil é: **schema em `data`**, **`#data` privado**, **getter `Readonly`** e **`toJSON()`**.

```ts
// data/geolocation.ts
export const geolocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})
export type GeolocationProps = z.infer<typeof geolocationSchema>

// domain/value-objects/geolocation.ts
export class Geolocation {
  readonly #data: GeolocationProps

  constructor(props: GeolocationProps) {
    this.#data = geolocationSchema.parse(props)
  }

  get data(): Readonly<GeolocationProps> { return this.#data }

  get value() { return `${this.#data.latitude},${this.#data.longitude}` }

  toJSON(): Readonly<GeolocationProps> { return this.#data }
}
```

## Quando usar / quando não usar

| Use | Evite |
|---|---|
| Conceito descrito por seus atributos (dinheiro, CEP, período) | Quando você precisa acompanhar **qual** objeto é (vira Entity) |
| Valor com regra de formato ou intervalo | Encapsular um primitivo sem nenhuma regra e sem nenhum comportamento só "por padrão" |
| Operações que o negócio faz com o valor | |

## Erros comuns

- ⚠️ **Setters em Value Object.** Quebra a imutabilidade. Devolva um novo objeto.
- ⚠️ **Validar fora.** Se a validação está no controller, o VO não protege nada.
- ⚠️ **Comparar com `===`.** Compara referência. Use `equals()`.
- ⚠️ **Dinheiro em `float`.** Use centavos.

## Para fixar

1. Por que `money.add()` devolve um novo objeto?
2. Qual a vantagem de `PedidoId` ser um VO em vez de `string`?
3. Por que dois `Money.fromCents(100)` são "o mesmo"?

<details>
<summary>Respostas</summary>

1. Imutabilidade: quem guardou a referência antiga não é surpreendido por uma mudança, e o objeto nunca fica num estado intermediário inválido.
2. O compilador impede trocar IDs de tipos diferentes, e o formato é validado num só lugar.
3. Porque Value Object não tem identidade: é igual quem tem os mesmos valores.

</details>

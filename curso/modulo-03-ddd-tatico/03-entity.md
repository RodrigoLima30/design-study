# 3.3 · Entity

## Problema

Dois clientes chamados "João Silva", nascidos no mesmo dia, são **pessoas diferentes**. E o mesmo cliente que muda de endereço continua sendo **o mesmo cliente**. Comparar por atributos não funciona aqui.

## Ideia

> 💡 Uma **Entity** é um objeto com **identidade própria** que persiste ao longo do tempo, mesmo quando seus atributos mudam. Ela é **comparada pelo ID**.

| | Entity | Value Object |
|---|---|---|
| Identidade | Única e estável | Nenhuma |
| Igualdade | Pelo ID | Pelos atributos |
| Mutabilidade | Muda de estado por **métodos de negócio** | Imutável |
| Ciclo de vida | Nasce, evolui, pode ser arquivada | Criado e descartado |
| Persistência | Precisa ser rastreada | Pode ser recriado a qualquer momento |
| Exemplo | `Cliente`, `Volume`, `Envio` | `Email`, `Money`, `Endereco` |

## Anatomia de uma Entity

```ts
// data/customer.ts
export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  status: z.enum(['ACTIVE', 'BLOCKED']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type CustomerProps = z.infer<typeof customerSchema>
```

```ts
// domain/entities/customer.ts
import { customerSchema, type CustomerProps } from '../../data/customer'
import { Email } from '../value-objects/email'

export class Customer {
  #data: CustomerProps

  constructor(props: CustomerProps) {
    this.#data = customerSchema.parse(props)          // 1. nasce válida
  }

  get id() { return this.#data.id }                   // 2. identidade
  get name() { return this.#data.name }
  get email() { return new Email(this.#data.email) }  // 3. expõe VOs
  get isBlocked() { return this.#data.status === 'BLOCKED' }

  // 4. mudanças só por métodos com nome do negócio
  changeEmail(email: Email, now: Date) {
    if (this.isBlocked) throw new Error('Blocked customer cannot change e-mail')
    this.#data = { ...this.#data, email: email.value, updatedAt: now }
  }

  block(now: Date) {
    if (this.isBlocked) return                         // idempotente
    this.#data = { ...this.#data, status: 'BLOCKED', updatedAt: now }
  }

  equals(other: Customer) { return this.id === other.id } // 5. igualdade por ID

  toJSON(): Readonly<CustomerProps> { return this.#data }   // 6. serialização
}
```

Os seis pontos:
1. **Nasce válida** (schema no construtor).
2. **Identidade** exposta e estável.
3. **Expõe Value Objects**, não strings soltas, quando o conceito é rico.
4. **Muda por intenção** (`block`, `changeEmail`), nunca por `setStatus`.
5. **Igualdade por ID.**
6. **`toJSON()`** para respostas e persistência.

> 💡 Note o parâmetro `now: Date`. Receber o "agora" de fora deixa a entity **determinística** e fácil de testar. O mesmo vale para IDs gerados.

## De onde vem a identidade

| Estratégia | Como | Prós | Contras |
|---|---|---|---|
| **Gerada pela aplicação** (UUID v4/v7, ULID) | `crypto.randomUUID()` antes de salvar | O ID existe antes do banco; bom para eventos e testes | Ocupa mais espaço que inteiro |
| **Gerada pelo banco** (autoincrement) | O banco devolve no `INSERT` | Compacto, sequencial | A entity não tem ID até ser salva |
| **Natural** (CPF, placa) | Vem do mundo real | Significativo | Pode mudar ou ter erro de digitação |
| **Derivada** | Composta de outros valores | Determinística | Muda se os valores mudarem |

📌 Neste curso: **UUID v7 gerado pela aplicação**. É ordenável no tempo (bom para índices) e existe antes da persistência.

```ts
// a identidade pode ser derivada por um Value Object
get id(): string {
  return new RouteId({ origin: this.origin, destiny: this.destiny }).value // 'FROM|SP|TO|RJ'
}
```

## Entity rica x entity anêmica

```ts
// ❌ Anêmica: só dados; as regras ficam espalhadas em services
class Customer {
  id!: string
  status!: 'ACTIVE' | 'BLOCKED'
}
if (customer.status === 'ACTIVE') customer.status = 'BLOCKED'

// ✅ Rica: dados + regras
customer.block(now)
```

Mais em [3.10](10-modelo-rico-vs-anemico.md).

## Erros comuns

- ⚠️ **Setters públicos** (`set status`). Qualquer um coloca a entity num estado inválido.
- ⚠️ **Construtor que aceita qualquer coisa.** Valide na construção.
- ⚠️ **Entity que importa repository ou HTTP.** Entity é domínio puro; não conhece banco.
- ⚠️ **Tudo vira Entity.** Endereço, dinheiro e período geralmente são Value Objects.

## Para fixar

1. Por que receber `now: Date` como parâmetro em vez de chamar `new Date()` dentro?
2. Endereço de entrega: Entity ou Value Object?
3. Qual a vantagem de gerar o ID na aplicação?

<details>
<summary>Respostas</summary>

1. Torna o comportamento determinístico e testável. O teste controla o "agora".
2. Normalmente Value Object: dois endereços iguais são intercambiáveis. Seria Entity se o negócio precisasse acompanhar a "vida" de um endereço específico (um centro de distribuição, por exemplo).
3. O ID existe antes de salvar, então dá para referenciar em eventos, logs e outros objetos na mesma operação.

</details>

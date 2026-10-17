# 4.10 · Nomenclatura

Nomes consistentes tornam a arquitetura **visível**: só de ler o nome do arquivo, você sabe a camada, a família e o contexto.

## Convenções

| Elemento | Padrão | Exemplos |
|---|---|---|
| Variáveis, funções, schemas | `camelCase` | `userName`, `getUserById`, `userSchema` |
| Enums e constantes | `UPPER_SNAKE_CASE` | `ENV`, `WEBHOOK_EVENT`, `REDIS_PREFIX`, `SHIPMENT_STATUS` |
| Arquivos | `kebab-case`, dizendo **o que é** e **o contexto** | `create-user-controller.ts`, `user-postgres-repository.ts` |
| Classes, types, interfaces, decorators | `PascalCase` | `FreightCalculationService`, `UserProps`, `UserRole` |
| Tipagens de **Controller** | `Request` e `Response` | `CreateUserController.Request`, `CreateUserController.Response` |
| Tipagens de **Usecase, Service, Orchestrator** | `Input` e `Output` | `CreateUserUseCase.Input`, `CreateUserUseCase.Output` |

### Request/Response x Input/Output

```ts
export namespace CreateUserController {
  export type Request = z.input<typeof createUserSchema>  // o que chega de fora
  export type Response = { user: UserDto }                 // o que sai para fora
}

export namespace CreateUserUseCase {
  export type Input = { name: string; email: Email }      // dado interno, já validado
  export type Output = User
}
```

`Request/Response` marcam a **fronteira externa**. `Input/Output` marcam contratos **internos**.

## Anatomia do nome

```text
  user  -  postgres  -  repository  .ts
   │          │             └── família (o que é)
   │          └──────────────── tecnologia / variante (opcional)
   └─────────────────────────── contexto (sobre o que é)
```

Classes seguem a mesma lógica em PascalCase:

| Classe | Leitura |
|---|---|
| `AccountCreateDrizzleMutation` | contexto `Account` + ação `Create` + tecnologia `Drizzle` + família `Mutation` |
| `UserWithMembershipsDrizzleQuery` | alvo + tecnologia + família |
| `ShippingMemoryRepositoryFactory` | módulo + variante + família |
| `InviteUserToTenantController` | ação + família |
| `HaversineDistanceStrategy` | algoritmo + família (padrão) |

## Nomes de negócio

- Use a **linguagem ubíqua** ([2.2](../modulo-02-ddd-estrategico/02-linguagem-ubiqua.md)).
- **Métodos de entity são verbos de negócio**: `cancel`, `post`, `refund`, nunca `setStatus`.
- **Eventos no passado**: `ShipmentCancelled`, `WalletDebited`.
- **Comandos no imperativo**: `CancelShipment`, `DebitWallet`.
- Evite sufixos vazios: `Manager`, `Processor`, `Data`, `Info`, `Helper`.

## Idioma

📌 Escolha **um** idioma para o código e registre no glossário a tradução dos termos de negócio. Misturar (`calcularShippingPrice`) é o pior dos mundos.

| Opção | Prós | Contras |
|---|---|---|
| Código em inglês, glossário mapeando termos | Combina com bibliotecas e com o resto do ecossistema | Exige tradução consistente |
| Código em português | Linguagem ubíqua literal | Mistura com APIs em inglês (`array.filter`) |

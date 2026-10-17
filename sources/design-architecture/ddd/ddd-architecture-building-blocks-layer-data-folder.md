# Building Data (folder)

A pasta Data contém interfaces (contratos) que descrevem comportamentos esperados de infraestrutura — como HTTP, mensageria, cache, logging, etc.

Esses contratos definem o "o que" a aplicação precisa fazer (ex: fazer uma requisição, consumir uma fila), sem saber "como" isso é feito (axios, fetch, Kafka, RabbitMQ, etc.).

Contém código de mais baixo nível possíveis como types, interfaces, const e outros de forma abrangente a servir quaisquer domínios.

## Exemplos

### Http

```ts
// src/building-blocks/data/http-data-block.ts

export default interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
}
```

### UserRepository

```ts
// src/modules/users/data/repositories-data.ts

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

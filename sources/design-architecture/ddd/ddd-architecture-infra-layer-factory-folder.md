# Infra Factory (folder)

Saiba mais sobre Factory na seção de Boas práticas > Design Patterns.

## Exemplos

### FreightMemoryRepositoryFactory

```ts
import type { Orm } from "@packages/db/memory";
import type { CtxAuth } from "@building-block/entities/ctx-auth";
import type { FreightRepositoryFactory } from "@modules/freight/data/infra/repositories";
import { FreightMemoryRepository } from "@modules/freight/infra/repositories/memory/user-memory-repository";

export class FreightMemoryRepositoryFactory
  implements FreightRepositoryFactory
{
  constructor(private readonly orm: Orm) {}
  freight(ctx: CtxAuth) {
    return new FreightMemoryRepository(ctx, this.orm);
  }
}
```

### FreightDatabaseQueryFactory

```ts
import type { Orm } from "@managr/db";
import type { FreightQueryFactory } from "@modules/freight/data/infra/queries";
import { FreightListWithRelationshipsDatabaseQuery } from "@modules/freight/infra/queries/database/freight-list-with-relationships";
export class FreightDatabaseQueryFactory implements FreightQueryFactory {
  constructor(private readonly orm: Orm) {}
  freightListWithRelationships() {
    return new FreightListWithRelationshipsDatabaseQuery(this.orm);
  }
}
```

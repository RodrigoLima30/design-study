# Query (folder)

Uma Query segue o padrão de Repository com método único com operação de leitura.

Em outras palavras, um QueryRepository ou ReadRepository expõe métodos especializados de leitura.

Ela não altera o estado do sistema, apenas extrai dados para serem usados, seja para exibir em uma interface ou alimentar algum outro processo.

É inspirada no CQRS que separa leitura de escrita, focando aqui apenas em leituras.

Ela lida com entidades e agregados, retornando especialmente agregados ou DTO em casos de grande volume de dados.

Use esse padrão em situações onde um Repository que serve especialmente CRUD, não consegue portanto “suportar” operações complexas, tais como: buscar dados de várias tabelas (usando joins, denormalizações, cache, etc).

Separar CommandRepository de QueryRepository ajuda a refletir claramente a intenção do código e manter a separação de preocupações.

Separar Mutation (escrita) de Query (leitura) clarifica a intenção do código e reduz o acoplamento entre camadas, respeitando o DDD e o Single Responsibility Principle.

## Exemplo

### AuthUserDrizzleQuery

```ts
import { type Orm, type SQL, and, eq, sql } from "@packages/db";
import {
  MemberTable,
  OrganizationTable,
  TenantTable,
  UserTable,
} from "@packages/db";
import { NotFoundError } from "@building-block/error/http-status-error";
import type { MemberProps } from "@modules/auth/data/member";
import type { OrganizationProps } from "@modules/auth/data/organization";
import type { AuthUserQuery } from "@modules/auth/data/query";
import type { TenantProps } from "@modules/auth/data/tenant";
import type { UserProps } from "@modules/auth/data/user";

export class AuthUserDrizzleQuery implements AuthUserQuery {
  constructor(public readonly orm: Orm) {}
  async execute(where: Partial<UserProps>) {
    const filters: SQL[] = [];
    const entries = Object.entries(where);
    for (const [prop, value] of entries) {
      filters.push(eq(UserTable[prop], value));
    }
    const [query] = await this.orm
      .select({
        serial: UserTable.serial,
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        emailVerified: UserTable.emailVerified,
        image: UserTable.image,
        phone: UserTable.phone,
        createdAt: UserTable.createdAt,
        updatedAt: UserTable.updatedAt,
        members: sql<MemberProps[]>`
					COALESCE(json_agg(row_to_json(${MemberTable})) FILTER (
						WHERE ${MemberTable.id} IS NOT NULL
						AND ${MemberTable.refusedAt} IS NULL
						AND ${MemberTable.deletedAt} IS NULL
					), '[]')
				`.as("members"),
        tenants: sql<TenantProps[]>`
					COALESCE(json_agg(row_to_json(${TenantTable})) FILTER (WHERE ${TenantTable.id} IS NOT NULL), '[]')
				`.as("tenants"),
        organizations: sql<OrganizationProps[]>`
					COALESCE(json_agg(row_to_json(${OrganizationTable})) FILTER (WHERE ${OrganizationTable.id} IS NOT NULL), '[]')
				`.as("organizations"),
      })
      .from(UserTable)
      .leftJoin(MemberTable, eq(MemberTable.userId, UserTable.id))
      .leftJoin(TenantTable, eq(TenantTable.id, MemberTable.tenantId))
      .leftJoin(
        OrganizationTable,
        eq(OrganizationTable.id, MemberTable.organizationId),
      )
      .where(and(...filters))
      .groupBy(UserTable.id)
      .limit(1);
    if (!query || !query.id) {
      throw new NotFoundError("User not found");
    }
    const user: UserProps = {
      ...query,
      members: query.members.map((item) => ({
        ...item,
        metadata: JSON.parse(item.metadata as any),
      })),
    };
    return user;
  }
}
```

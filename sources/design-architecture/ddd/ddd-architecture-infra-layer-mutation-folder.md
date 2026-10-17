# Mutation (folder)

### Conceito

Uma Mutation segue o padrão de Repository com método único com operação de escrita.

Em outras palavras, um MutationRepository ou WriteRepository expõe métodos especializados de escrita.

Uma Mutation segue o padrão de um Repository especializado em escrita, com uma operação única e bem definida que altera o estado do sistema.

É inspirada no CQRS que separa leitura de escrita, focando aqui apenas em escrita.

Ela lida com entidades e agregados, retornando apenas quando necessário agregados ou DTO em casos de grande volume de dados.

Use esse padrão em situações onde um Repository que serve especialmente CRUD, não consegue portanto “suportar” operações complexas, tais como: escrever, atualizar ou remover entidades e agregados.

Separar CommandRepository de MutationRepository ajuda a refletir claramente a intenção do código e manter a separação de preocupações.

Obs: É comum lidar com Transaction/Commit/Rollback em operações de mutação.

### Padrão de design

Inspirada no CQRS, a Mutation representa o lado de Command:

- Tem um único método (geralmente chamado execute ou handle) que executa uma ação;
- Atua sobre entidades e aggregates para aplicar regras de negócio e persistir mudanças;
- Evita retornar DTOs de leitura ou entidades/agregados — se necessário, pode retornar apenas identificadores, status, ou eventos de domínio.

### Estrutura e aplicação

Use Mutations quando o padrão de Repository tradicional (CRUD) não suporta bem operações complexas de escrita, tais como:

- Atualizações condicionais com lógica de negócio;
- Criação de entidades compostas;
- Validações antes da persistência;
- Emissão de eventos de domínio ou integração.

Separar Mutation (escrita) de Query (leitura) clarifica a intenção do código e reduz o acoplamento entre camadas, respeitando o DDD e o Single Responsibility Principle.

## Exemplo

### AuthAccountCreateDrizzleMutation

```ts
import { dayjs } from "@packages/dayjs";
import {
  MemberTable,
  OrganizationTable,
  type Orm,
  TenantTable,
  UserTable,
} from "@packages/db";
import { CtxHeadersBuilder } from "@building-block/builders/ctx-headers-builder";
import { CtxAuth } from "@building-block/entities/ctx-auth";
import { LogicError } from "@building-block/errors/logic";
import { memberSchema } from "@modules/auth/data/member";
import type { AuthAccountCreateMutation } from "@modules/auth/data/mutation";
import type { OrganizationProps } from "@modules/auth/data/organization";
import type { Member } from "@modules/auth/domain/entities/member";
import type { Organization } from "@modules/auth/domain/entities/organization";
import type { Tenant } from "@modules/auth/domain/entities/tenant";
import { User } from "@modules/auth/domain/entities/user";

export class AuthAccountCreateDrizzleMutation
  implements AuthAccountCreateMutation
{
  constructor(public readonly orm: Orm) {}
  async execute(
    user: User,
    member: Member,
    tenant: Tenant,
    organization?: Organization,
  ): Promise<User> {
    const result = await this.orm.transaction(async (tx) => {
      const [userCreated] = await tx
        .insert(UserTable)
        .values(await user.toDatabaseMutation())
        .returning();
      if (!userCreated) {
        throw new LogicError("User is required");
      }
      const [tenantCreated] = await tx
        .insert(TenantTable)
        .values(await tenant.toDatabaseMutation())
        .returning();
      if (!userCreated?.id || !userCreated.email) {
        throw new LogicError("There was an error creating the user");
      }
      if (!tenantCreated?.id || !tenantCreated.userId) {
        throw new LogicError("There was an error creating the tenant");
      }
      let organizationCreated: OrganizationProps | undefined;
      if (organization) {
        const [organizationValues] = await tx
          .insert(OrganizationTable)
          .values(await organization.toDatabaseMutation())
          .returning();
        if (!organization) {
          throw new LogicError(
            "There was a problem creating your organization",
          );
        }
        organizationCreated = organizationValues;
      }
      const [memberCreated] = await tx
        .insert(MemberTable)
        .values(await member.toDatabaseMutation())
        .returning();
      if (!memberCreated?.tenantId || !memberCreated.userId) {
        throw new LogicError(
          "There was an error creating the relationship with user and tenant",
        );
      }
      return {
        user: userCreated,
        tenant: tenantCreated,
        member: memberSchema.parse(memberCreated),
        organization: organizationCreated,
      };
    });
    const ctx = new CtxAuth({
      session: {
        expires: dayjs().add(1, "day").toISOString(),
        user: {
          ...result.user,
          tenants: [result.tenant],
          members: [result.member],
          organizations: result.organization ? [result.organization] : [],
        },
      },
      headers: new CtxHeadersBuilder()
        .injectDefaultPermissionProduct()
        .injectTenantSlug(tenant.slug).headers.value,
    });
    return new User(ctx, ctx.user);
  }
}
```

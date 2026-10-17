# Usecase (folder)

Use Case (ou caso de uso), é um conceito central na arquitetura Clean Architecture e também muito utilizado junto com DDD (Domain-Driven Design).

### O que é?

Um Use Case representa uma ação de negócio específica que o sistema realiza em resposta a uma intenção do usuário ou de um sistema externo.

Em termos práticos: é uma classe que orquestra uma lógica de negócio específica, utilizando repositórios, serviços de domínio, entidades, mutations/queries, etc.

### Finalidade

- Encapsular o comportamento de aplicação;
- Orquestrar dependências, como repositórios, comandos, serviços, regras do negócio;
- Aplicar regras de negócio de alto nível;
- Manter a separação entre a camada de aplicação, infra e domínio.

### Exemplo típico de uso

- Criar um frete (CreateFreightUseCase);
- Atualizar status de entrega (UpdateFreightStatusUseCase);
- Calcular rota (CalculateRouteUseCase);
- Obter detalhes de frete (GetFreightDetailsUseCase).

### Características principais

- É unitária e autocontida: executa uma ação única e clara;
- Não tem dependência direta da infraestrutura, apenas via interfaces;
- Utiliza comandos, entidades, repositórios, services, mappers, etc;
- Pode retornar entidades, agregados, DTOs, eventos de domínio, ou apenas um resultado simples;
- Facilita testes unitários: fácil mockar dependências e testar comportamento.

Obs: Um Use Case não pode chamar outro Use Case!

---

### CreateFreightUsecase

```ts
// src/modules/freight/application/usecases/create-freight.ts
import { RegisterFreightCommand } from "../commands/register-freight.command";
import { RegisterFreightMutation } from "../mutations/register-freight.mutation";

export class CreateFreightUsecase {
  constructor(private readonly mutation: RegisterFreightMutation) {}
  async execute(entity: Freight): Promise<{ id: string }> {
    return await this.mutation.execute(entity);
  }
}
```

### AuthAccountCreateUseCase

```ts
import { dayjs } from "@packages/dayjs";
import { PERMISSION_ROLE } from "@packages/permission/product/freight/roles";
import { PERMISSION_PRODUCT } from "@packages/permission/product/freight/products";
import { slugify } from "@packages/slugify";
import { CtxHeadersBuilder } from "@building-block/builder/ctx-headers-builder";
import type { Ctx } from "@building-block/entity/ctx";
import { CtxAuth } from "@building-block/entity/ctx-auth";
import { LogicError } from "@building-block/error/logic";
import { Email } from "@building-block/value-object/email";
import {
  type AuthAccountCreateProps,
  authAccountCreateSchema,
} from "@modules/auth/data/auth";
import type { AuthAccountCreateMutation } from "@modules/auth/data/mutation";
import type {
  AuthOrganizationRepository,
  AuthRepository,
  AuthTenantRepository,
} from "@modules/auth/data/repository";
import { TENANT_SLUG_BLOCKED } from "@modules/auth/data/tenant";
import { MemberMetadataBuilder } from "@modules/auth/domain/builders/member-metadata-builder";
import { Auth } from "@modules/auth/domain/entities/auth";
import { Member } from "@modules/auth/domain/entities/member";
import { Organization } from "@modules/auth/domain/entities/organization";
import { Tenant } from "@modules/auth/domain/entities/tenant";
import { User } from "@modules/auth/domain/entities/user";

export class AuthAccountCreateUseCase {
  constructor(
    public readonly ctx: Ctx,
    private readonly authRepository: AuthRepository,
    private readonly authTenantRepository: AuthTenantRepository,
    private readonly authOrganizationRepository: AuthOrganizationRepository,
    private readonly mutation: AuthAccountCreateMutation,
  ) {}
  async execute(
    input: AuthAccountCreateProps,
    today: Date,
    identifier: string,
  ): Promise<User> {
    const userFind = await this.authRepository.findFirst({
      email: input.email,
    });
    if (userFind) {
      throw new LogicError("E-mail in use");
    }
    const slug = slugify(input.account);
    if (!slug) {
      throw new LogicError("Impossible slugify");
    }
    if (TENANT_SLUG_BLOCKED.includes(slug)) {
      throw new LogicError("Slug blocked");
    }
    const data = { ...input, slug };
    const payload = await authAccountCreateSchema.parseAsync(data);
    const tenantFind = await this.authTenantRepository.findFirst({
      slug: payload.slug,
    });
    if (tenantFind) {
      throw new LogicError("Slug in use");
    }
    if (!new Email(payload.email).isPublicDomain()) {
      const [organizationFind] = await this.authOrganizationRepository.filter({
        slug: payload.slug,
      });
      if (organizationFind) {
        throw new LogicError("Slug in use");
      }
    }
    const me = new Auth(this.ctx, {
      id: identifier,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      emailVerified: null,
      phoneVerified: null,
      createdAt: today,
      updatedAt: today,
    });
    const tenant = new Tenant(this.ctx, {
      id: me.id,
      userId: identifier,
      slug: slug,
      createdAt: today,
      updatedAt: today,
    });
    let organization: Organization | undefined;
    if (!new Email(payload.email).isPublicDomain()) {
      organization = new Organization(this.ctx, {
        ...payload,
        id: identifier,
        userId: identifier,
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
      });
    }
    const metadata = new MemberMetadataBuilder()
      .injectRole(PERMISSION_PRODUCT.SUPER, PERMISSION_ROLE.ADMIN)
      .metadata.toJSON();
    const member = new Member(this.ctx, {
      id: identifier,
      tenantId: tenant.id,
      userId: identifier,
      organizationId: organization?.id,
      acceptedAt: null,
      refusedAt: null,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      deletedAt: null,
      metadata,
    });
    const expires = dayjs(today).add(1, "day").toDate();
    const ctx = new CtxAuth({
      session: {
        user: {
          ...me.data,
          name: payload.name,
          phone: payload.phone,
          members: [member.data],
          tenants: [tenant.data],
          organizations: organization ? [organization.data] : [],
        },
        expires,
      },
      headers: new CtxHeadersBuilder()
        .injectDefaultPermissionProduct()
        .injectTenantSlug(tenant.slug).headers.value,
    });
    const user = new User(ctx, ctx.user);
    return await this.mutation.execute(user, member, tenant, organization);
  }
}
```

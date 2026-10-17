# Controller (folder)

Controller é um componente fundamental da camada de aplicação.

É responsável por receber requisições externas (HTTP, gRPC, WebSocket, etc.), delegar a execução para um usecase, e retornar uma resposta apropriada.

Ele atua como a porta de entrada da aplicação, mas não contém regras de negócio.

### O que faz

- Recebe requisições externas (como de um cliente REST/GraphQL);
- Converte input (JSON, params, body, etc.) em DTOs ou comandos;
- Chama um use case;
- Trata erros e respostas, retornando status HTTP, mensagens ou DTOs.

### O que o não faz

- Não contém lógica de negócio;
- Não acessa banco de dados diretamente;
- Não instancia entidades ou faz cálculos complexos.

---

### AuthInviteUserToTenantController

```ts
import { dayjs } from "@packages/dayjs";
import { PERMISSION_SUBJECT } from "@packages/permission/product/freight/ability";
import { PERMISSION_RULE } from "@packages/permission/product/freight/rules";
import { uuidv7 } from "uuidv7";
import type { CtxAuth } from "@building-block/entities/ctx-auth";
import type { AuthInviteUserToTenantProps } from "@modules/auth/data/auth";
import { authInviteUserToTenantSchema } from "@modules/auth/data/invite";
import type { FreightRepositoryFactory } from "@modules/freight/data/repository";
import type { FreightUseCaseFactory } from "@modules/freight/factories/usecase";

export class AuthInviteUserToTenantController {
  constructor(
    public readonly ctx: CtxAuth,
    private readonly repositoryFactory: RepositoryFactory,
    private readonly useCaseFactory: UseCaseFactory,
  ) {}
  async execute(
    input: AuthInviteUserToTenantProps,
    today = dayjs().toDate(),
    identifier = uuidv7(),
  ) {
    const payload = authInviteUserToTenantSchema.parse(input);
    this.ctx
      .ability()
      .throwUnlessCan("invite", PERMISSION_SUBJECT.USER)
      .throwUnlessCan(PERMISSION_RULE.SUPER_USER_INVITE, this.ctx.me);
    const data = await this.useCaseFactory
      .authInviteUserToTenant(
        this.ctx,
        this.repositoryFactory.auth(this.ctx),
        this.repositoryFactory.authTenant(this.ctx),
        this.repositoryFactory.authMember(this.ctx),
        this.repositoryFactory.authOrganization(this.ctx),
        this.repositoryFactory.authInvite(this.ctx),
      )
      .execute(payload, today, identifier);
    return {
      user: data.user.toJSON(),
      tenant: data.tenant.toJSON(),
      organization: data.organization?.toJSON(),
      member: data.member.toJSON(),
      invite: data.invite.toJSON(),
    };
  }
}
```

# Repository (folder)

O Repository é um padrão de arquitetura muito usado para abstrair o acesso a dados, isolando a lógica de persistência do restante da aplicação.

O padrão Repository atua como uma camada intermediária entre a aplicação e a fonte de dados (banco de dados, API, etc.).

Ele encapsula toda a lógica de acesso a dados, fornecendo uma interface simples e consistente para o restante da aplicação.

É comum Repository ter operações de CRUD, mas pode ter outras operações unitárias, como:

- activate;
- disable;

### Características

- Desacoplar a lógica de negócios da lógica de acesso a dados;
- Isolar dependências externas (ORMs, drivers, APIs externas);
- Facilitar testes unitários (você pode mockar o repositório ou adapter para testes de memória);
- Permitir troca de implementação sem impactar a aplicação (ex: trocar MongoDB por PostgreSQL).

### Use o padrão Repository quando

- Você quer manter seu domínio independente da tecnologia de persistência;
- Você deseja testabilidade, sem acesso real a banco em testes;
- Seu sistema tem regras de negócio mais elaboradas e precisa de organização clara por camadas (ex: DDD).

## Exemplos

### UserPrismaRepository

```ts
// src/modules/users/infra/repositories/prisma/user.ts
import type { UserRepository } from "@modules/users/data/infra/repositories";
import type { User } from "@modules/users/domain/entities/user";

class UserPrismaRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }
  async save(user: User): Promise<void> {
    await prisma.user.create({ data: user });
  }
}
```

### UserMemoryRepository

```ts
// src/modules/users/infra/repositories/memory/user.ts
import type { UserRepository } from "@modules/users/data/infra/repositories";
import type { User } from "@modules/users/domain/entities/user";

export class UserMemoryRepository implements UserRepository {
  private users: User[] = [];
  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user ?? null;
  }
  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user; // update
    } else {
      this.users.push(user); // insert
    }
  }
}
```

### Outros

```ts
// src/main.ts
import type { UserRepository } from "@modules/users/data/infra/repositories";
import { User } from "@modules/users/domain/entities/user";
import { UserPrismaRepository } from "@modules/users/infra/repositories/prisma/user";

const userRepository: UserRepository = new UserPrismaRepository();
const user: User = await userRepository.findById("123");

if (user) {
  console.log("User found:", user.name);
}

// src/test/mock/repository.ts
import type { UserRepository } from "@modules/users/data/infra/repositories";
import { User } from "@modules/users/domain/entities/user";
import { UserMemoryRepository } from "@modules/users/infra/repositories/memory/user";

export const userRepository: UserRepository = new UserMemoryRepository();
```

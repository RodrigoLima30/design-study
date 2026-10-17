# Application Factory (folder)

Uma Application Factory é um padrão que encapsula a construção e inicialização dos componentes da aplicação, como use cases, handlers, orchestrators, etc.

Ela centraliza a composição das dependências e permite que outras partes do sistema apenas solicitem “instâncias prontas”.

Em aplicações bem estruturadas, a criação de objetos pode ficar complexa — com várias dependências interligadas.

### Vantagens

- Organiza esse processo em um lugar só;
- Separa a composição (injeção) da execução;
- Facilita testes, mock e inversão de dependência;
- Permite alternar implementações facilmente (ex: usar memória ou banco real).

## Exemplos

### Handler Factory

```ts
// src/modules/freight/application/factories/handlers.ts
import type { FreightUsecasesFactory } from "@modules/freight/application/factories/usecases";
const freightUsecasesFactory = new FreightUsecasesFactory();

export class FreightHandlersFactory {
  constructor(
    private readonly freightUsecasesFactory: FreightUsecasesFactory,
  ) {}
  freight() {
    return new FreightHandlersFactory(this.freightUsecasesFactory);
  }
}
```

### Usecase Factory

```ts
// src/modules/routes/application/factories/usecases.ts
import {
  GetRouteUseCase,
  ListRoutesUseCase,
} from "@modules/routes/domain/usecases";
import { RoutesRepositoriesFactories } from "@modules/routes/infra/factories/services";

export class RoutesUseCasesFactories {
  constructor(
    private readonly routesRepositoriesFactories: RoutesRepositoriesFactories,
  ) {}
  getRoute(): GetRouteUseCase {
    return new GetRouteUseCase(this.routesRepositoriesFactories.route());
  }
  listRoutes(): ListRoutesUseCase {
    return new ListRoutesUseCase(this.routesRepositoriesFactories.route());
  }
}
```

# Design Patterns - Creational - Factory

Referem-se essencialmente a dois padrões de instanciação de classes: Factory Method e Abstract Factory, ambos com o objetivo de encapsular a criação de objetos para tornar o código mais flexível e desacoplado.

Ambos os padrões ajudam a seguir os princípios SOLID, especialmente o princípio de Dependency Invertion e Open/Close.

### Definição

- Padrão de criação que encapsula a lógica de instanciação de objetos;
- Centraliza a criação de objetos em um único lugar;
- Esconde a complexidade da criação.

### Benefícios

- Simplifica a criação de objetos;
- Encapsulamento da lógica de criação;
- Flexibilidade na criação de objetos;
- Redução de acoplamento;
- Código mais organizado e manutenível;
- Facilita testes.

### Quando usar

- Objetos complexos para criar;
- Lógica de criação que pode mudar;
- Diferentes tipos de objetos relacionados;
- Necessidade de controle na criação;
- Redução de acoplamento.

## Factory Method

Use quando precisar instanciar uma “família customizada” que foge de nomenclaturas conhecidas em arquiteturas.

Freight por exemplo, é uma família customizada do domínio do negócio.

- Propósito: Delegar a instanciação de classes com base num valor;
- Como funciona: Uma classe com métodos que implementam a instanciação de classes conforme uma condição;
- Vantagem: Controle central de instâncias do negócio;
- Exemplo típico: Cada método recebe um valor para instânciar uma classe respectiva.

### Exemplo

```ts
class VehicleFactory {
  createVehicle(type: "TRUCK" | "VAN"): Vehicle {
    switch (type) {
      case "TRUCK":
        return new Truck();
      case "VAN":
        return new Van();
    }
  }
}
```

```ts
// src/modules/freight/data/services/freight.ts
export interface FreightService {
  calculatePrice(weight: number): number;
}
```

```ts
// src/modules/freight/domain/services/freight-express.ts
export class FreightExpressService implements FreightService {
  calculatePrice(weight: number): number {
    return weight * 20;
  }
}
```

```ts
// src/modules/freight/domain/services/freight-economy.ts
export class FreightEconomyService implements FreightService {
  calculatePrice(weight: number): number {
    return weight * 10;
  }
}
```

```ts
// src/modules/freight/domain/factories/freight.ts
import { FreightService } from "@modules/freight/data/services/freight";
import { FreightExpressService } from "@modules/freight/domain/services/freight-express";
import { FreightEconomyService } from "@modules/freight/domain/services/freight-economy";

export class FreightFactory {
  static calculatePrice(type: "express" | "economy"): FreightService {
    switch (type) {
      case "express":
        return new FreightExpressService();
      case "economy":
        return new FreightEconomyService();
      default:
        throw new Error("Invalid freight type");
    }
  }
}
```

## Abstract Factory

Comum de ser usado em instanciamento de famílias de código arquiteturais.

- Propósito: Fornecer uma interface para criar instâncias de famílias relacionados;
- Como funciona: Define um conjunto de métodos instanciam classes relacionadas;
- Vantagem: Garante que produtos criados sejam compatíveis entre si;
- Exemplo típico: Uma factory que instância classes de mesma família (usecases, controllers, etc).

### Exemplo

```ts
interface VehicleFactory {
  createEngine(): Engine;
  createWheels(): Wheels;
}

class TruckFactory implements VehicleFactory {
  createEngine(): Engine {
    return new DieselEngine();
  }
  createWheels(): Wheels {
    return new HeavyWheels();
  }
}
```

```ts
// src/modules/routes/application/factories/usecases.ts

import {
  GetRouteUseCase,
  ListRoutesUseCase,
} from "@modules/routes/application/usecases";
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

## Tipos principais

### Factory Method

- Define interface para instânciar classes;
- Delega criação de classes;
- Ideal para hierarquias de classes.

### Abstract Factory

- Cria famílias de classes relacionados;
- Garante compatibilidade entre classes;
- Útil para sistemas com múltiplas variações.

### Static Factory

- Métodos estáticos para criação;
- Nomes descritivos para diferentes construtores;
- Simplifica a criação de objetos.

### Builder Factory

- Construção passo a passo;
- Objetos complexos com muitos parâmetros;
- Permite objetos imutáveis.

### Simple Factory

- Criação direta e simples;
- Centraliza lógica de criação;
- Bom para casos básicos.

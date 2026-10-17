# Entity (folder)

Uma Entity representa um conceito do domínio com identidade única, sendo reconhecida e comparada por essa identidade, e não por seus atributos.

Ela encapsula comportamentos e regras de negócio que podem mudar ao longo do tempo, preservando sua consistência interna.

Entidades normalmente utilizam Value Object e validações por schema para garantir a integridade do estado.

Esta estrutura de Entity é fundamental em DDD para representar conceitos do domínio que precisam manter sua identidade e evoluir ao longo do tempo, como um frete, uma ordem de entrega ou um cliente.

## Aggregate

Um Aggregate é uma composição de entities e value-objects que formam uma unidade de consistência e integridade dentro do domínio.

Ele é acessado sempre a partir de uma entidade raiz (Aggregate Root), que é responsável por coordenar as mudanças e garantir as invariantes do conjunto.

A modelagem por agregados ajuda a limitar o escopo das transações, reduzir o acoplamento e preservar a coesão do domínio em torno de regras de negócio críticas.

## Características principais

- Rastreabilidade
- Consistência
- Encapsulamento
- Flexibilidade
- Testabilidade

## Diferenças entre Entity e Value Object

### Identidade

- Entity: Identidade única e imutável
- Value Object: Igualdade baseada em atributos

### Ciclo de Vida

- Entity: Pode mudar de estado
- Value Object: Imutável

### Comparação

- Entity: Comparada por ID
- Value Object: Comparada por valores

### Uso

- Entity: Representa algo que evolui no tempo
- Value Object: Representa características ou descrições

### Persistência

- Entity: Precisa ser rastreada
- Value Object: Pode ser recriado

## Exemplos

### Location

```ts
import {
  locationSchema,
  type LocationProps,
} from "@building-blocks/schemas/location";

export class Location {
  #data: LocationProps;
  constructor(private readonly props: LocationProps) {
    this.#data = locationSchema.parse(this.props);
  }
  public get data(): Readonly<LocationProps> {
    return this.#data;
  }
  public toJSON(): Readonly<LocationProps> {
    return this.#data;
  }
}
```

### Route

```ts
import { RouteId } from "@modules/routes/value-objects/route-id";
import { Route as Routing } from "@building-blocks/value-objects/route";
import { Location } from "@building-blocks/entities/location";
import { type RouteProps, routeSchema } from "@modules/routes/domain/schemas";
import type { Metadata } from "@building-blocks/schemas/metadata";

export class Route {
  #data: RouteProps;
  constructor(private readonly props: RouteProps) {
    this.#data = routeSchema.parse(this.props);
  }
  public get data(): Readonly<RouteProps> {
    return this.#data;
  }
  get id(): string {
    return new RouteId({
      origin: new Routing(this.#data.origin),
      destiny: new Routing(this.#data.destiny),
    }).value;
  }
  get origin(): Location {
    return new Location(this.#data.origin);
  }
  get destiny(): Location {
    return new Location(this.#data.destiny);
  }
  get metadata(): Metadata {
    return this.#data.metadata;
  }
  public toJSON(): Readonly<RouteProps> {
    return {
      ...this.#data,
      origin: this.origin.toJSON(),
      destiny: this.destiny.toJSON(),
      metadata: this.metadata,
    };
  }
}
```

### Calculation

```ts
import { Address } from "@building-blocks/value-objects/address";
import { type CalculationProps, calculationSchema } from "../schemas";

export class Calculation {
  #data: CalculationProps;
  constructor(private readonly props: CalculationProps) {
    this.#data = calculationSchema.parse(this.props);
  }
  public get data(): Readonly<CalculationProps> {
    return this.#data;
  }
  get addresses(): ReadonlyArray<Address> {
    return this.#data.addresses.map(
      (address) =>
        new Address({
          street: address.street,
          neighborhood: address.district,
          city: address.city,
          state: address.region,
          postalCode: address.postcode,
          geolocation: address.geolocation,
        }),
    );
  }
  public toJSON(): Readonly<CalculationProps> {
    return this.#data;
  }
}
```

### Zone

```ts
import type { Metadata } from "@building-blocks/schemas/metadata";
import { ZoneId } from "@modules/zones/value-objects/zone-id";
import { type ZoneProps, zoneSchema } from "../schemas";
import { Postcode } from "@building-blocks/value-objects/postcode";

export class Zone {
  #data: ZoneProps;
  constructor(private readonly props: ZoneProps) {
    this.#data = zoneSchema.parse(this.props);
  }
  public get data(): Readonly<ZoneProps> {
    return this.#data;
  }
  get id(): string {
    return new ZoneId(this.#data);
  }
  get postcode(): Postcode | null | undefined {
    if (!this.#data.postcode) {
      return null;
    }
    return new Postcode(this.#data.postcode);
  }
  get metadata(): Metadata {
    return this.#data.metadata;
  }
  public toJSON(): Readonly<ZoneProps> {
    return {
      ...this.#data,
      id: this.id,
      postcode: this.postcode?.value,
    };
  }
}
```

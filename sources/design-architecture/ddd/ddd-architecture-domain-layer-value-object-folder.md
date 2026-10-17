# Value Object (folder)

Um Value Object é uma estrutura imutável que representa um conceito com valor próprio, mas sem identidade. Ele é comparado por seu conteúdo e não por referência, sendo útil para expressar medidas, quantidades, endereços, e outras informações onde a igualdade de valor é o que importa. No domínio, ajuda a manter a lógica encapsulada, promovendo consistência e clareza no modelo.

### Características principais

- Código de baixo nível
- Imutabilidade
- Igualdade baseada em atributos
- Sem identidade própria
- Auto-validados

### Encapsulam regras de negócio

- Encapsulamento de Regras de Negócio
- Centraliza a lógica de validação
- Garante consistência dos dados
- Reduz duplicação de código

### Imutabilidade

- Previne efeitos colaterais
- Facilita o raciocínio sobre o código
- Melhora a thread-safety

### Auto-validação

- Garante que os dados estão sempre válidos
- Reduz a necessidade de validações externas
- Centraliza as regras de validação

### Reutilização

- Pode ser usado em diferentes partes do sistema
- Reduz duplicação de código
- Mantém consistência nas regras de negócio

### Testabilidade

- Fácil de testar isoladamente
- Comportamento previsível
- Reduz a complexidade dos testes

## Exemplos

### PostCode

```ts
export class PostCode {
  #value: string;
  constructor(payload: string) {
    if (!/^\d{5}-?\d{3}$/.test(payload)) {
      throw new Error("Invalid postcode");
    }
    this.#value = postCode.replace("-", "");
  }
  public get value(): string {
    return this.#value;
  }
}
```

### RouteId

```ts
import type { Route } from "@building-blocks/value-objects/route";

export class RouteId {
  constructor(private readonly props: { origin: Route; destiny: Route }) {
    this.props = props;
  }
  public get value(): string {
    return `FROM|${this.props.origin.data.from}-${this.props.origin.data.to}|TO|${this.props.destiny.data.from}-${this.props.destiny.data.to}`;
  }
}
```

### Route

```ts
import { type RouteProps, routeSchema } from "@building-blocks/schemas/route";

export class Route {
  #data: RouteProps;
  constructor(private readonly props: RouteProps) {
    this.#data = routeSchema.parse(this.props);
  }
  public get data(): Readonly<RouteProps> {
    return this.#data;
  }
  public get value(): string {
    return `${this.#data.from}|${this.#data.to}`;
  }
  public toJSON(): Readonly<RouteProps> {
    return this.#data;
  }
}
```

### Geolocation

```ts
import {
  type GeolocationProps,
  geolocationSchema,
} from "@building-blocks/schemas/geolocation";

export class Geolocation {
  #data: GeolocationProps;
  constructor(private readonly props: GeolocationProps) {
    this.#data = geolocationSchema.parse(this.props);
  }
  public get data(): Readonly<GeolocationProps> {
    return this.#data;
  }
  get value(): string {
    return `${this.#data.latitude},${this.#data.longitude}`;
  }
  public toJSON(): Readonly<GeolocationProps> {
    return this.#data;
  }
}
```

### Address

```ts
import { AddressBuilder } from "@building-blocks/builders/address";
import {
  type AddressProps,
  addressSchema,
} from "@building-blocks/schemas/address";
import { Geolocation } from "@building-blocks/value-objects/geolocation";

export class Address {
  #data: AddressProps;
  constructor(private readonly props: AddressProps) {
    this.#data = addressSchema.parse(this.props);
  }
  public get data(): Readonly<AddressProps> {
    return this.#data;
  }
  get geolocation(): Geolocation | null {
    if (
      !this.#data.geolocation?.latitude ||
      !this.#data.geolocation?.longitude
    ) {
      return null;
    }
    return new Geolocation({
      latitude: this.#data.geolocation.latitude,
      longitude: this.#data.geolocation.longitude,
    });
  }
  public toJSON(): Readonly<AddressProps> {
    return {
      ...this.#data,
      geolocation: this.geolocation?.toJSON(),
    };
  }
  public toString(): string {
    return AddressBuilder.make(this.#data).value;
  }
}
```

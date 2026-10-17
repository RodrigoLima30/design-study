# Data (layer)

Onde centralizamos os códigos de mais baixo nível possível, tais como: enum, interfaces, types, constants, schemas, etc.

Contém apenas valores imutáveis e constantes. Nunca implementações de processamento.

Todas as camadas podem importar dela, e ela só pode importar os tipagem.

Bonus: Com ela, podemos planejar de exportar como um package para que outros projeto da empresa que tem sinergia e se encaixam na estratégia de bounded-contexts para que possam aplicar validações de tipagem.

Assim, durante o pipeline de ci/cd, possa aplicar validações de tipos entre projetos dependentes.

## Visão de data por arquitetura

- data = camada de implementação de acesso a dados, sem regras de negócio.
- DDD: data fica como parte da infraestrutura.
- Clean Architecture: data com implementações de baixo nível (usando mappers, schemas, DTOs).
- Onion Architecture: data está nas bordas, depende do domínio, nunca o contrário.

## Nossa visão da pasta data

Aplicamos data de acordo com a visão de Clean Architecture como uma camada que contém código de mais baixo nível possível, como tipagem e de arquivos estáticos.

## Exemplos

### Constant

```ts
export const REDIS_PREFIX = "redis";
```

### Enum

```ts
export enum PEGAKI_STATE_CODE = {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  POSTED_IN_LOCATION = 'POSTED_IN_LOCATION',
  COLLECTED_FROM_LOCATION = 'COLLECTED_FROM_LOCATION',
}
```

### Interface and type

```ts
export interface Metadata {
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  disabledAt?: Date;
  activatedAt?: Date;
  ratedAt?: Date;
  reviewedAt?: Date;
}
```

### Location

```ts
import { z } from "zod";

export const locationSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  uf: z.string().length(2),
  city: z.string().min(1),
  capital: z.boolean(),
});

export type LocationProps = z.infer<typeof LocationSchema>;
```

### Geolocation

```ts
import { z } from "zod";

export const geolocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type GeolocationProps = z.infer<typeof GeolocationSchema>;
```

### Address

```ts
import { z } from "zod";
import { geolocationSchema } from "./geolocation";

export const addressSchema = z
  .object({
    street: z.string().min(1).nullish(),
    number: z.string().min(1).nullish(),
    complement: z.string().nullish(),
    neighborhood: z.string().min(1).nullish(),
    city: z.string().min(1).nullish(),
    state: z.string().length(2).nullish(),
    postalCode: z.string().min(8).max(9).nullish(),
    country: z.string().length(2).nullish(),
    capital: z.boolean().nullish(),
    geolocation: GeolocationSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const props = [
      "street",
      "number",
      "complement",
      "neighborhood",
      "city",
      "state",
      "postalCode",
      "country",
      "capital",
    ] as const;
    const hasAnyValue = props.some((key) => data[key]);
    if (!hasAnyValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço precisa ter pelo menos um valor",
      });
    }
  });

export type AddressProps = z.infer<typeof AddressSchema>;
```

### Consumer

```ts
// src/building-blocks/data/consumer.ts

export interface Consumer {
  consume(queue: string, handler: MessageHandler): void;
  connect(group: string): Promise<void>;
}

export type MessageHandler = (
  message: any,
  ack: Ack,
  nack: Nack,
) => Promise<void>;

export interface Ack {
  (): void;
}

export interface Nack {
  (requeue: boolean): void;
}
```

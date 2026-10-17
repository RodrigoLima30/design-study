# Entrypoint (folder)

Sendo da camada main (principal), o Entrypoint (ou "ponto de entrada") é o primeiro componente que recebe e processa uma solicitação externa que chega até sua aplicação — pode ser via HTTP, CLI, fila, evento, etc.

Em outras palavras:

- É a interface entre o mundo externo e o seu sistema;
- Ele inicia o fluxo de execução interno da aplicação.

### Exemplos comuns

| Tipo de Aplicação        | Entrypoint típico           |
| ------------------------ | --------------------------- |
| API REST (Express/Nest)  | Controller                  |
| CLI                      | Comando ou script main.ts   |
| Worker (fila/eventos)    | Consumer de mensagem        |
| GraphQL                  | Resolver ou handler         |
| Microservice (HTTP/gRPC) | Handler da interface remota |
| Serverless               | Função handler()            |

### O que faz

- Aponta uma url ou mensageria para a próxima camada application (controllers, handlers, etc).

### O que não faz

- Não implementa lógica de negócio;
- Não acessa banco diretamente;
- Não conhece detalhes do domínio — apenas chama quem sabe.

## Exemplos

### Status

```ts
// src/main/entrypoints/router.ts

import { HttpAdapter } from "@building-blocks/adapters/http";
import { statusRouter } from "@modules/status/presentation/http/routers";

const router = HttpAdapter.router();

router.use("/status", statusRouter);
```

### Freight

```ts
// src/main/entrypoints/freight.ts

import { freightConsumer } from "@modules/freight/presentation/messaging/consumers";

freightConsumer();
```

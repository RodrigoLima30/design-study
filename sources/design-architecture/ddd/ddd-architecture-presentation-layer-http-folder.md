# Http (folder)

A pasta Http organiza todos os componentes relacionados ao protocolo HTTP (REST ou similar) — geralmente rotas, middlewares, serializadores, erros HTTP, etc.

### Benefícios dessa separação

- Clareza semântica: Contém formas de entrada;
- Escalabilidade modular: Cada módulo define suas rotas sem poluir o core da aplicação;
- Integração fácil com adaptadores: Usa o HttpAdapter, que pode abstrair frameworks web;
- Independência de infraestrutura: As rotas lidam com protocolo HTTP, mas não têm dependência direta drivers e o domínio.

## Router

É um componente da camada Presentation, usado para organizar e agrupar endpoints HTTP por módulo.

Na prática, é um agrupador de rotas HTTP que:

- Define os caminhos da API;
- Encaminha essas requisições para os respectivos Controllers;
- É usado pelo adaptador HTTP para compor a aplicação completa.

### Escalabilidade

- Cada módulo define e expõe seu próprio router.
- Facilita adição de novos domínios (ex: /orders, /payments, etc).

### Plugabilidade

- Você pode facilmente trocar dentro HttpFactory o framework que deseja usar;
- Pode aplicar middlewares por rota, módulo ou globalmente.

## Exemplo

### Status router

```ts
// src/modules/status/presentation/http/status-http.ts

import { HttpAdapter } from "@building-blocks/adapters/http";
import { StatusControllersFactory } from "@modules/status/application/factories/controllers";

const controller = StatusControllersFactory.http();
export const statusRouter = HttpAdapter.router();

statusRouter.get("/v1", controller.get.bind(controller));
```

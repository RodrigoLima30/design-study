# Design Patterns - Structural - Adapters

São componentes que conectam o mundo externo à sua aplicação e ao seu domínio, respeitando o princípio de separação de responsabilidades e mantendo o domínio isolado de detalhes técnicos.

Adapters são portas de entrada ou saída que transformam dados e comportamentos entre diferentes camadas ou sistemas.

Eles implementam ou consomem interfaces do domínio ou da aplicação, sem alterar a lógica de negócio.

### Características

- Padrão estrutural: Foca na forma como classes e objetos são compostos;
- Converte uma interface em outra que o cliente espera;
- Útil para integração com código legado ou bibliotecas de terceiros;
- Dois tipos principais:
  - Adapter de classe (usa herança – menos flexível);
  - Adapter de objeto (usa composição – mais comum).
- Desacopla o código do cliente da implementação específica;
- Facilita reutilização de código existente sem modificá-lo.

### Herança vs Composição

| Tipo   | Técnica    | Flexível | Herança? | Composição? |
| ------ | ---------- | -------- | -------- | ----------- |
| Classe | Herança    | ❌       | ✅       | ❌          |
| Objeto | Composição | ✅       | ❌       | ✅          |

### Adapters são usados em dois sentidos

| Tipo de Adapter           | Direção                  | Exemplo                                   |
| ------------------------- | ------------------------ | ----------------------------------------- |
| Inbound Adapter (Entrada) | De fora → para o sistema | Controllers, APIs, GraphQL resolvers, etc |
| Outbound Adapter (Saída)  | Do sistema → para fora   | Repositórios, APIs externas, Kafka, etc   |

## Adapter de classe

Um Adapter de Classe, no padrão GoF, é um tipo de adapter que:

#### Características

- Estende (herda de) uma classe existente ou implementa uma interface esperada pelo sistema;
- Conecta uma interface existente (incompatível) a uma interface esperada;
- Permite que componentes que não foram projetados para trabalhar juntos se comuniquem através da adaptação da interface;

#### De acordo com este exemplo

- HttpClient é a interface esperada;
- AxiosAdapter e FetchAdapter implementam essa interface;
- Cada adapter encapsula a lógica de um framework diferente (axios, fetch), apresentando uma interface unificada (get, post);
- Isso permite que o restante da aplicação use httpClient sem se preocupar com qual tecnologia está por trás.

### Exemplo

```ts
// src/building-blocks/data/http.ts
export default interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
}

// src/building-blocks/adapters/http/axios.ts
import { HttpClient } from "@building-blocks/data/http";

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await axios.get(url);
    return response.data;
  }

  async post(url: string, body: any): Promise<any> {
    const response = await axios.post(url, body);
    return response.data;
  }
}

// src/building-blocks/adapters/http/fetch.ts
import { HttpClient } from "@building-blocks/data/http";

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, body: any): Promise<any> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
}

// src/building-blocks/adapters/http.ts
import axios from "axios";
import fetch from "node-fetch";
import { HttpClient } from "@building-blocks/data/http";
import { AxiosAdapter } from "@building-blocks/adapters/http/axios";
import { FetchAdapter } from "@building-blocks/adapters/http/fetch";

// Exemplo de seleção simples com base em variável de ambiente
const adapterType = process.env.HTTP_ADAPTER || "axios";

let httpClient: HttpClient;

if (adapterType === "fetch") {
  global.fetch = fetch as any; // necessário para node-fetch funcionar no Node.js
  httpClient = new FetchAdapter();
} else {
  httpClient = new AxiosAdapter();
}

export default httpClient;
```

## Adapter de objeto

Imagine que sua aplicação trabalha com a seguinte interface para processar pagamentos.

Mas você quer usar um serviço externo (por exemplo, um SDK legado de terceiros), cuja interface é bem diferente.

Aqui está o Adapter de Objeto que usa uma instância do StripeSDK (sem estender a classe).

```ts
// src/building-blocks/data/payment.ts
interface PaymentProcessor {
  pay(amount: number): void;
}

// src/building-blocks/adapters/stripe/stripe-sdk.ts
class StripeSDK {
  makePayment(cents: number): void {
    console.log(`Pagamento de ${cents} centavos processado via Stripe.`);
  }
}

// src/building-blocks/adapters/stripe/stripe-adapter.ts
import type { PaymentProcessor } from "src/building-blocks/data/payment";
class StripeAdapter implements PaymentProcessor {
  private stripe: StripeSDK;

  constructor(stripe: StripeSDK) {
    this.stripe = stripe;
  }

  pay(amount: number): void {
    const cents = amount * 100;
    this.stripe.makePayment(cents);
  }
}

// src/main.ts
import { StripeSDK } from "src/building-blocks/adapters/stripe/stripe-sdk";
import { StripeAdapter } from "src/building-blocks/adapters/stripe/stripe-adapter";

const stripe = new StripeSDK();
const paymentProcessor: PaymentProcessor = new StripeAdapter(stripe);

paymentProcessor.pay(49.99);
// Saída: Pagamento de 4999 centavos processado via Stripe.
```

#### Entendendo o exemplo

- O StripeAdapter não herda de StripeSDK.
- Ele recebe uma instância (stripe) via composição.
- Ele adapta o comportamento delegando chamadas ao objeto interno (this.stripe).

#### Esse padrão é útil quando

- Você quer usar várias implementações diferentes (ex: Stripe, PayPal, etc.).
- Precisa manter seu código desacoplado do SDK original.

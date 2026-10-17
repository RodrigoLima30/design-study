# Building Adapter (folder)

A pasta Adapter dentro de building-blocks representa a implementação concreta de contratos definidos na pasta data, como Http, Consumer, Publisher, etc.

É onde sua aplicação realmente conecta com o mundo externo — usando bibliotecas e SDKs como axios, fetch, amqplib, kafkajs, etc.

### Objetivo

- Isolar dependências de infraestrutura (como Kafka, RabbitMQ, Axios);
- Encapsular bibliotecas de terceiros atrás de interfaces próprias do sistema;
- Permitir substituir ou alternar tecnologias com facilidade;
- Tornar o sistema mais testável e desacoplado.

### Vantagens

- Plugabilidade: Muda facilmente o meio de comunicação ou biblioteca;
- Testabilidade: Você pode mockar os contratos em testes (HttpClient, Consumer, etc);
- Isolamento da infra: Lógica de negócio e aplicação não sabem que usam RabbitMQ, Axios ou Kafka;
- Reutilização: Um mesmo Adapter pode ser usado em diversos módulos.

### Resumo

- A pasta Adapter é onde você materializa contratos genéricos (data) com tecnologia real;
- Ela segue o princípio de inversão de dependência;
- Adapters bem escritos garantem que sua aplicação seja portável, desacoplada e sustentável no longo tempo.

## Exemplos

### Axios

```ts
// src/building-blocks/adapters/http/axios-http-adapter-block.ts

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
```

### Fetch

```ts
// src/building-blocks/adapters/http/fetch-http-adapter-block.ts

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
```

### RabbitMQ Adapter

```ts
// src/building-blocks/adapters/rabbitmq-consumer-adapter-block.ts

import { Consumer, MessageHandler, Ack, Nack } from "./consumer";

export class RabbitMQConsumer implements Consumer {
  private set consumer(channel: any): void {
    if (!this.consumer) {
      this.consumer = channel;
    }
  }
  public get consumer(): any {
    return this.consumer;
  }
  async connect(_: string): Promise<void> {
    if (this.consumer) return;
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.consumer = await connection.createChannel();
  }
  consume(queue: string, handler: MessageHandler): void {
    if (!this.consumer) {
      throw new Error("Uninitialized consumer!");
    }
    this.consumer.consume(queue, async (msg: any) => {
      const ack: Ack = () => this.consumer.ack(msg);
      const nack: Nack = (requeue) => this.consumer.nack(msg, false, requeue);
      await handler(JSON.parse(msg.content.toString()), ack, nack);
    });
  }
}
```

### Kafka Adapter

```ts
// src/building-blocks/adapters/kafka-consumer-adapter-block.ts

import { Consumer, MessageHandler, Ack, Nack } from "./consumer";

export class KafkaConsumer implements Consumer {
  private set consumer(channel: any): void {
    if (!this.consumer) {
      this.consumer = channel;
    }
  }
  public get consumer(): any {
    return this.consumer;
  }
  async connect(groupId: string): Promise<void> {
    if (this.consumer) return;
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_URL],
    });
    this.consumer = kafka.consumer({ groupId });
  }
  consume(queue: string, handler: MessageHandler): void {
    if (!this.consumer) {
      throw new Error("Uninitialized consumer!");
    }
    this.consumer.subscribe([queue]);
    this.consumer.run({
      eachMessage: async ({ message }) => {
        const ack: Ack = () =>
          this.consumer.commitOffsets([
            {
              topic: message.topic,
              partition: message.partition,
              offset: message.offset,
            },
          ]);
        const nack: Nack = (requeue) =>
          this.consumer.seek({
            topic: message.topic,
            partition: message.partition,
            offset: message.offset,
          });
        await handler(JSON.parse(message.value.toString()), ack, nack);
      },
    });
  }
}
```

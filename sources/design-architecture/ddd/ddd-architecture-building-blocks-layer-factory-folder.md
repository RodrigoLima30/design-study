# Building Factory (folder)

A Factory em em building-blocks é uma fábrica usada para instanciar adaptadores reutilizáveis da aplicação, como Consumer, Channel, Logger, Http, etc.

Ela atua como uma abstração central de infraestrutura, escondendo detalhes técnicos como qual tecnologia está por trás (ex: Kafka ou RabbitMQ).

### Função

- Atua como Service Locator para instanciar o driver correto;
- Centraliza a lógica de decisão por tecnologia (Kafka ou RabbitMQ);
- Evita acoplamento do restante da aplicação à infraestrutura de mensageria;
- Garante Singleton da instância (via let channel), evitando múltiplas conexões.

### Benefícios

- Flexibilidade: Troca Kafka ↔ RabbitMQ só mudando uma env (CONSUMER_PROVIDER);
- Reutilização: Pode ser usada em vários pontos da aplicação;
- Testabilidade: Pode ser facilmente mockada em testes de integração ou memória;
- Isolamento: A camada main, application ou presentation não conhece a infra real.

## Exemplos

### Consumer Factory

```ts
// src/building-blocks/factories/consumer-factory-block.ts

import type { Consumer } from "@building-blocks/data/consumer";
import { KafkaConsumer } from "@building-blocks/adapters/kafka-consumer";
import { RabbitMQConsumer } from "@building-blocks/adapters/rabbitmq-consumer";

let channel: Consumer;

export class FreightConsumerFactory {
  channel(): Promise<Consumer> {
    if (channel) {
      return channel;
    }
    const provider = process.env.CONSUMER_PROVIDER;
    if (provider === "kafka") {
      channel = new KafkaConsumer();
    }
    if (provider === "rabbitmq") {
      channel = RabbitMQConsumer();
    }
    if (!channel) {
      throw new Error("Unsupported messaging provider");
    }
    return channel;
  }
}
```

# Handle (folder)

Um Handler é um componente responsável por tratar uma mensagem recebida de forma assíncrona — geralmente por meio de uma fila, evento ou stream — atuando como o "Controller do mundo assíncrono".

Ou seja, enquanto o Controller é o ponto de entrada HTTP, o Handler é o ponto de entrada para mensagens em sistemas orientados a eventos ou mensageria (ex: Kafka, RabbitMQ, SQS).

### Ele deve

Receber a mensagem (payload);

- Validar o conteúdo (ex: esquema, campos obrigatórios);
- Verificar permissões ou integridade de dados se necessário;
- Lidar com nack, dead-letter ou reprocessamentos;
- Chamar o caso de uso apropriado;
- Confirmar ou rejeitar o processamento (via ack/nack);
- Garantir idempotência (opcional, mas importante).

### Ele não deve

- Conter lógica de negócio;
- Ter dependência direta de brokers ou drivers;
- Acessar banco diretamente (isso é papel do use case ou domínio).

### Vantagens

- Desacopla a lógica de mensageria da lógica de negócio;
- Organiza bem a responsabilidade de processar eventos assíncronos;
- Permite testes isolados (você pode simular mensagens);
- Reutilizável com diferentes brokers (se usar adapters);
- Facilita extensões como logs, métricas e rastreamento.

### Extras que você pode incluir

- Validação com zod;
- Registro de métricas (prometheus, datadog);
- Suporte a retry + backoff + DLQ;
- Correlation ID para rastreamento.

### Analogia com Controller

| Característica  | Controller                | Handler                           |
| --------------- | ------------------------- | --------------------------------- |
| Entrada         | HTTP request              | Mensagem da fila/evento           |
| Saída           | HTTP response             | Ack/Nack (ou nenhuma)             |
| Lida com        | Rotas e verbos HTTP       | Tópicos, filas, eventos           |
| Responsável por | Validar, encaminhar fluxo | Validar, tratar evento assíncrono |
| Chama           | Use Case                  | Use Case                          |

## Exemplo

### Freight

```ts
// src/modules/freight/application/handlers/freight.ts

import type { Ack, Nack } from '@building-blocks/data/consumer';
import { FreightUsecasesFactory } from @modules/freight/application/factories/usecases';

export class FreightHandler {
  constructor(private readonly freightUsecasesFactory: FreightUsecasesFactory) {}
  async handle(message: any, ack: Ack, nack: Nack): Promise<void> {
    try {
      if (!message.freightId || !message.newStatus) {
        throw new Error('Invalid message format');
      }
      await this.freightUsecasesFactory.freight().execute(message.freightId, message.newStatus);
      ack();
    } catch (error) {
      console.error('Error processing message:', error);
      nack(false);
    }
  }
}
```

# Messaging (folder)

Messaging é uma pasta que contém implementações sobre mensageria.

Uma dessas implementações são baseados com Consumer.

## Consumer

Um Consumer é um componente da aplicação responsável por receber, processar e reagir a mensagens que chegam de um broker de mensagens (ex: RabbitMQ, Kafka, AWS SQS, etc).

Ele é o equivalente de um Controller, mas no contexto de filas/eventos:

- No HTTP você escuta endpoints;
- Na mensageria, o Consumer escuta filas, tópicos ou canais.

### Vantagens do entrypoint de mensageria

- Permite desacoplamento entre produtores e consumidores;
- Suporta escalabilidade assíncrona (processar mensagens em paralelo);
- Permite resiliência e tolerância a falhas;
- Ideal para event-driven architecture e microservices.

### Boas práticas

- Isolar lógica de domínio;
- Validar a entrada (mesmo que venha da fila!);
- Tratar erros com responsabilidade: Retry, nack, dead-letter;
- Registrar logs e métricas para rastrear comportamento;
- Idempotência: Garantir que processar a mesma mensagem duas vezes não cause inconsistência.

### O que faz

- Escuta uma fila, tópico ou stream;
- Chama um Handler de Application;
- Trata falhas (retry, nack, dead-letter);
- Pode emitir outros eventos.

### O que não deve fazer

- Conter lógica de negócio;
- Fazer acoplamento direto com infraestrutura ou banco de dados sem mediação.

### Tipos de Consumers

| Tipo             | Exemplo                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Command Consumer | Mensagens que indicam uma ação (ex: criar pedido)                   |
| Event Consumer   | Mensagens que representam fatos ocorridos (ex: pedido pago)         |
| Stream Consumer  | Processamento contínuo de dados de alto volume (ex: logs, sensores) |

## Exemplo

### Consumer

```ts
// src/modules/freight/presentation/messaging/consumers.ts

import { FreightConsumerFactory } from "@modules/freight/infra/factories/consumers";
import { FreightHandlersFactory } from "@modules/freight/application/factories/handlers";

const channel = new FreightConsumerFactory().channel();
const handler = new FreightHandlersFactory();

export async function freightConsumer() {
  await channel.connect();
  channel.consume("freight-status-updated", handler.handle.bind(handler));
}
```

# Application Orchestrator (folder)

Um Orchestrator (ou Orquestrador) é um componente responsável por coordenar a execução de múltiplas ações ou serviços em uma sequência lógica, controlando o fluxo do processo de ponta a ponta.

É um padrão muito usado quando um processo de negócio envolve múltiplos passos e serviços que precisam acontecer em uma ordem específica.

Basicamente sempre que precisar reaproveitar uma sequência de serviços, você poderá centralizar todos num Orchestrator e reusar em outros Use Cases.

É bem-vindo ser usado em conjunto com alguma estratégia de Design Pattern.

| Papel        | Responsabilidade                            | Nível |
| ------------ | ------------------------------------------- | ----- |
| Service      | Coordena pequenas necessidades da aplicação | Baixo |
| Orchestrator | Coordena multiplas necessidades de serviço  | Médio |
| Use Case     | Orchestra uma ação de negócio específica    | Alto  |

### Quando usar

- Precisar controlar uma sequência de passos com lógica condicional;
- Precisar reaproveitar uma sequência ordenada de serviços;
- Múltiplos Use Cases tiverem uma necessidade comum e repetida.

### Vantagens do uso

- Centralização de múltiplos processos reusáveis em Use Cases;
- Permite compensações e tratamento de falhas em nível de processo;
- Funciona bem com mensageria/eventos e arquitetura orientada a serviços.

### Importante

- O Orchestrator não deve conter lógica de negócio — isso continua no domínio;
- Ele coordena ações, não implementa regras.

## Exemplo

### DispatchDeliveryOrchestrator

```ts
// src/modules/delivery/application/orchestrators/dispatch-delivery.ts

export class DispatchDeliveryOrchestrator {
  constructor(
    private readonly notifyClient: NotifyClientService,
    private readonly startTracking: StartTrackingUseCase,
    private readonly logEvent: LogFreightHistoryUseCase,
  ) {}
  async execute(freightId: string): Promise<void> {
    await this.notifyClient.send(freightId, "Your freight is on the way");
    await this.startTracking.execute(freightId);
    await this.logEvent.execute({
      freightId,
      type: "STARTED_DELIVERY",
      timestamp: new Date(),
    });
  }
}
```

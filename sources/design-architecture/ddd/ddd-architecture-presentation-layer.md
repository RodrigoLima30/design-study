# Presentation (layer)

A camada Presentation (ou "camada de apresentação") é a interface pública do sistema.

Ela é responsável por receber requisições externas, interpretá-las e encaminhar o fluxo de execução para as camadas internas da aplicação — como controllers e handlers.

### Responsabilidades

- Receber entrada externa (requisições/mensagens);
- Chamar o que for necessário na camada de application;
- Retornar/emitir respostas, status ou eventos.

### Vantagens

- Isolamento das interfaces externas: muda API, fila ou CLI sem tocar no core da aplicação;
- Organização clara por canal de entrada (http, fila, gRPC, etc);
- Facilidade de testes com simulações de entrada e verificação de chamadas;
- Aderência a padrões modernos (Clean Architecture, Hexagonal).

---

- API
- Messaging

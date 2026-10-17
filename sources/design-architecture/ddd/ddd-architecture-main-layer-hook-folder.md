# Hook (folder)

A pasta Hooks contém funções que controlam o ciclo de vida da aplicação, como inicialização, desligamento, monitoramento ou manutenção.

São funções executadas antes ou depois do runtime principal iniciar ou encerrar.

### Vantagens

- Evita race conditions ao iniciar com dependências ainda pendentes;
- Evita perda de dados ao encerrar processos ativos abruptamente;
- Facilita a observabilidade (sabemos se o app está ok antes de aceitar tráfego);
- Dá suporte a ambientes serverless, que usam warmups automaticamente;
- Prepara para orquestradores como Kubernetes, que exigem readiness/liveness.

### Resumo

- Agrupa pontos importantes de início e fim do ciclo de vida da aplicação;
- Promove robustez operacional, especialmente em ambientes como containers, serverless, workers e filas;
- Torna o server.ts mais limpo, coeso e desacoplado.

---

### Sugestões de arquivos

- warmup.ts
- shutdown.ts
- lifecycle.ts

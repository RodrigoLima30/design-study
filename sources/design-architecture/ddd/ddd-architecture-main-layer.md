# Main (layer)

Na Clean Architecture do Robert C. Martin (Uncle Bob), a camada "main" (ou camada de composição ou frameworks & drivers) é a parte mais externa da arquitetura.

### Responsabilidades

Compor a aplicação: Configurar e conectar as dependências entre as outras camadas (domain, infrastructure, application, presentation);

Iniciar a aplicação: Rodar servidores, listeners (HTTP, gRPC, CLI), e inicializar serviços;

Adaptar a aplicação ao mundo externo: HTTP frameworks (Express, Fastify, NestJS), Banco de Dados, mensageria, arquivos, APIs externas.

### Características

Main = Ponto de entrada da aplicação (composition root);

Apenas liga as peças (sem regras de negócio);

Depende das outras camadas, mas nenhuma camada deve depender dela;

Seus arquivos são como de bootstrap, servidor, rotas, configurações globais.

### Estrutura comum:

```
src/
 ── main/
    └── middlewares/
    └── entrypoints/
        └── index.ts
        └── router.ts
    └── hooks/
        └── shutdown.ts
        └── warmup.ts
    └── app.ts
    └── boot.ts
    └── server.ts
```

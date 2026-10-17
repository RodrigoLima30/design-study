# Infra (layer)

A Infra serve como ponte entre o domínio e recursos externos, cuidando da implementação técnica que não pertence diretamente à lógica de negócio.

Ela é onde ficam as integrações com frameworks, bancos de dados, filas, sistemas externos, persistência, cache, logs, etc.

É o elo entre o domain e application.

Obs: infra é uma camada de solução arquitetural de business que pode importar de domain mas não de application.

---

- Adapter
- Repository
- Query
- Mutation
- Factory

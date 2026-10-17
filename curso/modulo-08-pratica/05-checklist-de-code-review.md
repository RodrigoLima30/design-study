# 8.5 · Checklist de code review arquitetural

Use em PRs. Nem todo item se aplica a todo PR.

## Domínio

- [ ] Regras de negócio estão **no domínio**, não em controllers, queries ou handlers?
- [ ] Entities mudam por **métodos de intenção** (`cancel`, `post`), sem setters públicos?
- [ ] Conceitos com regra são **Value Objects** (não `string`/`number` soltos)?
- [ ] Dinheiro em **centavos** / tipo `Money`?
- [ ] O aggregate **protege suas coleções** (não as expõe mutáveis)?
- [ ] Outros aggregates são referenciados **por ID**?
- [ ] O domínio **não faz I/O** (`await`, banco, HTTP)?
- [ ] `now` e IDs gerados são **injetados**?
- [ ] Nomes seguem a **linguagem ubíqua** do contexto?

## Camadas e dependências

- [ ] Nenhum import de `infra`/`application`/`presentation` dentro de `domain`?
- [ ] Nenhum import de `application` dentro de `infra`?
- [ ] O usecase depende de **contratos** (interfaces), não de classes concretas?
- [ ] Nenhum **usecase chama outro usecase**?
- [ ] O módulo não importa o **interior de outro módulo**?
- [ ] Nada importa de `main`?

## Application e entrada

- [ ] O controller **valida** o input com schema e checa **permissão**?
- [ ] A resposta é um **DTO**, não a entity?
- [ ] O handler valida a mensagem, faz `ack`/`nack` corretamente e é **idempotente**?
- [ ] Erros são **tipados** (domínio, não encontrado, validação) e traduzidos na borda?

## Infra e integração

- [ ] Leituras complexas estão em **Query**; escritas complexas em **Mutation**?
- [ ] Integrações externas estão atrás de um **adapter** (ACL) com contrato próprio?
- [ ] Eventos são gravados com **outbox** (mesma transação do estado)?
- [ ] Há **timeout** e política de **retry** para chamadas externas?
- [ ] Eventos públicos são **versionados** e mínimos?

## Testes

- [ ] As novas regras de domínio têm **teste unitário**?
- [ ] O usecase tem teste com **fakes em memória**?
- [ ] Os testes verificam **comportamento**, não detalhes internos?
- [ ] Os testes são **determinísticos** (sem data real, rede ou aleatoriedade)?

## Design

- [ ] Cada padrão usado resolve uma **dor nomeável**?
- [ ] Há abstração **sem segunda implementação** e sem uso em teste? (sinal de over-engineering)
- [ ] Uma decisão difícil de reverter foi registrada num **ADR**?
- [ ] Alguém novo no time entende o código em poucos minutos?

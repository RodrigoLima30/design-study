# Application Service (folder)

Um Application Service é uma classe que orquestra um processo de negócio na aplicação, coordenando entidades para reaproveitamento da lógica do negócio, muitas das vezes seguindo algum Behavior Design Pattern.

Multiplos Services podem ser usados num Orchestrator para que sua lógica contida seja reaproveitada em multiplos Use Cases. Pode ser usado também diretamente pelo Use Case.

### O que um faz

Orquestra algum fluxo lógico do negócio muitas das vezes via Design Pattern;

- Coordena entities e aggregates do domínio;
- Retorna novas entidades ou entidades com validações que não cabem ao domínio;
- Aplica regras de orquestração (como fluxos condicionais, etc);
- Trata exceções e prepara os dados para os componentes superiores;
- Centraliza regras de fluxos para multiplos usecases.

### O que ele não faz

- Muitas das vezes não aplica regras que cabem ao domínio (cálculos, etc);
- Não lida diretamente com HTTP, REST, gRPC (infra e controller quem lida com isso);
- Não acessa infraestrutura (normalmente usecase quem faz essa orquestração);
- Não assume papeis do usecase, queries, mutations, repositories, etc.

### Importante

O Application Service não deve conter lógica de negócio de baixo nível — isso continua no domínio - mas necessidades do negócio que não caibam em outros componentes;

Ele coordena necessidades, não implementa regras.

---

## Exemplo

### CryptService

```ts
import type { Crypt } from "@building-blocks/data/crypt";

export class CryptService {
  constructor(private readonly crypt: Crypt) {}
  async generate(input: string) {
    const saltRounds = 10;
    const salt = await this.crypt.genSalt(saltRounds);
    const hashedPassword = await this.crypt.hash(input, salt);
    return hashedPassword;
  }
  async compare(inputPassword: string, hashedPassword: string) {
    return await this.crypt.compare(inputPassword, hashedPassword);
  }
}
```

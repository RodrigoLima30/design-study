# 8.1 · Onde coloco isto? (guia de decisão)

Use esta página como consulta rápida durante o trabalho.

## A árvore de decisão

```mermaid
flowchart TD
    Q["Tenho um código novo"] --> D1{"É só formato: tipo, enum,<br/>constante, schema, interface?"}
    D1 -->|Sim| DATA["📁 data"]
    D1 -->|Não| D2{"Fala com o mundo externo?<br/>(banco, fila, HTTP, arquivo)"}
    D2 -->|Sim| D2a{"É genérico, sem<br/>conceito de negócio?"}
    D2a -->|Sim| BB["📁 building-blocks/adapters"]
    D2a -->|Não| D2b{"Lê ou escreve dados?"}
    D2b -->|"CRUD de aggregate"| REPO["📁 infra/repositories"]
    D2b -->|"Leitura especializada"| QRY["📁 infra/queries"]
    D2b -->|"Escrita especializada"| MUT["📁 infra/mutations"]
    D2b -->|"API de parceiro"| ADP["📁 infra/adapters"]
    D2 -->|Não| D3{"É regra de negócio?"}
    D3 -->|Sim| D3a{"De quem é a regra?"}
    D3a -->|"De um valor"| VO["📁 domain/value-objects"]
    D3a -->|"De um objeto com identidade"| EN["📁 domain/entities"]
    D3a -->|"De um conjunto consistente"| AG["📁 domain/entities<br/>(aggregate root)"]
    D3a -->|"De vários objetos,<br/>sem dono natural"| DS["📁 domain/services"]
    D3 -->|Não| D4{"É orquestração?"}
    D4 -->|"Uma ação de negócio"| UC["📁 application/usecases"]
    D4 -->|"Sequência reutilizável"| OR["📁 application/orchestrators"]
    D4 -->|"Pequena necessidade reutilizável"| AS["📁 application/services"]
    D4 -->|Não| D5{"É entrada?"}
    D5 -->|"HTTP"| CT["📁 application/controllers<br/>+ presentation/http"]
    D5 -->|"Mensagem"| HD["📁 application/handlers<br/>+ presentation/messaging"]
    D5 -->|"Montar dependências"| MAIN["📁 main ou factories"]
```

## Perguntas rápidas

| Pergunta | Se sim |
|---|---|
| "Preciso de `await` aqui?" | **Não** é domain |
| "Isto sabe o que é um frete/pedido?" | **Não** é building-block |
| "Isto chama outro usecase?" | Extraia para Orchestrator/Service |
| "Isto tem `if` sobre o status de uma entity?" | Mova para um método da entity |
| "Isto devolve a entity para fora (HTTP)?" | Converta para DTO |
| "Isto importa de `application` dentro de `infra`?" | Erro de dependência |
| "Isto cria `new PostgresX()` dentro de um usecase?" | Injete pelo construtor |
| "Esta função vai em `utils`?" | Ache o dono (provavelmente um VO) |

## Exemplos resolvidos

| Código | Onde | Por quê |
|---|---|---|
| `export const MAX_VOLUMES = 20` | `data/constants.ts` | Constante |
| `const quoteSchema = z.object({...})` | `data/quote.ts` | Schema |
| `interface CarrierGateway { quote(...) }` | `data/gateways.ts` | Contrato |
| `class Cep` com validação e `formatado` | `domain/value-objects` | Valor com regra |
| `class Volume` com `pesoCubado()` | `domain/entities` | Identidade + comportamento |
| `class Envio` que garante "até 20 volumes" | `domain/entities` | Aggregate root |
| `class CalculadoraDeFrete` | `domain/services` | Regra entre vários objetos, sem I/O |
| `class EnvioCancelado` | `domain/events` | Fato |
| SQL de `envios` + `volumes` | `infra/repositories/postgres` | Persistência do aggregate |
| Lista de envios com dados do cliente para uma tela | `infra/queries` | Leitura especializada |
| Cliente HTTP da API dos Correios | `infra/adapters` | Integração de negócio (ACL) |
| `FetchHttpClient` | `building-blocks/adapters` | Técnico, genérico |
| `CancelarEnvioUseCase` | `application/usecases` | Uma ação de negócio |
| Rota `POST /envios/:id/cancelar` | `presentation/http` | Entrada |
| `registerShutdown()` | `main/hooks` | Ciclo de vida |

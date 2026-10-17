# 07 — Fluxo de uma requisição (juntando tudo)

> **Derivado.** Cada passo vem de um doc de camada, mas a sequência completa não está escrita em um único lugar nas fontes. Ela foi montada ligando os exemplos de Controller, Usecase, Mutation, Handler e Consumer.

## Fluxo HTTP

```mermaid
sequenceDiagram
    autonumber
    actor Cli as Cliente
    participant EP as main / entrypoint
    participant RT as presentation / router
    participant CT as application / controller
    participant UF as application / usecase factory
    participant UC as application / usecase
    participant DM as domain (entities, VOs)
    participant RP as data / contrato de repository
    participant IN as infra / implementação
    participant DB as Banco

    Cli->>EP: POST /v1/...
    EP->>RT: aponta para o router do módulo
    RT->>CT: controller.execute(input)
    CT->>CT: valida com schema (zod)
    CT->>CT: checa permissões (ability)
    CT->>UF: pede o usecase pronto
    UF-->>CT: usecase com repositories injetados
    CT->>UC: execute(payload)
    UC->>RP: verifica unicidade (findFirst)
    RP->>IN: (implementação injetada)
    IN->>DB: SELECT
    DB-->>UC: resultado
    UC->>DM: new Entity(...) valida a si mesma
    DM-->>UC: entities válidas
    UC->>RP: mutation.execute(entities)
    IN->>DB: INSERT em transação
    UC-->>CT: entidades criadas
    CT-->>Cli: toJSON() das entidades
```

### Quem faz o quê

| Passo | Camada | Responsabilidade |
|---|---|---|
| 1-2 | main | Recebe e aponta |
| 3 | presentation | Agrupa rotas por módulo |
| 4-6 | application (controller) | Valida entrada, permissões, monta o usecase |
| 7-8 | application (factory) | Composição de dependências |
| 9-13 | application (usecase) + infra | Regra de aplicação e leitura |
| 14-15 | **domain** | Regras de negócio: entidades que se validam |
| 16-17 | application + infra | Persistência atômica |
| 18 | application (controller) | Serializa a resposta |

O ponto central: **as regras de negócio (14-15) acontecem no domínio**, sem saber que existe HTTP ou banco.

## Fluxo de mensageria

```mermaid
sequenceDiagram
    autonumber
    participant BR as Broker (Kafka / RabbitMQ)
    participant AD as building-blocks / adapter
    participant CS as presentation / consumer
    participant HD as application / handler
    participant UC as application / usecase
    participant DM as domain

    Note over CS,AD: boot (main/entrypoints) chama freightConsumer()
    CS->>AD: connect() e consume("freight-status-updated", handler)
    BR->>AD: mensagem
    AD->>HD: handle(message, ack, nack)
    HD->>HD: valida o formato
    HD->>UC: execute(freightId, newStatus)
    UC->>DM: aplica regras
    alt sucesso
        HD->>AD: ack()
    else erro
        HD->>AD: nack(false)
    end
```

## Quem monta tudo? O `main`

```mermaid
flowchart TB
    BOOT["main/boot.ts"] --> ENV["lê configuração"]
    BOOT --> RF["escolhe a RepositoryFactory<br/>(memória ou banco)"]
    RF --> UF["UseCaseFactory(repositoryFactory)"]
    UF --> CF["ControllerFactory(useCaseFactory)"]
    CF --> RT["Router usa o controller"]
    BOOT --> SRV["sobe o servidor"]
```

Nos **testes**, o equivalente do `main` monta tudo com `MemoryRepositoryFactory`, sem banco e sem servidor. Esse é o "teste de memória" que o doc de visão geral cita.

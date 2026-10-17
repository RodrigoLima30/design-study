# 4.1 · Estilos arquiteturais: Layered, Hexagonal, Onion, Clean e Vertical Slices

## Problema

"Qual arquitetura usar?" vira discussão de time porque os nomes são muitos. Na prática, **os estilos modernos concordam no essencial** e diferem em vocabulário e ênfase.

## 1. Layered (camadas tradicionais)

```mermaid
flowchart TB
    P["Presentation"] --> B["Business"] --> D["Data Access"] --> DB[("Banco")]
```

- **Ideia:** cada camada só fala com a de baixo.
- **Problema:** o negócio **depende** do acesso a dados. Trocar o banco ou testar sem ele é difícil.

## 2. Hexagonal / Ports and Adapters (Alistair Cockburn, 2005)

```mermaid
flowchart LR
    subgraph IN["Adapters de entrada (driving)"]
        HTTP["HTTP"]
        CLI["CLI"]
        Q["Consumer de fila"]
    end
    subgraph CORE["Aplicação + Domínio"]
        PIN(["Porta de entrada<br/>(usecase)"])
        PCORE["Regras"]
        POUT(["Porta de saída<br/>(interface Repository)"])
    end
    subgraph OUT["Adapters de saída (driven)"]
        PG["Postgres"]
        MAIL["SMTP"]
        EXT["API externa"]
    end
    HTTP --> PIN
    CLI --> PIN
    Q --> PIN
    PIN --> PCORE --> POUT
    PG -.implementa.-> POUT
    MAIL -.implementa.-> POUT
    EXT -.implementa.-> POUT
```

- **Ideia:** o núcleo define **portas** (interfaces). O mundo externo se conecta por **adapters**.
- **Entrada (driving):** quem **chama** o sistema (HTTP, CLI, fila).
- **Saída (driven):** o que o sistema **chama** (banco, e-mail, APIs).
- **Ganho:** o mesmo núcleo serve HTTP, CLI e testes.

## 3. Onion (Jeffrey Palermo, 2008)

```mermaid
flowchart TB
    subgraph L4["Infrastructure / UI / Tests"]
        subgraph L3["Application Services"]
            subgraph L2["Domain Services"]
                L1["Domain Model"]
            end
        end
    end
```

- **Ideia:** camadas concêntricas; todas as dependências apontam para o centro.
- **Ênfase:** o modelo de domínio no centro, sem dependência de nada.

## 4. Clean Architecture (Robert C. Martin, 2012)

```mermaid
flowchart TB
    subgraph FW["Frameworks & Drivers (web, DB, UI)"]
        subgraph IA["Interface Adapters (controllers, presenters, gateways)"]
            subgraph UC["Use Cases (regras da aplicação)"]
                EN["Entities (regras corporativas)"]
            end
        end
    end
```

- **A regra de dependência:** "o código-fonte só pode apontar **para dentro**". Nada de dentro sabe o nome de algo de fora.
- **Ênfase:** usecases explícitos como camada própria.
- **Main / composition root:** a camada mais externa, que monta tudo.

## 5. Vertical Slices (Jimmy Bogard, 2018)

```mermaid
flowchart LR
    subgraph S1["Feature: Cotar frete"]
        a1["endpoint"] --> b1["handler"] --> c1["domínio"] --> d1["dados"]
    end
    subgraph S2["Feature: Contratar frete"]
        a2["endpoint"] --> b2["handler"] --> c2["domínio"] --> d2["dados"]
    end
    subgraph S3["Feature: Rastrear"]
        a3["endpoint"] --> b3["handler"] --> c3["domínio"] --> d3["dados"]
    end
```

- **Ideia:** organizar por **funcionalidade** (fatia vertical), e não por camada técnica.
- **Ganho:** tudo de uma feature junto; mudar uma feature mexe numa pasta só.
- **Risco:** duplicação entre fatias, se não houver um domínio compartilhado.

## O que todas concordam

| Princípio | Layered | Hexagonal | Onion | Clean | Slices |
|---|:-:|:-:|:-:|:-:|:-:|
| Separar regra de negócio de detalhe técnico | ✔ | ✔ | ✔ | ✔ | ✔ |
| Dependências apontam para o domínio | ✘ | ✔ | ✔ | ✔ | ~ |
| Infra trocável por interfaces | ✘ | ✔ | ✔ | ✔ | ~ |
| Usecase como conceito explícito | ✘ | ~ | ✔ | ✔ | ✔ (handler) |
| Organização por funcionalidade | ✘ | ✘ | ✘ | ✘ | ✔ |

## A combinação deste curso

> 💡 Este curso usa um modelo **híbrido**, comum em times que aplicam DDD:
> - **Módulos por bounded context** (influência de Vertical Slices e do monolito modular).
> - **Camadas dentro de cada módulo** (Onion/Clean).
> - **Portas e adapters** para todo I/O (Hexagonal).
> - **Domínio rico** no centro (DDD).

```mermaid
flowchart LR
    subgraph SYS["Sistema"]
        MAIN["main"]
        BB["building-blocks"]
        subgraph M1["modules/pricing"]
            direction TB
            a["presentation"] --> b["application"] --> c["domain"] --> d["data"]
            e["infra"] --> c
        end
        subgraph M2["modules/shipping"]
            direction TB
            a2["presentation"] --> b2["application"] --> c2["domain"] --> d2["data"]
            e2["infra"] --> c2
        end
    end
    MAIN --> M1
    MAIN --> M2
```

A próxima página detalha cada camada.

> 🏛️ **Visão de arquiteto:** essa combinação herda a complexidade de todas as que junta. Ela compensa em sistemas com regra rica, vários times e vida longa. Para um serviço pequeno, um módulo com `domain` + `infra` + um handler pode bastar. **A estrutura deve ser proporcional ao problema.**

## Para fixar

1. Qual a regra de dependência da Clean Architecture?
2. O que é uma porta "driving" e uma "driven" na Hexagonal?
3. Qual o risco principal de Vertical Slices puro?

<details>
<summary>Respostas</summary>

1. As dependências de código-fonte só apontam para dentro: camadas internas não conhecem as externas.
2. Driving: por onde o mundo chama o sistema (HTTP, CLI, fila). Driven: o que o sistema chama (banco, e-mail, APIs).
3. Duplicar regras de negócio entre fatias, por falta de um modelo de domínio compartilhado.

</details>

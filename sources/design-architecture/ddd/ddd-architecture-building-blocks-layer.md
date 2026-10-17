# Building blocks (layer)

Building Blocks são os blocos de construção reutilizáveis da aplicação.

Eles formam a fundação técnica do sistema — implementando infraestrutura, contratos e integrações genéricas, que não pertencem a nenhum domínio específico (como frete, pagamento, usuário, etc).

Eles servem como a base compartilhada para todos os módulos do projeto.

### Propósito

- Desacoplar o core do sistema da infraestrutura;
- Padronizar o uso de recursos técnicos (mensageria, HTTP, logs, cache...);
- Evitar duplicações (um único adapter de HTTP, por exemplo);
- Tornar as dependências externas intercambiáveis;
- Fornecer dependências técnicas para módulos do domínio.

### Benefícios

| Benefício          | Por quê?                                                           |
| ------------------ | ------------------------------------------------------------------ |
| Reuso              | Um único adapter ou factory pode ser usado em todos os módulos     |
| Centralização      | Todas as decisões técnicas estão em um só lugar                    |
| Baixo acoplamento  | Domínios não sabem qual lib está sendo usada                       |
| Alta testabilidade | Fácil de mockar contratos como HttpClient, Publisher, etc          |
| Portabilidade      | Trocar infraestrutura (Kafka ↔ RabbitMQ) sem reescrever o sistema |
| Escalabilidade     | Adiciona novas integrações mantendo padrão de arquitetura          |

### Quando usar

- Coloque aqui tudo que for:
- Reutilizável entre múltiplos domínios;
- Independente de negócio (ex: não sabe o que é frete, pagamento, etc);
- Infraestrutural, técnico ou de suporte.

### Resumo

- building-blocks é a fundação técnica da sua aplicação;
- Organiza infraestrutura, contratos genéricos, utilitários e factories;
- Fortalece os princípios arquiteturais, como abstração de detalhes e separação de responsabilidades;
- Permite que o domínio da sua aplicação foque apenas no negócio, e não na tecnologia.

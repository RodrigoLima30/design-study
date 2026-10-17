# Padrão de nomenclaturas

Para manter consistência e legibilidade no código, seguimos os seguintes padrões de nomenclatura:

📌 Variáveis, funções, schemas: camelCase
Exemplo: userName, getUserById, userSchema

📌 Enums, constantes: capslock
Exemplo: ENV, WEBHOOK_EVENT, PEGAKI_STATE_CODE, ANDROID_ID, REDIS_PREFIX

📁 Arquivos: kebab-case
Os nomes dos arquivos devem seguir este padrão, sempre indicando o que é e qual o seu contexto.

Exemplo: create-user-controller.ts, user-mongo-repository.ts

🏷️ Classes, Types, Interfaces, Decorators: PascalCase
Todo tipo nomeado deve usar PascalCase, facilitando a identificação de entidades importantes no projeto.

Exemplo: FreightCalculationService, UserProps, UserRole

📨 Tipagens em Controllers: Request e Response
Utilize Request e Response para tipagens em namespace de controllers, indicando entrada e saída de dados de rotas.

Exemplo: CreateUserController.Request, CreateUserController.Response

⚙️ Tipagens em UseCases, Services, Orchestrators, etc: Input e Output
Para casos de uso, serviços e orquestradores, as tipagens devem seguir o padrão Input e Output, separando responsabilidades e melhorando a clareza de dados internos.

Exemplo: CreateUserUseCase.Input, CreateUserUseCase.Output

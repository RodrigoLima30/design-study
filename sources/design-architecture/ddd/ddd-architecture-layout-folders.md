# Folders

A estrutura de pastas foi desenhada para refletir uma organização funcional e escalável do sistema, com foco na clareza de papéis, na separação de responsabilidades dentro dos módulos e organizadas por famílias de código.

Cada pasta representa uma peça fundamental da modelagem, orquestração ou interação com recursos externos, favorecendo coesão interna e independência entre partes.

`entities` `value-objects` `services`

A modelagem de negócio é representada por conceitos como os acima, que expressam as regras e estruturas centrais do sistema.

`factories` `helpers`

Dão suporte à criação e reutilização de comportamentos de baixo nível, mantendo o domínio limpo e expressivo.

`adapters` `repositories` `queries` `mutations`

A interação com o mundo externo é tratada pelas pastas acima, permitindo que drivers e tecnologias específicas sejam isolados e facilmente substituíveis.

`controllers` `entrypoints` `routers`

Organizam como as funcionalidades são expostas, garantindo consistência em permissões, contexto e rotas.

`application` `services` `orchestrators`

Essas pastas ajudam a compor fluxos de negócio mais complexos sem acoplar a lógica diretamente aos detalhes de infraestrutura.

`usecases`

Encapsulam os cenários de uso específicos, sendo a principal interface entre a intenção do sistema e sua execução. Ele quem orquestra as regras do negócio por caso de uso.

`building-blocks` `modules` `shared`

Por fim, a pasta esta pasta centraliza recursos arquiteturais reutilizáveis entre modules, enquanto o diretório shared abriga elementos comuns que não se encaixam em uma responsabilidade específica, promovendo reaproveitamento sem violar o isolamento dos contextos.

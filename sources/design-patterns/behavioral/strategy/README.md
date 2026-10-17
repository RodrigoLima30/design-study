# Strategy

## Contexto

Tínhamos um problema para resolver: calcular valor de um carro estacionado com base no local de estacionamento.

Conforme o cálculo sendo diferente de um estacionamento na praia, aeroporto ou shopping, a regra fica cada vez maior.

Por isso, criamos uma inversão de dependência via `TicketCalculator.ts` que, com ele, conseguimos aplicar dois conceitos:
_Dependency Inversion_ e _Single Responsability Principle_.

No final, temos aplicado o _Strategy_ via cada estacionamento com sua regra de cálculo, calculando o valor pelo local.

Com esse exemplo, entendemos que é bem-vindo aplicar esse padrão quando temos uma distribuição de responsabilidades, ou seja, Beach, Airport e Shopping Ticket Calculator, deve calcular o valor do _ticket_, mas cada um possui em resultado ou retorno específico de acordo com a sua regra.

Então é isso. Temos agora este exemplo de aplicação do _Strategy_.

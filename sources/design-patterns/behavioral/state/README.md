# State

State é um _pattern_ usado quando o comportamento de um objeto muda, dependendo do seu estado.

Usando o exemplo de semáforo, como ficaria? Pensa comigo:

- Quando verde, não pode exibir vermelho, mas sim o amarelo como próximo sinal;
- O amarelo, não pode exibir o verde, apenas o vermelho como próximo sinal;
- E após o vermelho, vem o verde. Não podendo ser o amarelo.

Então é fácil lembrar que temos 3 cores no semáforo e que existe uma regra sobre exibir a próxima cor.

Sendo assim, o `State` permite que um objeto altere seu comportamento de acordo com o estado interno que se encontra em um dado momento.

# CQRS

CQRS é um _pattern_ ou também estilo arquitetural que significa Command Query Responsibility Segregation, criado por [Greg Young](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf).

Já conversamos sobre `Command` que vem para abstrair implementações e intenções armazenando os dados para uma execução
futura.

`Query` fala por si só, mas o interessante é quando falamos também de _Segregation_.

Então, `Segregation` é quando separamos _queries_ de **consulta** com as de **gravação**, seguindo assim o princípio: Command Query Separation, de [Bertrand Meyer](https://en.wikipedia.org/wiki/Bertrand_Meyer).

Um detalhe interessante de compartilhar é que ao executar um _Command_ que modifica os dados, não deve retorna um resultado, enquanto manusear uma _Query_ que retorna um dado, não deve modificar. Ou apenas altera, ou apenas retorna.

Quando então devemos aplicar `CQRS`?

É mais indicado para domínios complexos, ou mesmo podendo tornar-se complexos a curto prazo.

Agora, domínios simples por outro lado, acrescenta complexidade aumentando os riscos do projeto.

Então, tome cuidado. É sempre válido analisar muito bem antes de seguir com a implementação.

O mais importante é entender a ideia de separação via _Segregation_. A implementação, pode ser feita de várias formas ou outros _patterns_:

- Manual que seria sua própria implementação ou de certa forma simples, mas também via;
- `Event Sourcing` ou `Command Handler`, que são outros _patterns_ bem legais que se encaixam muito bem ao CQRS.

Veja este exemplo:

Em relação ao saldo de uma conta bancária, o que podemos fazer:

- Ver o saldo, que seria uma consulta;
- Creditar e Debitar valor que seria uma gravação.

Vamos ver como ficaria isso em conjunto com Command Handler?

## Referências

- http://martinfowler.com/bliki/CQRS.html
- https://lostechies.com/gabrielschenker/2015/04/07/cqrs-revisited/
- http://elemarjr.com/pt/2016/04/11/uma-breve-revisao-de-cqrs/

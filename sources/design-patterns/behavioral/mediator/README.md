# Mediator

Define um objeto que encapsula a forma como um conjunto de objetos interagem.

O Mediator fornece acoplamento ao evitar que um objeto se refere um aos outros de forma explícita, permitindo variar
suas interações de maneira independente.

Ele está no meio entre múltiplos objetos fazendo com que eles se comuniquem via um ponto central.

No final vou falar sobre a diferença entre `Command`, `Mediator` e qual a relação entre eles e o próximo _pattern_.

Qual a diferença entre o `Command`?

- `Command` é quando eu tenho uma abstração de uma solicitação por meio de um objeto com motivo de poder executar depois;
  - Exemplo: Possa deslogar, possa desfazer, possa refazer.
- E `Command`, é: 1 para muitos. Posso ter múltiplas `Label` observando alteração do valor de um `InputText`, por exemplo;
- `Mediator` é um objeto que centraliza a comunicação entre múltiplos objetos reduzindo assim o seu acoplamento.

Esses dois padrões estão na base do que entendemos como arquitetura voltada a eventos. Sabe qual por exemplo? **CQRS**! Iremos falar dele.

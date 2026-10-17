# Design Patterns - Behavioral - Command

Um padrão comportamental que encapsula solicitações como objetos, permitindo parametrizar clientes, enfileirar solicitações, registrar logs e suportar operações reversíveis (undo).

### Resumo

O padrão Command é ideal para cenários onde solicitações desconhecidas são enviadas a objetos desconhecidos, exigindo flexibilidade e expansibilidade. Um exemplo prático é um aplicativo de controle de dispositivos inteligentes (IoT) em uma casa com:

- Lâmpada da Sala: Liga/desliga;
- Lâmpada do Quarto: Liga/desliga;
- Ar-condicionado: Liga/desliga e ajusta temperatura.

O objetivo é centralizar o controle no aplicativo, permitindo comandos pré-configurados e expansibilidade para novos dispositivos. O padrão sugere criar objetos de comando que:

- Encapsulam ações;
- Conhecem o receptor;
- Possuem métodos executar() e, opcionalmente, desfazer().

### Estrutura do padrão

O fluxo de execução envolve:

- Cliente: Cria o comando e define o receptor;
- Comando: Define ações e receptor, com método executar();
- Invocador: Intermediário que armazena e executa comandos via setComando() e executar();
- Receptor: Executa as ações (ex.: métodos ligar() ou desligar()).

Comandos Concretos

- LigarLampada e DesligarLampada: Controlam lâmpadas.
- LigarArCondicionado, DesligarArCondicionado, MudarTemperaturaArCondicionado: Controlam o ar-condicionado.

```ts
class Lampada {
  private identificacao: string;
  private estado: boolean;
  constructor(identificacao: string, estado: boolean) {
    this.estado = estado;
    this.identificacao = identificacao;
  }
  ligar(): void {
    this.estado = true;
  }
  desligar(): void {
    this.estado = false;
  }
  getIdentificacao(): string {
    return this.identificacao;
  }
  getEstado(): boolean {
    return this.estado;
  }
  imprimeObjeto(): void {
    let identificacao = `O objeto ${this.identificacao} está ${this.estado ? "Ligado" : "Desligado"}.<br>`;
    console.log(identificacao);
  }
}

class LigarLampada implements Command {
  private lampada: Lampada;
  constructor(lampada: Lampada) {
    this.lampada = lampada;
  }
  executar(): void {
    this.lampada.ligar();
    this.lampada.imprimeObjeto();
  }
  desfazer(): void {
    this.lampada.desligar();
    this.lampada.imprimeObjeto();
  }
}

class DesligarLampada implements Command {
  private lampada: Lampada;
  constructor(lampada: Lampada) {
    this.lampada = lampada;
  }
  executar(): void {
    this.lampada.desligar();
    this.lampada.imprimeObjeto();
  }
  desfazer(): void {
    this.lampada.ligar();
    this.lampada.imprimeObjeto();
  }
}

class Aplicativo {
  private comandos: Command[] = [];
  setComando(comando: Command): number {
    this.comandos.push(comando);
    return this.comandos.length - 1;
  }
  aoPrecionarBotao(id: number): void {
    this.comandos[id].executar();
  }
  duploCliqueBotao(id: number): void {
    this.comandos[id].desfazer();
  }
  getComando(id: number): Command {
    return this.comandos[id];
  }
}

class ArCondicionado {
  private identificacao: string;
  private estado: boolean;
  private temperatura: number;
  constructor(identificacao: string, estado: boolean, temperatura: number) {
    this.estado = estado;
    this.identificacao = identificacao;
    this.temperatura = temperatura;
  }
  ligar(): void {
    this.estado = true;
  }
  desligar(): void {
    this.estado = false;
  }
  setTemperatura(temperatura: number): void {
    this.temperatura = temperatura;
  }
  getIdentificacao(): string {
    return this.identificacao;
  }
  getEstado(): boolean {
    return this.estado;
  }
  getTemperatura(): number {
    return this.temperatura;
  }
  imprimeObjeto(): void {
    let identificacao = `O objeto ${this.identificacao} está ${this.estado ? "Ligado" : "Desligado"}`;
    identificacao += this.estado
      ? ` a ${this.temperatura} graus celsius.`
      : ".";
    console.log(identificacao + "<br>");
  }
}

class LigarArCondicionado implements Command {
  private arCondicionado: ArCondicionado;
  constructor(arCondicionado: ArCondicionado) {
    this.arCondicionado = arCondicionado;
  }
  executar(): void {
    this.arCondicionado.ligar();
    this.arCondicionado.imprimeObjeto();
  }
  desfazer(): void {
    this.arCondicionado.desligar();
    this.arCondicionado.imprimeObjeto();
  }
}

class DesligarArCondicionado implements Command {
  private arCondicionado: ArCondicionado;
  constructor(arCondicionado: ArCondicionado) {
    this.arCondicionado = arCondicionado;
  }
  executar(): void {
    this.arCondicionado.desligar();
    this.arCondicionado.imprimeObjeto();
  }
  desfazer(): void {
    this.arCondicionado.ligar();
    this.arCondicionado.imprimeObjeto();
  }
}

class MudarTemperaturaArCondicionado implements Command {
  private arCondicionado: ArCondicionado;
  private temperatura: number;
  private temperaturaAnterior: number;
  constructor(arCondicionado: ArCondicionado) {
    this.arCondicionado = arCondicionado;
    this.temperatura = arCondicionado.getTemperatura();
    this.temperaturaAnterior = this.temperatura;
  }
  setTemperatura(temperatura: number): void {
    this.temperaturaAnterior = this.temperatura;
    this.temperatura = temperatura;
  }
  executar(): void {
    this.arCondicionado.setTemperatura(this.temperatura);
    this.arCondicionado.imprimeObjeto();
  }
  desfazer(): void {
    this.arCondicionado.setTemperatura(this.temperaturaAnterior);
    this.arCondicionado.imprimeObjeto();
  }
}
```

Testando...

```ts
const lampadaSala = new Lampada("Lâmpada da Sala", false);
const lampadaQuarto = new Lampada("Lâmpada do Quarto", false);
const arCondicionado = new ArCondicionado("Ar-Condicionado", false, 26);
const aplicativo = new Aplicativo();

const ligarLampadaSala = new LigarLampada(lampadaSala);
const desligarLampadaSala = new DesligarLampada(lampadaSala);
const ligarLampadaQuarto = new LigarLampada(lampadaQuarto);
const desligarLampadaQuarto = new DesligarLampada(lampadaQuarto);
const ligarAr = new LigarArCondicionado(arCondicionado);
const desligarAr = new DesligarArCondicionado(arCondicionado);
const mudarTemperaturaAr = new MudarTemperaturaArCondicionado(arCondicionado);

const idLigarLampadaSala = aplicativo.setComando(ligarLampadaSala);
const idDesligarLampadaSala = aplicativo.setComando(desligarLampadaSala);
const idLigarLampadaQuarto = aplicativo.setComando(ligarLampadaQuarto);
const idDesligarLampadaQuarto = aplicativo.setComando(desligarLampadaQuarto);
const idLigarAr = aplicativo.setComando(ligarAr);
const idDesligarAr = aplicativo.setComando(desligarAr);
const idMudarTemperaturaAr = aplicativo.setComando(mudarTemperaturaAr);

aplicativo.aoPrecionarBotao(idLigarLampadaSala);
aplicativo.aoPrecionarBotao(idDesligarLampadaSala);
aplicativo.aoPrecionarBotao(idLigarLampadaQuarto);
aplicativo.aoPrecionarBotao(idDesligarLampadaQuarto);
aplicativo.aoPrecionarBotao(idLigarAr);
aplicativo.getComando(idMudarTemperaturaAr).setTemperatura(25);
aplicativo.aoPrecionarBotao(idMudarTemperaturaAr);
aplicativo.aoPrecionarBotao(idDesligarAr);

console.log("<br>### Desfazer Comandos ###<br><26");
aplicativo.duploCliqueBotao(idDesligarAr);
aplicativo.duploCliqueBotao(idMudarTemperaturaAr);
aplicativo.duploCliqueBotao(idLigarAr);
aplicativo.duploCliqueBotao(idDesligarLampadaQuarto);
```

Saída:

```
O objeto Lâmpada da Sala está Ligado.
O objeto Lâmpada da Sala está Desligado.
O objeto Lâmpada do Quarto está Ligado.
O objeto Lâmpada do Quarto está Desligado.
O objeto Ar-Condicionado está Ligado a 26 graus celsius.
O objeto Ar-Condicionado está Ligado a 25 graus celsius.
O objeto Ar-Condicionado está Desligado.
### Desfazer Comandos ###
O objeto Ar-Condicionado está Ligado a 25 graus celsius.
O objeto Ar-Condicionado está Ligado a 26 graus celsius.
O objeto Ar-Condicionado está Desligado.
O objeto Lâmpada do Quarto está Ligado.
```

### Aplicabilidade

O padrão é útil quando:

- Parametrizar ações (substitui callbacks);
- Enfileirar/executar solicitações em tempos diferentes;
- Suportar operações de desfazer;
- Registrar mudanças (logging) para recuperação de falhas;
- Modelar transações de alto nível.

### Componentes

- Cliente: Cria comandos;
- Invocador: Gerencia comandos;
- Command: Interface com execute() e undo();
- ComandoConcreto: Implementa ações;
- Receptor: Executa ações.

### Consequências

- Comandos são objetos manipuláveis/extensíveis;
- Suporta composição de comandos;
- Facilita adição de novos comandos;
- Suporta desfazer;
- Pode aumentar complexidade por camadas adicionais.

### Conclusão

O padrão Command, ilustrado pelo controle de dispositivos IoT, encapsula solicitações como objetos, promovendo flexibilidade, expansibilidade e reversibilidade. A implementação demonstra como criar comandos para ligar/desligar lâmpadas e ar-condicionado, com suporte a desfazer ações, centralizados em um aplicativo invocador.
# Design Patterns - Behavioral - Command

Um padrão comportamental que encapsula solicitações como objetos, permitindo parametrizar clientes, enfileirar solicitações, registrar logs e suportar operações reversíveis (undo).

### Resumo

O padrão Command é ideal para cenários onde solicitações desconhecidas são enviadas a objetos desconhecidos, exigindo flexibilidade e expansibilidade. Um exemplo prático é um aplicativo de controle de dispositivos inteligentes (IoT) em uma casa com:

- Lâmpada da Sala: Liga/desliga;
- Lâmpada do Quarto: Liga/desliga;
- Ar-condicionado: Liga/desliga e ajusta temperatura.

O objetivo é centralizar o controle no aplicativo, permitindo comandos pré-configurados e expansibilidade para novos dispositivos. O padrão sugere criar objetos de comando que:

- Encapsulam ações;
- Conhecem o receptor;
- Possuem métodos executar() e, opcionalmente, desfazer().

### Estrutura do padrão

O fluxo de execução envolve:

- Cliente: Cria o comando e define o receptor;
- Comando: Define ações e receptor, com método executar();
- Invocador: Intermediário que armazena e executa comandos via setComando() e executar();
- Receptor: Executa as ações (ex.: métodos ligar() ou desligar()).

Comandos Concretos

- LigarLampada e DesligarLampada: Controlam lâmpadas.
- LigarArCondicionado, DesligarArCondicionado, MudarTemperaturaArCondicionado: Controlam o ar-condicionado.

```ts
class Lampada {
  private identificacao: string;
  private estado: boolean;
  constructor(identificacao: string, estado: boolean) {
    this.estado = estado;
    this.identificacao = identificacao;
  }
  ligar(): void {
    this.estado = true;
  }
  desligar(): void {
    this.estado = false;
  }
  getIdentificacao(): string {
    return this.identificacao;
  }
  getEstado(): boolean {
    return this.estado;
  }
  imprimeObjeto(): void {
    let identificacao = `O objeto ${this.identificacao} está ${this.estado ? "Ligado" : "Desligado"}.<br>`;
    console.log(identificacao);
  }
}

class LigarLampada implements Command {
  private lampada: Lampada;
  constructor(lampada: Lampada) {
    this.lampada = lampada;
  }
  executar(): void {
    this.lampada.ligar();
    this.lampada.imprimeObjeto();
  }
  desfazer(): void {
    this.lampada.desligar();
    this.lampada.imprimeObjeto();
  }
}

class DesligarLampada implements Command {
  private lampada: Lampada;
  constructor(lampada: Lampada) {
    this.lampada = lampada;
  }
  executar(): void {
    this.lampada.desligar();
    this.lampada.imprimeObjeto();
  }
  desfazer(): void {
    this.lampada.ligar();
    this.lampada.imprimeObjeto();
  }
}

class Aplicativo {
  private comandos: Command[] = [];
  setComando(comando: Command): number {
    this.comandos.push(comando);
    return this.comandos.length - 1;
  }
  aoPrecionarBotao(id: number): void {
    this.comandos[id].executar();
  }
  duploCliqueBotao(id: number): void {
    this.comandos[id].desfazer();
  }
  getComando(id: number): Command {
    return this.comandos[id];
  }
}

class ArCondicionado {
  private identificacao: string;
  private estado: boolean;
  private temperatura: number;
  constructor(identificacao: string, estado: boolean, temperatura: number) {
    this.estado = estado;
    this.identificacao = identificacao;
    this.temperatura = temperatura;
  }
  ligar(): void {
    this.estado = true;
  }
  desligar(): void {
    this.estado = false;
  }
  setTemperatura(temperatura: number): void {
    this.temperatura = temperatura;
  }
  getIdentificacao(): string {
    return this.identificacao;
  }
  getEstado(): boolean {
    return this.estado;
  }
  getTemperatura(): number {
    return this.temperatura;
  }
  imprimeObjeto(): void {
    let identificacao = `O objeto ${this.identificacao} está ${this.estado ? "Ligado" : "Desligado"}`;
    identificacao += this.estado
      ? ` a ${this.temperatura} graus celsius.`
      : ".";
    console.log(identificacao + "<br>");
  }
}

class LigarArCondicionado implements Command {
  private arCondicionado: ArCondicionado;
  constructor(arCondicionado: ArCondicionado) {
    this.arCondicionado = arCondicionado;
  }
  executar(): void {
    this.arCondicionado.ligar();
    this.arCondicionado.imprimeObjeto();
  }
  desfazer(): void {
    this.arCondicionado.desligar();
    this.arCondicionado.imprimeObjeto();
  }
}

class DesligarArCondicionado implements Command {
  private arCondicionado: ArCondicionado;
  constructor(arCondicionado: ArCondicionado) {
    this.arCondicionado = arCondicionado;
  }
  executar(): void {
    this.arCondicionado.desligar();
    this.arCondicionado.imprimeObjeto();
  }
  desfazer(): void {
    this.arCondicionado.ligar();
    this.arCondicionado.imprimeObjeto();
  }
}

class MudarTemperaturaArCondicionado implements Command {
  private arCondicionado: ArCondicionado;
  private temperatura: number;
  private temperaturaAnterior: number;
  constructor(arCondicionado: ArCondicionado) {
    this.arCondicionado = arCondicionado;
    this.temperatura = arCondicionado.getTemperatura();
    this.temperaturaAnterior = this.temperatura;
  }
  setTemperatura(temperatura: number): void {
    this.temperaturaAnterior = this.temperatura;
    this.temperatura = temperatura;
  }
  executar(): void {
    this.arCondicionado.setTemperatura(this.temperatura);
    this.arCondicionado.imprimeObjeto();
  }
  desfazer(): void {
    this.arCondicionado.setTemperatura(this.temperaturaAnterior);
    this.arCondicionado.imprimeObjeto();
  }
}
```

Testando...

```ts
const lampadaSala = new Lampada("Lâmpada da Sala", false);
const lampadaQuarto = new Lampada("Lâmpada do Quarto", false);
const arCondicionado = new ArCondicionado("Ar-Condicionado", false, 26);
const aplicativo = new Aplicativo();

const ligarLampadaSala = new LigarLampada(lampadaSala);
const desligarLampadaSala = new DesligarLampada(lampadaSala);
const ligarLampadaQuarto = new LigarLampada(lampadaQuarto);
const desligarLampadaQuarto = new DesligarLampada(lampadaQuarto);
const ligarAr = new LigarArCondicionado(arCondicionado);
const desligarAr = new DesligarArCondicionado(arCondicionado);
const mudarTemperaturaAr = new MudarTemperaturaArCondicionado(arCondicionado);

const idLigarLampadaSala = aplicativo.setComando(ligarLampadaSala);
const idDesligarLampadaSala = aplicativo.setComando(desligarLampadaSala);
const idLigarLampadaQuarto = aplicativo.setComando(ligarLampadaQuarto);
const idDesligarLampadaQuarto = aplicativo.setComando(desligarLampadaQuarto);
const idLigarAr = aplicativo.setComando(ligarAr);
const idDesligarAr = aplicativo.setComando(desligarAr);
const idMudarTemperaturaAr = aplicativo.setComando(mudarTemperaturaAr);

aplicativo.aoPrecionarBotao(idLigarLampadaSala);
aplicativo.aoPrecionarBotao(idDesligarLampadaSala);
aplicativo.aoPrecionarBotao(idLigarLampadaQuarto);
aplicativo.aoPrecionarBotao(idDesligarLampadaQuarto);
aplicativo.aoPrecionarBotao(idLigarAr);
aplicativo.getComando(idMudarTemperaturaAr).setTemperatura(25);
aplicativo.aoPrecionarBotao(idMudarTemperaturaAr);
aplicativo.aoPrecionarBotao(idDesligarAr);

console.log("<br>### Desfazer Comandos ###<br><26");
aplicativo.duploCliqueBotao(idDesligarAr);
aplicativo.duploCliqueBotao(idMudarTemperaturaAr);
aplicativo.duploCliqueBotao(idLigarAr);
aplicativo.duploCliqueBotao(idDesligarLampadaQuarto);
```

Saída:

```
O objeto Lâmpada da Sala está Ligado.
O objeto Lâmpada da Sala está Desligado.
O objeto Lâmpada do Quarto está Ligado.
O objeto Lâmpada do Quarto está Desligado.
O objeto Ar-Condicionado está Ligado a 26 graus celsius.
O objeto Ar-Condicionado está Ligado a 25 graus celsius.
O objeto Ar-Condicionado está Desligado.
### Desfazer Comandos ###
O objeto Ar-Condicionado está Ligado a 25 graus celsius.
O objeto Ar-Condicionado está Ligado a 26 graus celsius.
O objeto Ar-Condicionado está Desligado.
O objeto Lâmpada do Quarto está Ligado.
```

### Aplicabilidade

O padrão é útil quando:

- Parametrizar ações (substitui callbacks);
- Enfileirar/executar solicitações em tempos diferentes;
- Suportar operações de desfazer;
- Registrar mudanças (logging) para recuperação de falhas;
- Modelar transações de alto nível.

### Componentes

- Cliente: Cria comandos;
- Invocador: Gerencia comandos;
- Command: Interface com execute() e undo();
- ComandoConcreto: Implementa ações;
- Receptor: Executa ações.

### Consequências

- Comandos são objetos manipuláveis/extensíveis;
- Suporta composição de comandos;
- Facilita adição de novos comandos;
- Suporta desfazer;
- Pode aumentar complexidade por camadas adicionais.

### Conclusão

O padrão Command, ilustrado pelo controle de dispositivos IoT, encapsula solicitações como objetos, promovendo flexibilidade, expansibilidade e reversibilidade. A implementação demonstra como criar comandos para ligar/desligar lâmpadas e ar-condicionado, com suporte a desfazer ações, centralizados em um aplicativo invocador.

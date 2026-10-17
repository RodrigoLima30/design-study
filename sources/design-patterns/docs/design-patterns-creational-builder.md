# Design Patterns - Creational - Builder

Separa a construção de objetos complexos de sua representação, permitindo diferentes configurações com o mesmo processo.

Usa como exemplo a classe GeradorPDF, com muitos atributos, cuja instanciação é complexa.

Inicialmente, a construção direta exige muitos parâmetros, dificultando o uso. Para resolver, o construtor é removido, e métodos setters configuram o objeto, mas isso ainda sobrecarrega o cliente.

Então, são introduzidas as classes BuilderA4 e BuilderA3, que encapsulam a criação de objetos GeradorPDF para formatos A4 e A3, respectivamente.

Para maior flexibilidade, uma interface BuilderInterfaceGeradorPDF define métodos de configuração (página, margens, cabeçalho, rodapé), permitindo chamadas seletivas.

Finalmente, a classe GeradorPDFDirector é criada para controlar o processo, oferecendo métodos predefinidos para diferentes configurações (com ou sem cabeçalho/rodapé).

O padrão melhora a modularidade, isola a lógica de construção e permite controle fino sobre o processo, criando representações variadas do objeto.

## Exemplo

```ts
class GeradorPDF {
  private pageOrientation: string = "portrait";
  private unit: string = "mm";
  private pageSizeX: number = 210;
  private pageSizeY: number = 297;
  private marginTop: number = 30;
  private marginRight: number = 20;
  private marginBottom: number = 30;
  private marginLeft: number = 20;
  private hasHeader: boolean = false;
  private headerHeight: number = 0;
  private hasFooter: boolean = false;
  private footerHeight: number = 0;
  private pageColor: string = "#ffffff";
  private encode: string = "UTF-8";
  getPageOrientation(): string {
    return this.pageOrientation;
  }
  setPageOrientation(pageOrientation: string): void {
    this.pageOrientation = pageOrientation;
  }
  getUnit(): string {
    return this.unit;
  }
  setUnit(unit: string): void {
    this.unit = unit;
  }
  getPageSizeX(): number {
    return this.pageSizeX;
  }
  setPageSizeX(pageSizeX: number): void {
    this.pageSizeX = pageSizeX;
  }
  getPageSizeY(): number {
    return this.pageSizeY;
  }
  setPageSizeY(pageSizeY: number): void {
    this.pageSizeY = pageSizeY;
  }
  getMarginTop(): number {
    return this.marginTop;
  }
  setMarginTop(marginTop: number): void {
    this.marginTop = marginTop;
  }
  getMarginRight(): number {
    return this.marginRight;
  }
  setMarginRight(marginRight: number): void {
    this.marginRight = marginRight;
  }
  getMarginBottom(): number {
    return this.marginBottom;
  }
  setMarginBottom(marginBottom: number): void {
    this.marginBottom = marginBottom;
  }
  getMarginLeft(): number {
    return this.marginLeft;
  }
  setMarginLeft(marginLeft: number): void {
    this.marginLeft = marginLeft;
  }
  getHasHeader(): boolean {
    return this.hasHeader;
  }
  setHasHeader(hasHeader: boolean): void {
    this.hasHeader = hasHeader;
  }
  getHeaderHeight(): number {
    return this.headerHeight;
  }
  setHeaderHeight(headerHeight: number): void {
    this.headerHeight = headerHeight;
  }
  getHasFooter(): boolean {
    return this.hasFooter;
  }
  setHasFooter(hasFooter: boolean): void {
    this.hasFooter = hasFooter;
  }
  getFooterHeight(): number {
    return this.footerHeight;
  }
  setFooterHeight(footerHeight: number): void {
    this.footerHeight = footerHeight;
  }
  getPageColor(): string {
    return this.pageColor;
  }
  setPageColor(pageColor: string): void {
    this.pageColor = pageColor;
  }
  getEncode(): string {
    return this.encode;
  }
  setEncode(encode: string): void {
    this.encode = encode;
  }
  toString(): string {
    let output = "";
    output += `pageOrientation: ${this.getPageOrientation()}<br>`;
    output += `unit: ${this.getUnit()}<br>`;
    output += `pageSizeX: ${this.getPageSizeX()}mm<br>`;
    output += `pageSizeY: ${this.getPageSizeY()}mm<br>`;
    output += `marginTop: ${this.getMarginTop()}mm<br>`;
    output += `marginRight: ${this.getMarginRight()}mm<br>`;
    output += `marginBottom: ${this.getMarginBottom()}mm<br>`;
    output += `marginLeft: ${this.getMarginLeft()}mm<br>`;
    output += `hasHeader: ${this.getHasHeader() ? "Sim" : "Não"}<br>`;
    output += `headerHeight: ${this.getHeaderHeight()}mm<br>`;
    output += `hasFooter: ${this.getHasFooter() ? "Sim" : "Não"}<br>`;
    output += `footerHeight: ${this.getFooterHeight()}mm<br>`;
    output += `pageColor: ${this.getPageColor()}<br>`;
    output += `encode: ${this.getEncode()}<br>`;
    return output;
  }
}

interface BuilderInterfaceGeradorPDF {
  getGeradorPDF(): GeradorPDF;
  setPageConfiguration(): void;
  setMargin(): void;
  setHeader(): void;
  setFooter(): void;
}

class BuilderA4 implements BuilderInterfaceGeradorPDF {
  private geradorPDF: GeradorPDF;

  constructor() {
    this.geradorPDF = new GeradorPDF();
  }

  getGeradorPDF(): GeradorPDF {
    return this.geradorPDF;
  }

  setPageConfiguration(): void {
    this.geradorPDF.setPageOrientation("portrait");
    this.geradorPDF.setUnit("mm");
    this.geradorPDF.setPageSizeX(210);
    this.geradorPDF.setPageSizeY(297);
    this.geradorPDF.setPageColor("#ffffff");
    this.geradorPDF.setEncode("UTF-8");
  }

  setMargin(): void {
    this.geradorPDF.setMarginTop(30);
    this.geradorPDF.setMarginRight(20);
    this.geradorPDF.setMarginBottom(30);
    this.geradorPDF.setMarginLeft(20);
  }

  setHeader(): void {
    this.geradorPDF.setHasHeader(true);
    this.geradorPDF.setHeaderHeight(15);
  }

  setFooter(): void {
    this.geradorPDF.setHasFooter(true);
    this.geradorPDF.setFooterHeight(15);
  }
}

class BuilderA3 implements BuilderInterfaceGeradorPDF {
  private geradorPDF: GeradorPDF;

  constructor() {
    this.geradorPDF = new GeradorPDF();
  }

  getGeradorPDF(): GeradorPDF {
    return this.geradorPDF;
  }

  setPageConfiguration(): void {
    this.geradorPDF.setPageOrientation("portrait");
    this.geradorPDF.setUnit("mm");
    this.geradorPDF.setPageSizeX(297);
    this.geradorPDF.setPageSizeY(420);
    this.geradorPDF.setPageColor("#ffffff");
    this.geradorPDF.setEncode("UTF-8");
  }

  setMargin(): void {
    this.geradorPDF.setMarginTop(60);
    this.geradorPDF.setMarginRight(40);
    this.geradorPDF.setMarginBottom(60);
    this.geradorPDF.setMarginLeft(40);
  }

  setHeader(): void {
    this.geradorPDF.setHasHeader(false);
    this.geradorPDF.setHeaderHeight(0);
  }

  setFooter(): void {
    this.geradorPDF.setHasFooter(false);
    this.geradorPDF.setFooterHeight(0);
  }
}

class GeradorPDFDirector {
  private builderGeradorPDF: BuilderInterfaceGeradorPDF;

  constructor(builderGeradorPDF: BuilderInterfaceGeradorPDF) {
    this.builderGeradorPDF = builderGeradorPDF;
  }

  setBuilderGeradorPDF(builderGeradorPDF: BuilderInterfaceGeradorPDF): void {
    this.builderGeradorPDF = builderGeradorPDF;
  }

  criarGeradorPDF(): void {
    this.builderGeradorPDF.setPageConfiguration();
    this.builderGeradorPDF.setMargin();
    this.builderGeradorPDF.setHeader();
    this.builderGeradorPDF.setFooter();
  }

  criarGeradorPDFNoHeader(): void {
    this.builderGeradorPDF.setPageConfiguration();
    this.builderGeradorPDF.setMargin();
    this.builderGeradorPDF.setFooter();
  }

  criarGeradorPDFNoHeaderNoFooter(): void {
    this.builderGeradorPDF.setPageConfiguration();
    this.builderGeradorPDF.setMargin();
  }
}

console.log("## Creating A4 object ##<br>");
const builderA4 = new BuilderA4();
const director = new GeradorPDFDirector(builderA4);
director.criarGeradorPDF();
const pdfA4 = builderA4.getGeradorPDF();
console.log(pdfA4.toString());

console.log("<br>## Creating A3 object ##<br>");
const builderA3 = new BuilderA3();
director.setBuilderGeradorPDF(builderA3);
director.criarGeradorPDF();
const pdfA3 = builderA3.getGeradorPDF();
console.log(pdfA3.toString());

console.log("<br>## Creating A4 object without header ##<br>");
const builderA4NoHeader = new BuilderA4();
const directorNoHeader = new GeradorPDFDirector(builderA4NoHeader);
directorNoHeader.criarGeradorPDFNoHeader();
const pdfA4NoHeader = builderA4NoHeader.getGeradorPDF();
console.log(pdfA4NoHeader.toString());
```

Saída:

```ts
## Creating A4 object ##<br>
pageOrientation: portrait<br>
unit: mm<br>
pageSizeX: 210mm<br>
pageSizeY: 297mm<br>
marginTop: 30mm<br>
marginRight: 20mm<br>
marginBottom: 30mm<br>
marginLeft: 20mm<br>
hasHeader: Sim<br>
headerHeight: 15mm<br>
hasFooter: Sim<br>
footerHeight: 15mm<br>
pageColor: #ffffff<br>
encode: UTF-8<br>

## Creating A3 object ##<br>
pageOrientation: portrait<br>
unit: mm<br>
pageSizeX: 297mm<br>
pageSizeY: 420mm<br>
marginTop: 60mm<br>
marginRight: 40mm<br>
marginBottom: 60mm<br>
marginLeft: 40mm<br>
hasHeader: Não<br>
headerHeight: 0mm<br>
hasFooter: Não<br>
footerHeight: 0mm<br>
pageColor: #ffffff<br>
encode: UTF-8<br>

## Creating A4 object without header ##<br>
pageOrientation: portrait<br>
unit: mm<br>
pageSizeX: 210mm<br>
pageSizeY: 297mm<br>
marginTop: 30mm<br>
marginRight: 20mm<br>
marginBottom: 30mm<br>
marginLeft: 20mm<br>
hasHeader: Não<br>
headerHeight: 0mm<br>
hasFooter: Sim<br>
footerHeight: 15mm<br>
pageColor: #ffffff<br>
encode: UTF-8<br>
```

### Aplicabilidade

- Quando o algoritmo de criação deve ser independente das partes do objeto;
- Quando o processo de construção deve suportar diferentes representações.

### Componentes

- Builder: Interface abstrata para criar partes do produto;
- BuilderConcreto: Implementa a interface, construindo e retornando o produto;
- Diretor: Controla o processo de construção usando a interface Builder;
- Produto: Objeto complexo resultante.

### Consequências

- Permite variar a representação interna do produto;
- Isola construção e representação, encapsulando a lógica nos Builders;
- Oferece controle detalhado sobre o processo de construção.

# Design Patterns - Structural - Facade

Fornece uma interface unificada e simplificada para um subsistema complexo, reduzindo o acoplamento entre o cliente e as classes do subsistema. Ele é útil para:

- Simplificar a interface: Oferece uma interface de alto nível que facilita o uso de subsistemas complexos, especialmente quando evoluem e se tornam mais intrincados;
- Desacoplar clientes do subsistema: Reduz dependências entre clientes e classes do subsistema, promovendo independência e portabilidade;
- Estruturar camadas: Define pontos de entrada para níveis de subsistemas, simplificando dependências entre eles.

## Exemplo

No exemplo do subsistema de vendas, o cliente inicialmente precisava interagir diretamente com as classes Consumidor, Produto, Pedido, Pagamento (abstrata, com subclasses PagamentoCredito e PagamentoBoleto) e EmailPedido, criando forte acoplamento.

Com a introdução da classe VendaFacade, o processo foi simplificado: o cliente apenas instancia a facade, adiciona produtos e escolhe o método de pagamento (boleto ou crédito), enquanto a facade gerencia as interações com o subsistema, reduzindo a complexidade e facilitando a manutenção.

```ts
class Customer {
  constructor(
    public name: string,
    public document: string,
    public email: string,
  ) {}
}

class Product {
  constructor(
    public name: string,
    public description: string,
    public price: number,
  ) {}
}

class Order {
  private products: Product[] = [];
  constructor(private customer: Customer) {}
  setCustomer(customer: Customer): void {
    this.customer = customer;
  }
  addProduct(product: Product): void {
    this.products.push(product);
  }
}

class OrderEmail {
  constructor(private order: Order) {}
  sendEmail(message: string): void {
    console.log(`Email sent to ${this.order["customer"].email}: ${message}`);
  }
}

abstract class Payment {
  constructor(protected oorder: Order) {}
  abstract processPayment(): boolean;
}

class BoletoPayment extends Payment {
  processPayment(): boolean {
    return true;
  }
}

class CreditPayment extends Payment {
  processPayment(): boolean {
    return true;
  }
}

class SalesFacade {
  private order: Order;
  private payment: Payment | null = null;
  private email: OrderEmail;
  constructor(customer: Customer) {
    this.order = new Order(customer);
    this.order.setCustomer(customer);
    this.email = new OrderEmail(this.order);
  }
  addProduct(product: Product): void {
    this.order.addProduct(product);
  }
  processCreditPayment(): void {
    this.payment = new CreditPayment(this.order);
    if (this.payment.processPayment()) {
      this.email.sendEmail("Payment successfully processed via credit");
    } else {
      this.email.sendEmail("Payment failed via credit");
    }
  }
  processBoletoPayment(): void {
    this.payment = new BoletoPayment(this.order);
    if (this.payment.processPayment()) {
      this.email.sendEmail("Payment successfully processed via boleto");
    } else {
      this.email.sendEmail("Payment failed via boleto");
    }
  }
}

const customer = new Customer("Luiz da Silva", "12345678910", "luiz@email.com");
const product1 = new Product("Pink Blouse", "Female pink blouse", 80.99);
const product2 = new Product("Black T-shirt", "Male black t-shirt", 49.98);
const product3 = new Product("Jeans", "Male jeans", 119.9);

const salesFacade = new SalesFacade(customer);
salesFacade.addProduct(product1);
salesFacade.addProduct(product2);
salesFacade.addProduct(product3);
salesFacade.processBoletoPayment();
```

Saída:

```
Email enviado para luiz@email.com
Mensagem: Pagamento realizado com sucesso via boleto
```

Com a criação da classe VendaFacade o diagrama passa a ficar como o abaixo.

### Componentes

- Cliente: Utiliza a interface simplificada fornecida pela Facade;
- Facade: Classe que delega solicitações do cliente às classes apropriadas do subsistema;
- Subsistema: Contém as implementações das funcionalidades, sem conhecimento da Facade.

### Consequências

- Reduz a complexidade ao diminuir o número de objetos com os quais o cliente interage;
- Promove fraco acoplamento, permitindo alterações no subsistema sem impactar os clientes;
- Não impede o acesso direto ao subsistema, oferecendo flexibilidade para clientes que precisam de mais controle.

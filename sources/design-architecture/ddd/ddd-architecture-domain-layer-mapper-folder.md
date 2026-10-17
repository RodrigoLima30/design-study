# Mapper (folder)

Um Mapper é um componente de software responsável por transformar dados de uma estrutura ou formato de origem para outro, ajustando nomes, tipos e valores de acordo com um modelo de destino pré-definido.

Ele atua como uma ponte entre a representação original da informação e a forma estruturada necessária para uso posterior, garantindo consistência e integridade nos dados transformados.

## Exemplo

```ts
import { FreightContentDeclarationProps } from "@superfrete/transport-providers-data";
import { limitDescriptionDeclaredValue } from "../helpers";
export function contentDeclarationMapper(
  contentDeclaration?:
    | FreightContentDeclarationProps[]
    | Record<string, FreightContentDeclarationProps>,
): {
  description: string;
  quantity: number;
  amount: number;
} {
  if (!contentDeclaration) {
    throw new Error("Content Declaration is missing");
  }
  let contentArray: FreightContentDeclarationProps[] = [];
  if (Array.isArray(contentDeclaration)) {
    contentArray = contentDeclaration;
  } else {
    contentArray = Object.keys(contentDeclaration).map(
      (key) => contentDeclaration[key],
    );
  }
  return contentArray.reduce(
    (newObjectContent, item, index) => {
      const itemQuantity = parseInt(item.quantity.toString(), 10);
      const itemValue = item.value;
      if (index === 0) {
        newObjectContent.description = limitDescriptionDeclaredValue(
          item.description,
        );
        newObjectContent.quantity = itemQuantity;
        newObjectContent.amount = itemValue * itemQuantity;
      } else {
        newObjectContent.quantity += itemQuantity;
        newObjectContent.amount += itemValue * itemQuantity;
      }
      return newObjectContent;
    },
    { description: "description package", quantity: 1, amount: 0 },
  );
}
```

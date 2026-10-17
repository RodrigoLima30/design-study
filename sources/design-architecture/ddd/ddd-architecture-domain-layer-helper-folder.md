# Helper (folder)

Helpers são funções utilitárias que encapsulam pequenas operações reutilizáveis, geralmente focadas em uma única tarefa específica.

Elas têm como objetivo simplificar o código, evitar repetição e manter a lógica principal mais limpa, centralizando comportamentos comuns e especialmente unitários em um único lugar.

## Exemplo

```ts
import { DescriptionLimits } from "../../data/description-limit";

export function limitDescriptionDeclaredValue(description: string): string {
  if (description.length > DescriptionLimits.MAXIMUM_ALLOWED) {
    return description.slice(0, DescriptionLimits.MAXIMUM_ALLOWED);
  }
  return description;
}
```

# Domain Service (folder)

Domain Services são componentes responsáveis por executar ações ou coordenar processos que envolvem mais de uma Entity ou regras que não se encaixam em Value Objects.

Eles ajudam a manter o domínio limpo e expressivo, separando comportamentos de dados.

Contém processamento reusável de dados de baixo nível, sem interação com mundo externo.

### Características

Representam regras de negócio puras que não pertencem a uma única entidade;

São stateless (sem estado interno) e operam com objetos do domínio;

Em alguns casos, servem para expressar Behavioral Design Patterns.

## Exemplos

### FreightCalculationService

```ts
import type { DistanceCalculationStrategy } from "@module/freight/data/services";

// Implementações concretas
class HaversineDistanceStrategy implements DistanceCalculationStrategy {
  calculate(origin: Address, destination: Address): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(
      destination.coordinates.latitude - origin.coordinates.latitude,
    );
    const dLon = this.toRad(
      destination.coordinates.longitude - origin.coordinates.longitude,
    );
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(origin.coordinates.latitude)) *
        Math.cos(this.toRad(destination.coordinates.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

class GoogleMapsDistanceStrategy implements DistanceCalculationStrategy {
  constructor(private readonly apiKey: string) {}
  async calculate(origin: Address, destination: Address): Promise<number> {
    // Implementação usando Google Maps Distance Matrix API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.coordinates.latitude},${origin.coordinates.longitude}&destinations=${destination.coordinates.latitude},${destination.coordinates.longitude}&key=${this.apiKey}`,
    );
    const data = await response.json();
    return data.rows[0].elements[0].distance.value / 1000; // Converte para km
  }
}

// Serviço principal
class FreightCalculationService {
  constructor(
    private readonly distanceStrategy: DistanceCalculationStrategy,
    private readonly pricePerKm: number = 2.5,
  ) {}
  public calculateFreight(
    origin: Address,
    destination: Address,
    weight: Weight,
  ): FreightCalculationResult {
    const distance = this.distanceStrategy.calculate(origin, destination);
    const basePrice = distance * this.pricePerKm;
    const weightFactor = this.calculateWeightFactor(weight);
    return {
      distance,
      basePrice,
      finalPrice: basePrice * weightFactor,
      estimatedTime: this.calculateEstimatedTime(distance),
    };
  }
  private calculateWeightFactor(weight: Weight): number {
    const weightInKg =
      weight.unit === "ton" ? weight.value * 1000 : weight.value;
    return weightInKg <= 100 ? 1 : 1 + (weightInKg - 100) * 0.01;
  }
  private calculateEstimatedTime(distance: number): number {
    const averageSpeed = 60; // km/h
    return distance / averageSpeed;
  }
}

// Uso
const service = new FreightCalculationService(
  new HaversineDistanceStrategy(),
  2.5, // R$ 2,50 por km
);

const result = service.calculateFreight(origin, destination, {
  value: 500,
  unit: "kg",
});
```

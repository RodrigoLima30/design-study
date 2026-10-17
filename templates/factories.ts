// Abstract Factory: famílias de componentes trocáveis (memória x banco).
import type { EventPublisher, ThingRepository } from '../data/thing'
import { ActivateThingUseCase } from '../application/usecases/activate-thing'
import { ThingMemoryRepository } from '../infra/repositories/memory/thing-memory-repository'

// modules/<module>/data/factories.ts — o contrato da família
export interface ThingRepositoryFactory {
  thing(): ThingRepository
}

// modules/<module>/infra/factories/memory.ts — família de teste
export class ThingMemoryRepositoryFactory implements ThingRepositoryFactory {
  private readonly things = new ThingMemoryRepository() // mesma instância entre chamadas
  thing() {
    return this.things
  }
}

// modules/<module>/infra/factories/database.ts — família de produção (esboço)
// export class ThingDatabaseRepositoryFactory implements ThingRepositoryFactory {
//   constructor(private readonly orm: Orm) {}
//   thing() { return new ThingPostgresRepository(this.orm) }
// }

// modules/<module>/application/factories/usecases.ts — monta usecases prontos
export class ThingUseCaseFactory {
  constructor(
    private readonly repositories: ThingRepositoryFactory,
    private readonly events: EventPublisher,
  ) {}

  activate() {
    return new ActivateThingUseCase(this.repositories.thing(), this.events)
  }
}

// main/app.ts — composition root
// const usecases = new ThingUseCaseFactory(new ThingDatabaseRepositoryFactory(orm), new OutboxPublisher(orm))

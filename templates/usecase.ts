// modules/<module>/application/usecases/activate-thing.ts
// Usecase: uma ação de negócio. Carrega → chama o domínio → persiste → publica → devolve.
// Regras: depende só de contratos; não chama outro usecase; recebe now/ids de fora.
import type { EventPublisher, ThingRepository } from '../../data/thing'
import type { Thing } from '../../domain/entities/thing'

export class NotFoundError extends Error {} // mova para shared/errors.ts

export namespace ActivateThingUseCase {
  export type Input = { thingId: string }
  export type Output = Thing
}

export class ActivateThingUseCase {
  constructor(
    private readonly things: ThingRepository,
    private readonly events: EventPublisher,
  ) {}

  async execute(input: ActivateThingUseCase.Input, now: Date): Promise<ActivateThingUseCase.Output> {
    // 1. carrega
    const thing = await this.things.findById(input.thingId)
    // 2. regras de aplicação (exigem I/O)
    if (!thing) throw new NotFoundError(`Thing ${input.thingId} not found`)
    // 3. domínio decide
    thing.activate(now)
    // 4. persiste (em produção: estado + outbox na mesma transação)
    await this.things.save(thing)
    // 5. publica
    await this.events.publish(thing.pullEvents())
    // 6. devolve
    return thing
  }
}

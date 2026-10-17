// modules/<module>/domain/events/
// Domain Event: fato no passado, imutável, com o mínimo necessário para quem reage.

export interface DomainEvent {
  readonly name: string
  readonly aggregateId: string
  readonly occurredAt: Date
}

export class ThingActivated implements DomainEvent {
  readonly name = 'thing.activated'

  constructor(
    readonly aggregateId: string,
    readonly occurredAt: Date,
  ) {
    Object.freeze(this)
  }
}

export class ThingArchived implements DomainEvent {
  readonly name = 'thing.archived'

  constructor(
    readonly aggregateId: string,
    readonly reason: string,
    readonly occurredAt: Date,
  ) {
    Object.freeze(this)
  }
}

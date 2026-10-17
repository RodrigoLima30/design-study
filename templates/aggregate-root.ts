// modules/<module>/domain/entities/thing.ts
// Aggregate Root: identidade, invariantes, métodos de intenção, eventos registrados.
import { thingSchema, type ThingProps, type ThingStatus } from '../../data/thing'
import { type DomainEvent, ThingActivated, ThingArchived } from '../events/thing-events'

export class DomainError extends Error {} // mova para shared/errors.ts

export class Thing {
  #data: ThingProps
  #events: DomainEvent[] = []

  private constructor(data: ThingProps) {
    this.#data = thingSchema.parse(data) // nasce válido
  }

  // nascimento: aplica regras de criação (e pode registrar eventos)
  static create(input: { id: string; name: string; now: Date }) {
    return new Thing({ id: input.id, name: input.name, status: 'DRAFT', createdAt: input.now, updatedAt: input.now })
  }

  // reidratação: só remonta o estado salvo, sem eventos
  static restore(data: ThingProps) {
    return new Thing(data)
  }

  get id() { return this.#data.id }
  get name() { return this.#data.name }
  get status(): ThingStatus { return this.#data.status }

  // métodos de intenção (linguagem ubíqua), nunca setters
  rename(name: string, now: Date) {
    this.assertNot('ARCHIVED', 'rename')
    this.#data = thingSchema.parse({ ...this.#data, name, updatedAt: now })
  }

  activate(now: Date) {
    if (this.#data.status === 'ACTIVE') return // idempotente
    this.assertNot('ARCHIVED', 'activate')
    this.#data = { ...this.#data, status: 'ACTIVE', updatedAt: now }
    this.#events.push(new ThingActivated(this.id, now))
  }

  archive(reason: string, now: Date) {
    if (this.#data.status === 'ARCHIVED') return
    this.#data = { ...this.#data, status: 'ARCHIVED', updatedAt: now }
    this.#events.push(new ThingArchived(this.id, reason, now))
  }

  pullEvents(): DomainEvent[] {
    const events = this.#events
    this.#events = []
    return events
  }

  equals(other: Thing) { return this.id === other.id }

  toJSON(): Readonly<ThingProps> { return this.#data }

  private assertNot(status: ThingStatus, action: string) {
    if (this.#data.status === status) throw new DomainError(`Cannot ${action} a thing that is ${status}`)
  }
}

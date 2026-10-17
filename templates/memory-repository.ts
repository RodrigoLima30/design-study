// modules/<module>/infra/repositories/memory/thing-memory-repository.ts
// Fake: implementação funcional e simples do contrato, para testes e protótipos.
import type { EventPublisher, ThingProps, ThingRepository } from '../../../data/thing'
import { Thing } from '../../../domain/entities/thing'

export class ThingMemoryRepository implements ThingRepository {
  private readonly rows = new Map<string, ThingProps>()

  async findById(id: string) {
    const row = this.rows.get(id)
    return row ? Thing.restore(row) : null // instância nova a cada leitura, como um banco
  }

  async save(thing: Thing) {
    this.rows.set(thing.id, structuredClone(thing.toJSON())) // guarda snapshot, não a referência
  }

  // auxiliar de teste
  get size() {
    return this.rows.size
  }
}

export class InMemoryEventPublisher implements EventPublisher {
  readonly published: { name: string }[] = []

  async publish(events: readonly { name: string }[]) {
    this.published.push(...events)
  }
}

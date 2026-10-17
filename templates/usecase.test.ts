// Teste de usecase com fakes em memória: rápido, determinístico, testa comportamento.
import { describe, expect, test } from 'bun:test' // ou 'vitest'

import { ActivateThingUseCase, NotFoundError } from '../application/usecases/activate-thing'
import { Thing } from '../domain/entities/thing'
import { InMemoryEventPublisher, ThingMemoryRepository } from '../infra/repositories/memory/thing-memory-repository'

describe('ActivateThingUseCase', () => {
  const now = new Date('2026-01-15T10:00:00Z') // determinístico

  const setup = async () => {
    const things = new ThingMemoryRepository()
    const events = new InMemoryEventPublisher()
    await things.save(Thing.create({ id: '0b8f9a3e-3f43-4f0a-9d5b-4c1e2a7b6d10', name: 'Thing', now }))
    return { things, events, usecase: new ActivateThingUseCase(things, events) }
  }

  test('activates the thing and persists it', async () => {
    const { things, usecase } = await setup()

    await usecase.execute({ thingId: '0b8f9a3e-3f43-4f0a-9d5b-4c1e2a7b6d10' }, now)

    const saved = await things.findById('0b8f9a3e-3f43-4f0a-9d5b-4c1e2a7b6d10')
    expect(saved?.status).toBe('ACTIVE')
  })

  test('publishes ThingActivated', async () => {
    const { events, usecase } = await setup()

    await usecase.execute({ thingId: '0b8f9a3e-3f43-4f0a-9d5b-4c1e2a7b6d10' }, now)

    expect(events.published.map((e) => e.name)).toEqual(['thing.activated'])
  })

  test('is idempotent', async () => {
    const { events, usecase } = await setup()
    const input = { thingId: '0b8f9a3e-3f43-4f0a-9d5b-4c1e2a7b6d10' }

    await usecase.execute(input, now)
    await usecase.execute(input, now)

    expect(events.published).toHaveLength(1)
  })

  test('fails when the thing does not exist', async () => {
    const { usecase } = await setup()

    await expect(usecase.execute({ thingId: 'missing' }, now)).rejects.toBeInstanceOf(NotFoundError)
  })
})

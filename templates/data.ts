// modules/<module>/data/thing.ts
// Camada data: só tipos, constantes, schemas e contratos. Nenhuma lógica de processamento.
import { z } from 'zod'

import type { Thing } from '../domain/entities/thing'

export const THING_STATUS = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const
export type ThingStatus = (typeof THING_STATUS)[number]

export const THING_NAME_MAX_LENGTH = 120

export const thingSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(THING_NAME_MAX_LENGTH),
  status: z.enum(THING_STATUS),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type ThingProps = z.infer<typeof thingSchema>

// Contrato do repository: implementado na infra
export interface ThingRepository {
  findById(id: string): Promise<Thing | null>
  save(thing: Thing): Promise<void>
}

// Contrato de publicação de eventos
export interface EventPublisher {
  publish(events: readonly { name: string }[]): Promise<void>
}

// modules/<module>/application/handlers/thing-approved.ts
// Handler: valida a mensagem, chama o usecase, faz ack/nack. Deve ser idempotente.
import { z } from 'zod'

import type { ThingUseCaseFactory } from '../factories/usecases'

export type Ack = () => void
export type Nack = (requeue: boolean) => void

const thingApprovedSchema = z.object({
  messageId: z.string().min(1),
  thingId: z.string().uuid(),
})

export class TransientError extends Error {} // ex.: timeout, banco indisponível

export class ThingApprovedHandler {
  constructor(private readonly usecases: ThingUseCaseFactory) {}

  async handle(message: unknown, ack: Ack, nack: Nack): Promise<void> {
    const parsed = thingApprovedSchema.safeParse(message)
    if (!parsed.success) {
      nack(false) // formato inválido: tentar de novo não resolve → DLQ
      return
    }

    try {
      // o usecase (ou o repositório) garante idempotência pelo messageId
      await this.usecases.activate().execute({ thingId: parsed.data.thingId }, new Date())
      ack()
    } catch (error) {
      nack(error instanceof TransientError) // temporário: reenfileira; o resto: DLQ
    }
  }
}

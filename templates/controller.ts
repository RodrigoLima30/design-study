// modules/<module>/application/controllers/activate-thing.ts
// Controller: valida a entrada, checa permissão, chama o usecase, devolve DTO. Sem regra de negócio.
import { z } from 'zod'

import type { ThingUseCaseFactory } from '../factories/usecases'

const activateThingSchema = z.object({ thingId: z.string().uuid() })

export interface AuthContext {
  assertCan(action: string, subject: string): void
}

export namespace ActivateThingController {
  export type Request = z.input<typeof activateThingSchema>
  export type Response = { thing: { id: string; name: string; status: string } }
}

export class ActivateThingController {
  constructor(
    private readonly ctx: AuthContext,
    private readonly usecases: ThingUseCaseFactory,
  ) {}

  async execute(request: ActivateThingController.Request, now = new Date()): Promise<ActivateThingController.Response> {
    const input = activateThingSchema.parse(request) // 400 se inválido (traduzido na borda)
    this.ctx.assertCan('activate', 'Thing')        // 403 se sem permissão
    const thing = await this.usecases.activate().execute(input, now)
    return { thing: { id: thing.id, name: thing.name, status: thing.status } } // DTO, não a entity
  }
}

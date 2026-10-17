// modules/<module>/domain/value-objects/thing-code.ts
// Value Object: sem identidade, imutável, igual pelo valor, auto-validado.
import { z } from 'zod'

const thingCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}-\d{4}$/, 'Invalid thing code') // mova o schema para data/ se for reutilizado

export class ThingCode {
  readonly #value: string

  constructor(input: string) {
    this.#value = thingCodeSchema.parse(input) // lança se inválido: nunca existe um ThingCode inválido
  }

  get value() {
    return this.#value
  }

  // comportamento do conceito
  get prefix() {
    return this.#value.slice(0, 3)
  }

  equals(other: ThingCode) {
    return this.#value === other.value
  }

  toJSON() {
    return this.#value
  }

  toString() {
    return this.#value
  }
}

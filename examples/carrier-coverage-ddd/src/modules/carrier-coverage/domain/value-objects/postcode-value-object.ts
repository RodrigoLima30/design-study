import { postcodeSchema } from '../../data/postcode-data'

export class Postcode {
	readonly #value: string

	// Numbers are accepted by the type but rejected by the schema: a leading zero would be lost
	constructor(payload?: string | number | null) {
		this.#value = postcodeSchema.parse(payload)
	}

	get value() {
		return this.#value
	}

	// Always 8 digits, so comparing strings is the same as comparing numbers
	isBefore(other: Postcode) {
		return this.#value < other.value
	}

	isAfter(other: Postcode) {
		return this.#value > other.value
	}

	isEqual(other: Postcode) {
		return this.#value === other.value
	}

	toJSON() {
		return this.#value
	}
}

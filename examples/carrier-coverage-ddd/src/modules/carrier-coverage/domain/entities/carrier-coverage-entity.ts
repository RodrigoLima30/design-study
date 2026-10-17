import type { Postcode } from '../value-objects/postcode-value-object'
import type { CoverageRange } from './coverage-range-entity'

// Aggregate root: the only way in to the list of ranges
export class CarrierCoverage {
	readonly #ranges: CoverageRange[] = []

	constructor(ranges: CoverageRange[]) {
		if (ranges.length === 0) {
			throw new Error('CarrierCoverage: at least one range is required')
		}
		for (const range of ranges) this.addRange(range)
	}

	addRange(range: CoverageRange) {
		if (this.#ranges.some((item) => item.overlaps(range))) {
			throw new Error(`CarrierCoverage: range ${range.id} overlaps an existing range`)
		}
		this.#ranges.push(range)
	}

	covers(postcode: Postcode) {
		return this.#ranges.some((range) => range.contains(postcode))
	}

	get ranges(): readonly CoverageRange[] {
		return [...this.#ranges]
	}

	toJSON() {
		return this.#ranges.map((range) => range.toJSON())
	}
}

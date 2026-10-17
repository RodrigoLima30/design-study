import type { Postcode } from '../value-objects/postcode-value-object'

export class CoverageRange {
	constructor(
		readonly start: Postcode,
		readonly end: Postcode,
	) {
		if (start.isAfter(end)) {
			throw new Error('CoverageRange: start must not be after end')
		}
	}

	get id() {
		return `${this.start.value}|${this.end.value}`
	}

	contains(postcode: Postcode) {
		return !postcode.isBefore(this.start) && !postcode.isAfter(this.end)
	}

	overlaps(other: CoverageRange) {
		return !this.end.isBefore(other.start) && !other.end.isBefore(this.start)
	}

	toJSON() {
		return { start: this.start.value, end: this.end.value }
	}
}

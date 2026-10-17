import type { CoverageRangeRow } from '../../data/postcode-data'
import { CoverageRange } from '../entities/coverage-range-entity'
import { Postcode } from '../value-objects/postcode-value-object'

export const coverageRangeMapper = {
	toEntity: (row: CoverageRangeRow) =>
		new CoverageRange(new Postcode(row.start), new Postcode(row.end)),
	toDto: (range: CoverageRange): CoverageRangeRow => ({
		start: range.start.value,
		end: range.end.value,
	}),
}

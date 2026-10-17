import type { CoverageRangeRow } from '../../data/postcode-data'
import { CarrierCoverage } from '../entities/carrier-coverage-entity'
import { coverageRangeMapper } from '../mappers/coverage-range-mapper'

export class CarrierCoverageFactory {
	static fromRaw(rows: CoverageRangeRow[]) {
		return new CarrierCoverage(rows.map(coverageRangeMapper.toEntity))
	}
}

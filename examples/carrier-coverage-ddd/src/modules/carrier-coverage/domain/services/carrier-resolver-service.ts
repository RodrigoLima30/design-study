import type { CarrierCoverage } from '../entities/carrier-coverage-entity'
import type { Postcode } from '../value-objects/postcode-value-object'

// Domain service: stateless, no persistence. Whoever loads the coverages is infra.
export class CarrierResolverService {
	resolve(postcode: Postcode, coverages: ReadonlyMap<string, CarrierCoverage>) {
		return [...coverages]
			.filter(([, coverage]) => coverage.covers(postcode))
			.map(([carrierId]) => carrierId)
	}
}

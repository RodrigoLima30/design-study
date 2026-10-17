import { describe, expect, test } from 'bun:test'
import { CarrierCoverageFactory } from '../factories/carrier-coverage-factory'
import { Postcode } from '../value-objects/postcode-value-object'
import { CarrierResolverService } from './carrier-resolver-service'

describe('CarrierResolverService', () => {
	const coverages = new Map([
		['carrier-sp', CarrierCoverageFactory.fromRaw([{ start: '01000-000', end: '05999-999' }])],
		['carrier-go', CarrierCoverageFactory.fromRaw([{ start: '74000-000', end: '76999-999' }])],
		['carrier-all', CarrierCoverageFactory.fromRaw([{ start: '01000-000', end: '99999-999' }])],
	])
	const sut = new CarrierResolverService()

	test('returns every carrier that covers the postcode', () => {
		expect(sut.resolve(new Postcode('75570-000'), coverages)).toEqual(['carrier-go', 'carrier-all'])
		expect(sut.resolve(new Postcode('01310-100'), coverages)).toEqual(['carrier-sp', 'carrier-all'])
	})

	test('returns an empty list when nobody covers it', () => {
		expect(sut.resolve(new Postcode('00500-000'), coverages)).toEqual([])
	})
})

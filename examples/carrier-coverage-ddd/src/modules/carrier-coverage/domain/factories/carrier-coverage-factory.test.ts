import { describe, expect, test } from 'bun:test'
import { coverageRangeMapper } from '../mappers/coverage-range-mapper'
import { Postcode } from '../value-objects/postcode-value-object'
import { CarrierCoverageFactory } from './carrier-coverage-factory'

describe('CarrierCoverageFactory', () => {
	test('builds the aggregate from raw rows', () => {
		const sut = CarrierCoverageFactory.fromRaw([
			{ start: '01000-000', end: '01999-999' },
			{ start: '75000000', end: '75999999' },
		])

		expect(sut.covers(new Postcode('75570-000'))).toBe(true)
		expect(sut.toJSON()).toEqual([
			{ start: '01000000', end: '01999999' },
			{ start: '75000000', end: '75999999' },
		])
	})

	test('propagates invalid rows as errors', () => {
		expect(() => CarrierCoverageFactory.fromRaw([{ start: '123', end: '01999-999' }])).toThrow()
		expect(() => CarrierCoverageFactory.fromRaw([])).toThrow('at least one range')
		expect(() =>
			CarrierCoverageFactory.fromRaw([
				{ start: '01000-000', end: '01999-999' },
				{ start: '01500-000', end: '02000-000' },
			]),
		).toThrow('overlaps')
	})
})

describe('coverageRangeMapper', () => {
	test('round-trips between row and entity', () => {
		const row = { start: '01000000', end: '01999999' }

		expect(coverageRangeMapper.toDto(coverageRangeMapper.toEntity(row))).toEqual(row)
	})
})

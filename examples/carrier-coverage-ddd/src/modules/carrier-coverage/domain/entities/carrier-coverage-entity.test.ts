import { describe, expect, test } from 'bun:test'
import { Postcode } from '../value-objects/postcode-value-object'
import { CarrierCoverage } from './carrier-coverage-entity'
import { CoverageRange } from './coverage-range-entity'

const range = (start: string, end: string) => new CoverageRange(new Postcode(start), new Postcode(end))

describe('CarrierCoverage', () => {
	test('requires at least one range', () => {
		expect(() => new CarrierCoverage([])).toThrow('at least one range')
	})

	test('rejects an overlapping range on construction', () => {
		expect(() => new CarrierCoverage([range('01000-000', '01999-999'), range('01500-000', '02000-000')])).toThrow(
			'overlaps',
		)
	})

	test('rejects an overlapping range on addRange', () => {
		const sut = new CarrierCoverage([range('01000-000', '01999-999')])

		expect(() => sut.addRange(range('01500-000', '02000-000'))).toThrow('overlaps')
		expect(() => sut.addRange(range('01000-000', '01999-999'))).toThrow('overlaps')
		expect(sut.ranges).toHaveLength(1)
	})

	test('accepts adjacent ranges that do not overlap', () => {
		const sut = new CarrierCoverage([range('01000-000', '01999-999')])

		sut.addRange(range('02000-000', '02999-999'))

		expect(sut.ranges).toHaveLength(2)
	})

	test('covers a postcode in the middle of a range, not only on the edges', () => {
		const sut = new CarrierCoverage([range('01000-000', '01999-999'), range('75000-000', '75999-999')])

		expect(sut.covers(new Postcode('01500-000'))).toBe(true)
		expect(sut.covers(new Postcode('75570-000'))).toBe(true)
		expect(sut.covers(new Postcode('01000-000'))).toBe(true)
		expect(sut.covers(new Postcode('01999-999'))).toBe(true)
	})

	test('does not cover a postcode outside every range', () => {
		const sut = new CarrierCoverage([range('01000-000', '01999-999')])

		expect(sut.covers(new Postcode('02000-000'))).toBe(false)
	})

	test('cannot be changed from the outside through ranges', () => {
		const sut = new CarrierCoverage([range('01000-000', '01999-999')])

		;(sut.ranges as CoverageRange[]).push(range('02000-000', '02999-999'))

		expect(sut.ranges).toHaveLength(1)
	})
})

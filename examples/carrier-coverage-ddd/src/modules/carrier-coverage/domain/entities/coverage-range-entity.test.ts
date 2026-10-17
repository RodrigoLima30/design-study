import { describe, expect, test } from 'bun:test'
import { Postcode } from '../value-objects/postcode-value-object'
import { CoverageRange } from './coverage-range-entity'

const range = (start: string, end: string) => new CoverageRange(new Postcode(start), new Postcode(end))

describe('CoverageRange', () => {
	test('rejects start after end', () => {
		expect(() => range('75570-001', '75570-000')).toThrow('start must not be after end')
	})

	test('accepts a single-postcode range', () => {
		expect(() => range('75570-000', '75570-000')).not.toThrow()
	})

	test('derives its id from the postcodes', () => {
		expect(range('01000-000', '01999-999').id).toBe('01000000|01999999')
	})

	test('contains postcodes inside and on the edges', () => {
		const sut = range('01000-000', '01999-999')

		expect(sut.contains(new Postcode('01000-000'))).toBe(true)
		expect(sut.contains(new Postcode('01500-000'))).toBe(true)
		expect(sut.contains(new Postcode('01999-999'))).toBe(true)
		expect(sut.contains(new Postcode('00999-999'))).toBe(false)
		expect(sut.contains(new Postcode('02000-000'))).toBe(false)
	})

	test('overlaps when ranges cross or touch', () => {
		const sut = range('01000-000', '01999-999')

		expect(sut.overlaps(range('01500-000', '02500-000'))).toBe(true)
		expect(sut.overlaps(range('00500-000', '01000-000'))).toBe(true)
		expect(sut.overlaps(range('01200-000', '01300-000'))).toBe(true)
		expect(sut.overlaps(range('02000-000', '02999-999'))).toBe(false)
	})
})

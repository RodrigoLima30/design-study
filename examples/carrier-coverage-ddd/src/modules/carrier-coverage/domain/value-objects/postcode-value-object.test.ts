import { describe, expect, test } from 'bun:test'
import { Postcode } from './postcode-value-object'

describe('Postcode', () => {
	test('rejects invalid payloads', () => {
		expect(() => new Postcode(12345)).toThrow()
		expect(() => new Postcode(null)).toThrow()
		expect(() => new Postcode(undefined)).toThrow()
		expect(() => new Postcode({} as never)).toThrow()
		expect(() => new Postcode('34981')).toThrow()
		expect(() => new Postcode('123456789')).toThrow()
		expect(() => new Postcode('12345678abc')).toThrow()
		expect(() => new Postcode('A')).toThrow()
	})

	test('normalizes the dash', () => {
		expect(new Postcode('12230050').value).toBe('12230050')
		expect(new Postcode('12230-050').value).toBe('12230050')
	})

	test('keeps the leading zero', () => {
		expect(new Postcode('01000-000').value).toBe('01000000')
	})

	test('compares by value', () => {
		const before = new Postcode('11230050')
		const middle = new Postcode('12230050')
		const after = new Postcode('13230050')

		expect(middle.isBefore(after)).toBe(true)
		expect(middle.isBefore(before)).toBe(false)
		expect(middle.isAfter(before)).toBe(true)
		expect(middle.isAfter(after)).toBe(false)
		expect(middle.isEqual(new Postcode('12230-050'))).toBe(true)
		expect(middle.isEqual(after)).toBe(false)
	})

	test('serializes as its value', () => {
		expect(JSON.stringify({ postcode: new Postcode('12230-050') })).toBe('{"postcode":"12230050"}')
	})
})

import z from 'zod'

export const POSTCODE_PATTERN = /^\d{5}-?\d{3}$/

export const postcodeSchema = z
	.string()
	.regex(POSTCODE_PATTERN, 'Invalid postcode')
	.transform((value) => value.replace('-', ''))

export type PostcodeInput = z.input<typeof postcodeSchema>

export interface CoverageRangeRow {
	start: string
	end: string
}

import { formatCurrency, parseCurrency, validateNumber } from '../currency'

describe('Currency utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(100)).toBe('$100.00')
    })

    it('handles negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100.00')
    })

    it('handles invalid inputs', () => {
      expect(formatCurrency(NaN)).toBe('$0.00')
      expect(formatCurrency('invalid')).toBe('$0.00')
      expect(formatCurrency(null)).toBe('$0.00')
      expect(formatCurrency(undefined)).toBe('$0.00')
    })

    it('rounds to 2 decimal places', () => {
      expect(formatCurrency(123.456)).toBe('$123.46')
      expect(formatCurrency(123.454)).toBe('$123.45')
    })
  })

  describe('parseCurrency', () => {
    it('parses currency strings correctly', () => {
      expect(parseCurrency('$1,234.56')).toBe(1234.56)
      expect(parseCurrency('$100.00')).toBe(100)
      expect(parseCurrency('$0.00')).toBe(0)
    })

    it('handles empty or invalid inputs', () => {
      expect(parseCurrency('')).toBe(0)
      expect(parseCurrency(null)).toBe(0)
      expect(parseCurrency('invalid')).toBe(0)
    })

    it('removes currency symbols and commas', () => {
      expect(parseCurrency('$1,234.56')).toBe(1234.56)
      expect(parseCurrency('1,234.56')).toBe(1234.56)
      expect(parseCurrency('$1234.56')).toBe(1234.56)
    })
  })

  describe('validateNumber', () => {
    it('validates positive numbers', () => {
      expect(validateNumber(100)).toBe(100)
      expect(validateNumber('100')).toBe(100)
      expect(validateNumber('100.50')).toBe(100.5)
    })

    it('handles empty or invalid inputs', () => {
      expect(validateNumber('')).toBe(0)
      expect(validateNumber(null)).toBe(0)
      expect(validateNumber(undefined)).toBe(0)
      expect(validateNumber('invalid')).toBe(0)
    })

    it('ensures minimum value of 0', () => {
      expect(validateNumber(-100)).toBe(0)
      expect(validateNumber('-50')).toBe(0)
    })
  })
})


import { 
  calculateLineTotal, 
  calculateInvoiceTotals, 
  validateLineItem 
} from '../calculations'

describe('Calculation utilities', () => {
  describe('calculateLineTotal', () => {
    it('calculates line total correctly', () => {
      expect(calculateLineTotal(18.0, 2)).toBe(36.0)
      expect(calculateLineTotal(22.5, 1)).toBe(22.5)
      expect(calculateLineTotal(65.0, 3)).toBe(195.0)
    })

    it('handles zero values', () => {
      expect(calculateLineTotal(0, 5)).toBe(0)
      expect(calculateLineTotal(10, 0)).toBe(0)
      expect(calculateLineTotal(0, 0)).toBe(0)
    })

    it('handles negative values by treating them as 0', () => {
      expect(calculateLineTotal(-10, 2)).toBe(0)
      expect(calculateLineTotal(10, -2)).toBe(0)
    })

    it('handles invalid inputs', () => {
      expect(calculateLineTotal(null, 2)).toBe(0)
      expect(calculateLineTotal(10, null)).toBe(0)
      expect(calculateLineTotal(undefined, 2)).toBe(0)
    })
  })

  describe('calculateInvoiceTotals', () => {
    const sampleLineItems = [
      { unitPrice: 18.0, quantity: 2 },
      { unitPrice: 22.5, quantity: 1 },
      { unitPrice: 65.0, quantity: 3 }
    ]

    it('calculates totals correctly for sample data', () => {
      const totals = calculateInvoiceTotals(sampleLineItems, 0.08)
      
      // Subtotal: 36.00 + 22.50 + 195.00 = 253.50
      expect(totals.subtotal).toBe(253.5)
      
      // Tax: 253.50 * 0.08 = 20.28
      expect(totals.tax).toBe(20.28)
      
      // Total: 253.50 + 20.28 = 273.78
      expect(totals.total).toBe(273.78)
    })

    it('handles empty line items', () => {
      const totals = calculateInvoiceTotals([], 0.08)
      expect(totals.subtotal).toBe(0)
      expect(totals.tax).toBe(0)
      expect(totals.total).toBe(0)
    })

    it('handles different tax rates', () => {
      const totals = calculateInvoiceTotals(sampleLineItems, 0.1) // 10% tax
      expect(totals.tax).toBe(25.35) // 253.5 * 0.1
      expect(totals.total).toBe(278.85) // 253.5 + 25.35
    })

    it('handles zero tax rate', () => {
      const totals = calculateInvoiceTotals(sampleLineItems, 0)
      expect(totals.tax).toBe(0)
      expect(totals.total).toBe(253.5)
    })

    it('rounds to 2 decimal places', () => {
      const lineItems = [{ unitPrice: 1.111, quantity: 1 }]
      const totals = calculateInvoiceTotals(lineItems, 0.08)
      expect(totals.subtotal).toBe(1.11)
      expect(totals.tax).toBe(0.09)
      expect(totals.total).toBe(1.20)
    })
  })

  describe('validateLineItem', () => {
    it('validates line item correctly', () => {
      const item = {
        id: 'test',
        service: 'Test Service',
        unitPrice: 10.5,
        quantity: 2
      }
      
      const validated = validateLineItem(item)
      expect(validated).toEqual(item)
    })

    it('handles missing or invalid values', () => {
      const item = {
        id: 'test',
        service: '',
        unitPrice: -5,
        quantity: -2
      }
      
      const validated = validateLineItem(item)
      expect(validated.service).toBe('')
      expect(validated.unitPrice).toBe(0)
      expect(validated.quantity).toBe(0)
    })

    it('handles null/undefined values', () => {
      const item = {
        id: 'test',
        service: null,
        unitPrice: null,
        quantity: undefined
      }
      
      const validated = validateLineItem(item)
      expect(validated.service).toBe('')
      expect(validated.unitPrice).toBe(0)
      expect(validated.quantity).toBe(0)
    })
  })
})


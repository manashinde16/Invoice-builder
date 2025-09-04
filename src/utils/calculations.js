/**
 * Calculates the line total for a single item
 * @param {number} unitPrice - The unit price
 * @param {number} quantity - The quantity
 * @returns {number} Line total
 */
export const calculateLineTotal = (unitPrice, quantity) => {
  const price = Math.max(0, unitPrice || 0)
  const qty = Math.max(0, quantity || 0)
  return price * qty
}

/**
 * Calculates invoice totals
 * @param {Array} lineItems - Array of line items
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns {Object} Object containing subtotal, tax, and total
 */
export const calculateInvoiceTotals = (lineItems, taxRate = 0.08) => {
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + calculateLineTotal(item.unitPrice, item.quantity)
  }, 0)
  
  const tax = subtotal * taxRate
  const total = subtotal + tax
  
  return {
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

/**
 * Validates line item data
 * @param {Object} item - Line item object
 * @returns {Object} Validated line item
 */
export const validateLineItem = (item) => {
  return {
    ...item,
    unitPrice: Math.max(0, item.unitPrice || 0),
    quantity: Math.max(0, item.quantity || 0),
    service: item.service || '',
  }
}


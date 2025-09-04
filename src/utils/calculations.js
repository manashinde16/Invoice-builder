export const calculateLineTotal = (unitPrice, quantity) => {
  const price = Math.max(0, unitPrice || 0)
  const qty = Math.max(0, quantity || 0)
  return price * qty
}

export const calculateInvoiceTotals = (lineItems, taxRate = 0.08) => {
  const subtotal = lineItems.reduce((sum, item) => sum + calculateLineTotal(item.unitPrice, item.quantity), 0)
  const tax = subtotal * taxRate
  const total = subtotal + tax
  return {
    subtotal: Math.round(subtotal * 100) / 100, // 2-decimal rounding
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export const validateLineItem = (item) => ({
  ...item,
  unitPrice: Math.max(0, item.unitPrice || 0),
  quantity: Math.max(0, item.quantity || 0),
  service: item.service || '',
})


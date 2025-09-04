export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const parseCurrency = (value) => {
  if (!value || value === '') return 0
  const cleanValue = value.replace(/[$,\s]/g, '')
  const parsed = parseFloat(cleanValue)
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
}

export const validateNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 0
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 0
  return Math.max(0, num)
}


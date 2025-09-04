/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
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

/**
 * Parses a currency string to a number
 * @param {string} value - The currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (value) => {
  if (!value || value === '') return 0
  
  // Remove currency symbols and commas
  const cleanValue = value.replace(/[$,\s]/g, '')
  const parsed = parseFloat(cleanValue)
  
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
}

/**
 * Validates and sanitizes a numeric input
 * @param {string|number} value - The value to validate
 * @returns {number} Validated number (minimum 0)
 */
export const validateNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 0
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) return 0
  
  return Math.max(0, num)
}


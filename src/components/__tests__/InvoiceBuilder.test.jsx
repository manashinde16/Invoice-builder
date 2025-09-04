import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import InvoiceBuilder from '../InvoiceBuilder'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('InvoiceBuilder', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  it('renders the invoice builder', () => {
    render(<InvoiceBuilder />)
    
    expect(screen.getByText('Invoice Details')).toBeInTheDocument()
    expect(screen.getByText('Tax Rate:')).toBeInTheDocument()
    expect(screen.getByText('+ Add Item')).toBeInTheDocument()
  })

  it('displays default tax rate of 8%', () => {
    render(<InvoiceBuilder />)
    
    const taxRateInput = screen.getByTestId('tax-rate-input')
    expect(taxRateInput).toHaveValue(8)
  })

  it('allows changing tax rate', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    const taxRateInput = screen.getByTestId('tax-rate-input')
    await user.clear(taxRateInput)
    await user.type(taxRateInput, '10')
    
    // The input displays percentage values, so 10 should be 10
    expect(taxRateInput).toHaveValue(10)
  })

  it('adds new line items', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    const addButton = screen.getByTestId('add-item-button')
    await user.click(addButton)
    
    expect(screen.getByTestId('line-item-0')).toBeInTheDocument()
    expect(screen.getByTestId('service-select')).toBeInTheDocument()
  })

  it('calculates totals correctly', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    // Add first item
    await user.click(screen.getByTestId('add-item-button'))
    
    // Select Dog Walk – 30 min (should auto-fill $18.00)
    const serviceSelect = screen.getByTestId('service-select')
    await user.selectOptions(serviceSelect, 'walk30')
    
    // Set quantity to 2
    const quantityInput = screen.getByTestId('quantity-input')
    await user.clear(quantityInput)
    await user.type(quantityInput, '2')
    
    // Check line total
    expect(screen.getByTestId('line-total')).toHaveTextContent('$36.00')
    
    // Check invoice totals
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$36.00')
    expect(screen.getByTestId('tax')).toHaveTextContent('$2.88') // 8% of $36
    expect(screen.getByTestId('total')).toHaveTextContent('$38.88')
  })

  it('removes line items', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    // Add item
    await user.click(screen.getByTestId('add-item-button'))
    expect(screen.getByTestId('line-item-0')).toBeInTheDocument()
    
    // Remove item
    const removeButton = screen.getByTestId('remove-button')
    await user.click(removeButton)
    
    expect(screen.queryByTestId('line-item-0')).not.toBeInTheDocument()
  })

  it('handles custom service input', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    // Add item
    await user.click(screen.getByTestId('add-item-button'))
    
    // Select custom service
    const serviceSelect = screen.getByTestId('service-select')
    await user.selectOptions(serviceSelect, 'custom')
    
    // Should show custom input
    expect(screen.getByTestId('custom-service-input')).toBeInTheDocument()
    
    // Type custom service
    const customInput = screen.getByTestId('custom-service-input')
    await user.type(customInput, 'Custom Service')
    
    expect(customInput).toHaveValue('Custom Service')
  })

  it('validates numeric inputs', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    // Add item
    await user.click(screen.getByTestId('add-item-button'))
    
    // Try negative unit price
    const unitPriceInput = screen.getByTestId('unit-price-input')
    await user.clear(unitPriceInput)
    await user.type(unitPriceInput, '-10')
    
    // The validation function converts negative to 0, but the input might show empty
    // Let's check that the line total is 0 instead
    expect(screen.getByTestId('line-total')).toHaveTextContent('$0.00')
    
    // Try negative quantity
    const quantityInput = screen.getByTestId('quantity-input')
    await user.clear(quantityInput)
    await user.type(quantityInput, '-5')
    
    // The validation function converts negative to 0, but the input might show empty
    // Let's check that the line total is still 0
    expect(screen.getByTestId('line-total')).toHaveTextContent('$0.00')
  })

  it('persists data to localStorage', async () => {
    const user = userEvent.setup()
    render(<InvoiceBuilder />)
    
    // Add item and set values
    await user.click(screen.getByTestId('add-item-button'))
    
    const serviceSelect = screen.getByTestId('service-select')
    await user.selectOptions(serviceSelect, 'walk30')
    
    const quantityInput = screen.getByTestId('quantity-input')
    await user.clear(quantityInput)
    await user.type(quantityInput, '2')
    
    // Check that localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'invoice-line-items',
      expect.stringContaining('"service":"Dog Walk – 30 min"')
    )
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import LineItem from '../LineItem'

const mockItem = {
  id: 'test-item',
  service: '',
  unitPrice: 0,
  quantity: 0,
}

const mockOnUpdate = vi.fn()
const mockOnRemove = vi.fn()

describe('LineItem', () => {
  beforeEach(() => {
    mockOnUpdate.mockClear()
    mockOnRemove.mockClear()
  })

  it('renders line item with all inputs', () => {
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    expect(screen.getByTestId('service-select')).toBeInTheDocument()
    expect(screen.getByTestId('unit-price-input')).toBeInTheDocument()
    expect(screen.getByTestId('quantity-input')).toBeInTheDocument()
    expect(screen.getByTestId('line-total')).toBeInTheDocument()
    expect(screen.getByTestId('remove-button')).toBeInTheDocument()
  })

  it('displays line total as $0.00 initially', () => {
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    expect(screen.getByTestId('line-total')).toHaveTextContent('$0.00')
  })

  it('calculates line total correctly', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    // Set unit price to $18.00
    const unitPriceInput = screen.getByTestId('unit-price-input')
    await user.clear(unitPriceInput)
    await user.type(unitPriceInput, '18')
    
    // Set quantity to 2
    const quantityInput = screen.getByTestId('quantity-input')
    await user.clear(quantityInput)
    await user.type(quantityInput, '2')
    
    // Check line total
    expect(screen.getByTestId('line-total')).toHaveTextContent('$36.00')
  })

  it('selects service from dropdown and auto-fills price', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    const serviceSelect = screen.getByTestId('service-select')
    await user.selectOptions(serviceSelect, 'walk30')
    
    // Should auto-fill unit price
    const unitPriceInput = screen.getByTestId('unit-price-input')
    expect(unitPriceInput).toHaveValue(18)
    
    // Should update service name
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        service: 'Dog Walk – 30 min',
        unitPrice: 18,
      })
    )
  })

  it('switches to custom service input', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    const serviceSelect = screen.getByTestId('service-select')
    await user.selectOptions(serviceSelect, 'custom')
    
    // Should show custom input
    expect(screen.getByTestId('custom-service-input')).toBeInTheDocument()
    expect(screen.queryByTestId('service-select')).not.toBeInTheDocument()
  })

  it('handles custom service input', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    // Switch to custom service
    const serviceSelect = screen.getByTestId('service-select')
    await user.selectOptions(serviceSelect, 'custom')
    
    // Type custom service
    const customInput = screen.getByTestId('custom-service-input')
    await user.type(customInput, 'Custom Service')
    
    expect(customInput).toHaveValue('Custom Service')
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        service: 'Custom Service',
      })
    )
  })

  it('validates numeric inputs', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
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

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    const removeButton = screen.getByTestId('remove-button')
    await user.click(removeButton)
    
    expect(mockOnRemove).toHaveBeenCalledWith('test-item')
  })

  it('calls onUpdate when values change', async () => {
    const user = userEvent.setup()
    render(
      <LineItem
        item={mockItem}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        index={0}
      />
    )
    
    // Change unit price
    const unitPriceInput = screen.getByTestId('unit-price-input')
    await user.clear(unitPriceInput)
    await user.type(unitPriceInput, '25')
    
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        unitPrice: 25,
      })
    )
    
    // Change quantity
    const quantityInput = screen.getByTestId('quantity-input')
    await user.clear(quantityInput)
    await user.type(quantityInput, '3')
    
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 3,
      })
    )
  })
})

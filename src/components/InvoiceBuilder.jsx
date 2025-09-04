import React, { useState, useEffect, useCallback } from 'react'
import LineItem from './LineItem'
import { formatCurrency } from '../utils/currency'
import { calculateInvoiceTotals, validateLineItem } from '../utils/calculations'
import './InvoiceBuilder.css'

const InvoiceBuilder = () => {
  const [lineItems, setLineItems] = useState([])
  const [taxRate, setTaxRate] = useState(0.08)

  useEffect(() => {
    const savedItems = localStorage.getItem('invoice-line-items')
    const savedTaxRate = localStorage.getItem('invoice-tax-rate')

    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems)
        setLineItems(parsedItems.map(validateLineItem))
      } catch (error) {
        console.error('Error loading saved line items:', error)
      }
    }

    if (savedTaxRate) {
      try {
        const parsedTaxRate = parseFloat(savedTaxRate)
        if (!isNaN(parsedTaxRate) && parsedTaxRate >= 0) setTaxRate(parsedTaxRate)
      } catch (error) {
        console.error('Error loading saved tax rate:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('invoice-line-items', JSON.stringify(lineItems))
  }, [lineItems])

  useEffect(() => {
    localStorage.setItem('invoice-tax-rate', taxRate.toString())
  }, [taxRate])

  const totals = calculateInvoiceTotals(lineItems, taxRate)

  const generateId = useCallback(() => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, [])

  const addLineItem = useCallback(() => {
    const newItem = { id: generateId(), service: '', unitPrice: 0, quantity: 0 }
    setLineItems(prev => [...prev, newItem])
  }, [generateId])

  const updateLineItem = useCallback((updatedItem) => {
    setLineItems(prev => prev.map(item => (item.id === updatedItem.id ? validateLineItem(updatedItem) : item)))
  }, [])

  const removeLineItem = useCallback((itemId) => {
    setLineItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const handleTaxRateChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    setTaxRate(Math.max(0, Math.min(1, value / 100))) // percentage → decimal, clamped
  }

  return (
    <div className="invoice-builder">
      <div className="invoice-builder__header">
        <h2>Invoice Details</h2>
        <div className="invoice-builder__tax-control">
          <label htmlFor="tax-rate" className="tax-rate-label">Tax Rate:</label>
          <input
            id="tax-rate"
            type="number"
            value={taxRate * 100}
            onChange={handleTaxRateChange}
            min="0"
            max="100"
            step="0.1"
            className="tax-rate-input"
            data-testid="tax-rate-input"
          />
          <span className="tax-rate-suffix">%</span>
        </div>
      </div>

      <div className="invoice-builder__content">
        <div className="line-items">
          <div className="line-items__header">
            <div className="line-items__header-service">Service</div>
            <div className="line-items__header-unit-price">Unit Price</div>
            <div className="line-items__header-quantity">Quantity</div>
            <div className="line-items__header-total">Line Total</div>
            <div className="line-items__header-actions">Actions</div>
          </div>

          <div className="line-items__list">
            {lineItems.map((item, index) => (
              <LineItem
                key={item.id}
                item={item}
                index={index}
                onUpdate={updateLineItem}
                onRemove={removeLineItem}
              />
            ))}
          </div>

          <div className="line-items__add">
            <button type="button" onClick={addLineItem} className="add-item-btn" data-testid="add-item-button">
              + Add Item
            </button>
          </div>
        </div>

        <div className="invoice-totals">
          <div className="invoice-totals__row">
            <span className="invoice-totals__label">Subtotal:</span>
            <span className="invoice-totals__value" data-testid="subtotal">
              {formatCurrency(totals.subtotal)}
            </span>
          </div>

          <div className="invoice-totals__row">
            <span className="invoice-totals__label">Tax ({(taxRate * 100).toFixed(1)}%):</span>
            <span className="invoice-totals__value" data-testid="tax">
              {formatCurrency(totals.tax)}
            </span>
          </div>

          <div className="invoice-totals__row invoice-totals__row--total">
            <span className="invoice-totals__label">Total:</span>
            <span className="invoice-totals__value invoice-totals__value--total" data-testid="total">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceBuilder

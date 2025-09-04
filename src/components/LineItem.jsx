import React, { useState, useEffect } from 'react'
import { formatCurrency, validateNumber } from '../utils/currency'
import { calculateLineTotal } from '../utils/calculations'
import { SAMPLE_SERVICES } from '../data/services'
import './LineItem.css'

const LineItem = ({ item, onUpdate, onRemove, index }) => {
  const [service, setService] = useState(item.service || '')
  const [unitPrice, setUnitPrice] = useState(item.unitPrice || 0)
  const [quantity, setQuantity] = useState(item.quantity || 0)
  const [isCustomService, setIsCustomService] = useState(false)

  const lineTotal = calculateLineTotal(unitPrice, quantity)

  useEffect(() => {
    onUpdate({
      ...item,
      service,
      unitPrice,
      quantity,
    })
  }, [service, unitPrice, quantity, item.id])

  const handleServiceChange = (e) => {
    const selectedServiceId = e.target.value
    if (selectedServiceId === 'custom') {
      setIsCustomService(true)
      setService('')
    } else if (selectedServiceId === '') {
      setIsCustomService(false)
      setService('')
    } else {
      const selectedService = SAMPLE_SERVICES.find(s => s.id === selectedServiceId)
      if (selectedService) {
        setService(selectedService.name)
        setUnitPrice(selectedService.unitPrice)
        setIsCustomService(false)
      }
    }
  }

  const handleCustomServiceChange = (e) => setService(e.target.value)

  const handleUnitPriceChange = (e) => setUnitPrice(validateNumber(e.target.value))

  const handleQuantityChange = (e) => setQuantity(validateNumber(e.target.value))

  const handleRemove = () => onRemove(item.id)

  return (
    <div className="line-item" data-testid={`line-item-${index}`}>
      <div className="line-item__service">
        {!isCustomService ? (
          <select
            value={SAMPLE_SERVICES.find(s => s.name === service)?.id || ''}
            onChange={handleServiceChange}
            className="line-item__select"
            data-testid="service-select"
          >
            <option value="">Select a service...</option>
            {SAMPLE_SERVICES.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
            <option value="custom">Custom service...</option>
          </select>
        ) : (
          <input
            type="text"
            value={service}
            onChange={handleCustomServiceChange}
            placeholder="Enter service name"
            className="line-item__input"
            data-testid="custom-service-input"
          />
        )}
      </div>

      <div className="line-item__unit-price">
        <input
          type="number"
          value={unitPrice || ''}
          onChange={handleUnitPriceChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="line-item__input line-item__input--number"
          data-testid="unit-price-input"
        />
      </div>

      <div className="line-item__quantity">
        <input
          type="number"
          value={quantity || ''}
          onChange={handleQuantityChange}
          placeholder="0"
          min="0"
          step="1"
          className="line-item__input line-item__input--number"
          data-testid="quantity-input"
        />
      </div>

      <div className="line-item__total">
        <span className="line-item__total-amount" data-testid="line-total">
          {formatCurrency(lineTotal)}
        </span>
      </div>

      <div className="line-item__actions">
        <button
          type="button"
          onClick={handleRemove}
          className="line-item__remove-btn"
          data-testid="remove-button"
          aria-label={`Remove ${service || 'item'}`}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default LineItem


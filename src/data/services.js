/**
 * Sample service data for the invoice builder
 */
export const SAMPLE_SERVICES = [
  { 
    id: "walk30", 
    name: "Dog Walk – 30 min", 
    unitPrice: 18.0 
  },
  { 
    id: "walk60", 
    name: "Dog Walk – 60 min", 
    unitPrice: 30.0 
  },
  { 
    id: "dropin", 
    name: "Drop-in Visit", 
    unitPrice: 22.5 
  },
  { 
    id: "boarding", 
    name: "Overnight Boarding (per night)", 
    unitPrice: 65.0 
  }
]

/**
 * Gets a service by ID
 * @param {string} id - Service ID
 * @returns {Object|null} Service object or null if not found
 */
export const getServiceById = (id) => {
  return SAMPLE_SERVICES.find(service => service.id === id) || null
}


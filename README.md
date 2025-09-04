# Invoice Builder

A modern React app to build invoices with live line-item totals, automatic subtotal/tax/total, currency formatting, validation, and a clean responsive UI.

## ✅ MVP Coverage (Cross‑Verified)

- Line items
  - Service: dropdown with sample data + custom service option
  - Unit Price: number input (empty/invalid coerced to 0; negative prevented)
  - Quantity: number input (empty/invalid coerced to 0; negative prevented)
  - Line Total: computed, read‑only and updates live
  - Remove button per row
  - Add Item button to insert new rows
- Totals (live updates)
  - Subtotal = sum(line totals)
  - Tax = 8% (editable, defaults to 8%)
  - Total = Subtotal + Tax
  - All money values formatted via `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`
- Validation/Resilience
  - Quantity ≥ 0, Unit Price ≥ 0
  - Empty inputs treated as 0; app never crashes on invalid input
  - Negative values coerced to 0
- No backend
  - All state in React; optional localStorage persistence included (nice‑to‑have)

## ✨ Nice‑to‑Haves Included
- Service dropdown populated from sample data and auto‑fills unit price
- Editable tax rate (defaults to 8%)
- LocalStorage persistence for items and tax rate
- Comprehensive unit tests (40 tests passing with Vitest + Testing Library)
- Polished UI/UX: responsive design, focus/hover states, gradient accents, custom favicon

## 🧮 Example Calculation (Acceptance)
Given:
1. Dog Walk – 30 min: $18.00 × 2 → $36.00
2. Drop‑in Visit: $22.50 × 1 → $22.50
3. Overnight Boarding: $65.00 × 3 → $195.00

Results:
- Subtotal = $253.50
- Tax (8%) = $20.28
- Total = $273.78

This exact computation is implemented and covered by tests.

## 🏗️ Tech Stack
- React 18 + Vite
- CSS (custom, responsive, accessible)
- Vitest + @testing-library/react + jsdom

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9 (or pnpm/yarn if preferred)

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Open the URL printed in the terminal (e.g., `http://localhost:5173` or `5174`).

### Tests
```bash
npm test
# or
npx vitest run
```
All tests should pass (40/40). A UI mode is also available via `npm run test:ui` if configured.

### Build
```bash
npm run build
npm run preview
```

## 🗂️ Project Structure
```
src/
  components/
    InvoiceBuilder.jsx       # Main invoice screen
    InvoiceBuilder.css
    LineItem.jsx             # Single line item row
    LineItem.css
  data/
    services.js              # Sample services (id, name, unitPrice)
  utils/
    currency.js              # formatCurrency, parseCurrency, validateNumber
    calculations.js          # line and invoice total math
  test/
    setup.js                 # Testing setup (jest-dom)
```

## 🧠 Key Implementation Details
- State is localized in React components with `useState`.
- Totals are derived via pure utility functions in `utils/calculations.js`.
- Inputs are sanitized with `validateNumber` (empty → 0, negative → 0).
- Currency formatting uses `Intl.NumberFormat` for consistent USD formatting.
- LocalStorage persistence via `useEffect` for line items and tax rate.
- Service dropdown writes `service` and auto‑fills `unitPrice` from sample data.

## 🖼️ UX Highlights
- Clean, modern styling with gradients and subtle shadows
- Strong focus/hover states for accessibility
- Mobile‑first responsive layout with card‑style line items on small screens
- Custom SVG favicon (`public/favicon.svg`)

## 🔍 Troubleshooting
- If tests prompt about `vitest`/config, ensure dependencies are installed: `npm install`.
- If port 5173 is taken, Vite auto‑selects a new port and prints it.
- If localStorage carries stale data, clear it from DevTools (Application → Local Storage) or click refresh.

## 📜 License
This project is provided for assessment/demo purposes. You may reuse parts as needed.

---
If you want PDF export/print layouts, discounts, or multi‑currency support added, open an issue or let me know and I can extend the app quickly.
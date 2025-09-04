import React from 'react'
import InvoiceBuilder from './components/InvoiceBuilder'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Invoice Builder</h1>
        <p>Create professional invoices with ease</p>
      </header>
      <main className="app-main">
        <InvoiceBuilder />
      </main>
    </div>
  )
}

export default App


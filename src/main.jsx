// src/main.jsx (UPDATED)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' 
import { ModalProvider } from './contexts/ModalContext.jsx' // <-- Import Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <ModalProvider> {/* <-- Wrap App with ModalProvider */}
        <App />
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
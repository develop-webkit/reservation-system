// src/main.jsx (UPDATED)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' 
import { ModalProvider } from './contexts/ModalContext.jsx' 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- NEW IMPORT

// Initialize TanStack Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  
      {/* Wrap everything with the Query Provider */}
      <QueryClientProvider client={queryClient}> 
        <ModalProvider>
          <App />    
        </ModalProvider> 
      </QueryClientProvider>
    </BrowserRouter> 
  </React.StrictMode>,
)
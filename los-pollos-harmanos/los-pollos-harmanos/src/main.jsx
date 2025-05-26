import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // Add this import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreContextProvider>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <App />
        </AuthProvider>
      </StoreContextProvider>
    </BrowserRouter>
  </StrictMode>
)
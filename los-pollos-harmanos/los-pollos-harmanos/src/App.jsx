import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceHolder from './pages/PlaceHolder/PlaceHolder'
import Footer from './components/Footer/Footer'
import AppDownload from './components/AppDownload/AppDownload'
import LoginPopup from './components/LoginPopup/LoginPopup'
import SignupPopup from './components/LoginPopup/SignupPopup'

const App = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

  const handleAuthToggle = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login')
  }

  return (
    <>
      {/* Auth Popups */}
      {showAuth && (
        authMode === 'login' ? (
          <LoginPopup 
            setShowLogin={setShowAuth} 
            switchToSignup={handleAuthToggle} 
          />
        ) : (
          <SignupPopup 
            setShowLogin={setShowAuth} 
            switchToLogin={handleAuthToggle} 
          />
        )
      )}

      <div className='app'>
        <Navbar setShowLogin={setShowAuth} />
        <Routes>
          <Route path='/' element={<Home setShowLogin={setShowAuth} />} />
          <Route path='/cart' element={<Cart setShowLogin={setShowAuth} />} />
          <Route path='/order' element={<PlaceHolder />} />
        </Routes>
        <AppDownload />
      </div>
      <Footer />
    </>
  )
}

export default App
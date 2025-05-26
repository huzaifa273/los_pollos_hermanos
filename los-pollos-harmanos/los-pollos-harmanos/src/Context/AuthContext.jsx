// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token')
    if (token) {
      // You might want to verify the token or fetch user data here
      setUser({ token })
    }
  }, [])

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
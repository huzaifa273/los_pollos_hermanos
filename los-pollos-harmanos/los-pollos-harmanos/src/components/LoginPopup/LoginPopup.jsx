import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { login } from '../../api/auth';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Corrected import path

const LoginPopup = ({ setShowLogin, switchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext); // Get login from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      
      // Update auth state using context
      authLogin({
        token: response.token,
        user: response.user
      });
      
      setShowLogin(false);
      // No longer need to refresh the page
    } catch (err) {
      // Handle different error formats
      let errorMessage = err.message;
      
      if (err.message.startsWith('<!DOCTYPE html>')) {
        errorMessage = 'Login service unavailable. Please try later.';
      } else if (err.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>Login</h2>
          <img 
            onClick={() => setShowLogin(false)} 
            src={assets.cross_icon} 
            alt="Close" 
            className="close-icon"
          />
        </div>
        
        {error && <div className="login-popup-error">
          <img src={assets.warning_icon} alt="Warning" className="warning-icon" />
          {error}
        </div>}
        
        <div className="login-popup-inputs">
          <input 
            type="email" 
            name="email"
            placeholder='Your email' 
            value={formData.email}
            onChange={handleChange}
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            name="password"
            placeholder='Password' 
            value={formData.password}
            onChange={handleChange}
            required 
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <img src={assets.loader_icon} alt="Loading" className="loader-icon" />
              Logging in...
            </>
          ) : 'Login'}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required disabled={loading} />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        
        <p className="auth-toggle-text">
          Don't have an account? 
          <span onClick={!loading ? switchToSignup : undefined}> 
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
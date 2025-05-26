import React, { useState } from 'react';
import './LoginPopup.css'; // Reusing the same styles
import { assets } from '../../assets/assets';
import { register } from '../../api/auth';

const SignupPopup = ({ setShowLogin, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const data = await register(formData);
      // Handle successful registration
      setShowLogin(false);
      window.location.reload(); // Refresh to update auth state
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>Sign Up</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        
        {error && <div className="login-popup-error">{error}</div>}
        
        <div className="login-popup-inputs">
          <input 
            type="text" 
            name="name"
            placeholder='Your name' 
            value={formData.name}
            onChange={handleChange}
            required 
          />
          <input 
            type="email" 
            name="email"
            placeholder='Your email' 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder='Password' 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        
        <p>
          Already have an account? 
          <span onClick={switchToLogin}> Login here</span>
        </p>
      </form>
    </div>
  );
};

export default SignupPopup;
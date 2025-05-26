import React, { useContext, useState } from 'react';
import './PlaceHolder.css';
import { StoreContext } from '../../Context/StoreContext';
import { AuthContext } from '../../context/AuthContext';
import { createOrder } from '../../api/orders';
import { useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const PlaceHolder = () => {
  const location = useLocation();
  const { clearCart } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  
  // Get cart items and totals from navigation state
  const { cartItems, totals } = location.state || { 
    cartItems: [], 
    totals: { subtotal: 0, deliveryFee: 0, total: 0 } 
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (cartItems.length === 0) {
    setError('Your cart is empty');
    return;
  }

  setLoading(true);
  setError('');

  // Construct the order data here
  const orderData = {
    user: user?.id,
    items: cartItems.map(item => ({
      foodId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || ''
    })),
    totalAmount: totals.total,
    deliveryAddress: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country
    },
    contact: {
      phone: formData.phone,
      email: formData.email || user?.email
    },
    customerName: `${formData.firstName} ${formData.lastName}`.trim(),
    paymentMethod: 'Cash on Delivery'
  };

  try {
    const response = await createOrder(orderData);
    
    // Debug log to check response
    console.log('Order response:', response);
    
    if (response.success) {
      setOrderSuccess(true);
      clearCart();
    }
  } catch (err) {
    // Handle different error formats
    let errorMessage = err.message;
    
    if (err.message.startsWith('<!DOCTYPE html>')) {
      errorMessage = 'Order service unavailable. Please try later.';
    } else if (err.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    setError(errorMessage);
    console.error('Order submission error:', err);
  } finally {
    setLoading(false);
  }
};

  if (orderSuccess) {
    return (
      <div className="placeholder-success">
        <img src={assets.success_icon} alt="Success" />
        <h2>Order Placed Successfully!</h2>
        <p>Your food is on its way.</p>
        <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <form className="placeholder-form" onSubmit={handleSubmit}>
      <div className="placeholder-left">
        <p className="title">Delivery Information</p>
        
        <div className="form-group">
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
              minLength="2"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              minLength="2"
            />
          </div>
          
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="street"
            placeholder="Street address"
            value={formData.street}
            onChange={handleChange}
            required
          />
          
          <div className="location-fields">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State/Province"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="location-fields">
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP/Postal code"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10,15}"
          />
        </div>
      </div>
      
      <div className="placeholder-right">
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${totals.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading || cartItems.length === 0}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Place Your Order'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceHolder;
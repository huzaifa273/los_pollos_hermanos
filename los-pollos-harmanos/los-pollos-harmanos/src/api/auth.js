// api/auth.js
// api/auth.js
export const register = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // First check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || 'Server returned non-JSON response');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (err) {
    console.error('Registration error:', err);
    throw new Error(err.message || 'Registration failed. Please try again.');
  }
};

// Data format to send:
/*
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
*/



// api/auth.js
export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || 'Server returned non-JSON response');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw new Error(err.message || 'Login failed. Please try again.');
  }
};

// Data format to send:
/*
{
  "email": "john@example.com",
  "password": "123456"
}
*/



export const forgotPassword = async (email) => {
  const response = await fetch('http://localhost:5000/api/v1/auth/forgotpassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Password reset failed');
  }

  return data;
};

// Data format to send:
/*
{
  "email": "john@example.com"
}
*/
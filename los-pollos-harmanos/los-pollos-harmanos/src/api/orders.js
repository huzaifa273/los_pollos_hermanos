// api/orders.js
export const createOrder = async (orderData) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(orderData)
    });

    // First check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || 'Server returned non-JSON response');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Order creation failed');
    }

    return data;
  } catch (err) {
    console.error('Order API Error:', err);
    throw err;
  }
};

// Data format to send:
/*
{
  "items": [
    {
      "name": "Burger",
      "quantity": 2,
      "price": 10.99
    },
    {
      "name": "Fries",
      "quantity": 1,
      "price": 4.99
    }
  ],
  "totalAmount": 26.97,
  "deliveryAddress": "123 Main St, City, Country"
}
*/




export const getOrders = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/v1/orders', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch orders');
  }

  return data;
};

// Returns:
/*
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "order_id_1",
      "items": [...],
      "totalAmount": 26.97,
      "deliveryAddress": "123 Main St",
      "status": "pending",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2023-05-20T12:00:00.000Z"
    },
    {...}
  ]
}
*/





export const getOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch order');
  }

  return data;
};

// Returns same format as getOrders but for a single order

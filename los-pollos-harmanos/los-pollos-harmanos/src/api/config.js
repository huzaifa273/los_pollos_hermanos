const API_BASE = 'http://localhost:5000/api/v1';

export const apiConfig = {
  baseUrl: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`
    };
  }
};
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/password', passwords),
  
  // Address management
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/auth/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.put(`/auth/addresses/${addressId}/default`),
  registerWithGoogle: () => api.get('/auth/google'),
};

// Product API calls
export const productAPI = {
  getAll: (params) => api.get('/products-enhanced', { params }), 
  getById: (id) => api.get(`/products-enhanced/${id}`),
  getFeatured: () => api.get('/products-enhanced/featured'),
  getTopRated: () => api.get('/products-enhanced/top/rated'),
  getCategories: () => api.get('/products-enhanced/categories'),
  search: (query) => api.get('/products-enhanced', { params: { search: query } }),
};

// Cart API calls
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productData) => api.post('/cart/add', productData),
  update: (itemId, updateData) => api.put(`/cart/item/${itemId}`, updateData),
  remove: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
  getCount: () => api.get('/cart/count'),
};

// Order API calls
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateToPaid: (id, paymentData) => api.put(`/orders/${id}/pay`, paymentData),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  invoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),

  createRazorpayOrder: (amount) =>
    api.post('/orders/razorpay', { amount }),

  verifyRazorpayPayment: (data) =>
    api.post('/orders/razorpay/verify', data),
};


export default api;
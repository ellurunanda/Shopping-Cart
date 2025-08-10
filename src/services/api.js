import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Products API
export const productsAPI = {
  getAll: (limit = 30, skip = 0) => 
    api.get(`/products?limit=${limit}&skip=${skip}`),
  getById: (id) => 
    api.get(`/products/${id}`),
  search: (query) => 
    api.get(`/products/search?q=${query}`),
  getCategories: () => 
    api.get('/products/categories'),
  getByCategory: (category) => 
    api.get(`/products/category/${category}`),
  add: (product) => 
    api.post('/products/add', product),
};

// Cart API
export const cartAPI = {
  add: (cartData) => 
    api.post('/carts/add', cartData),
  getById: (id) => 
    api.get(`/carts/${id}`),
};

// Auth API (mock)
export const authAPI = {
  login: (credentials) => 
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          resolve({
            data: {
              user: { id: 1, username: 'admin', role: 'admin', name: 'Administrator' }
            }
          });
        } else if (credentials.username === 'client' && credentials.password === 'client123') {
          resolve({
            data: {
              user: { id: 2, username: 'client', role: 'client', name: 'John Client' }
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    }),
  register: (userData) => 
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (!userData.username || !userData.email || !userData.password) {
          reject(new Error('All fields are required'));
          return;
        }
        
        if (userData.username === 'admin' || userData.username === 'client') {
          reject(new Error('Username already exists'));
          return;
        }
        
        if (userData.email === 'admin@example.com' || userData.email === 'client@example.com') {
          reject(new Error('Email already exists'));
          return;
        }
        
        // Simulate successful registration
        const newUser = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          role: userData.role || 'client',
          name: `${userData.firstName} ${userData.lastName}`
        };
        
        resolve({
          data: {
            user: newUser
          }
        });
      }, 1500);
    }),
};

export default api;
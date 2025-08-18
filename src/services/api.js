// services/api.js — use your backend for auth/products; keep DummyJSON for cart (optional)
// Drop-in replacement for your current file.

import axios from 'axios';


// Backend base URL (set in your frontend .env):
// VITE_API_BASE=http://localhost:5000
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// --- Axios clients ---
export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // harmless now; useful later if you move to HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

http.defaults.withCredentials = false;

const dummy = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

// Helper: try backend, fallback to DummyJSON only on 404/501/network
const withFallback = async (primary, fallback) => {
  try {
    return await primary();
  } catch (err) {
    const status = err?.response?.status;
    const isNetwork = err?.code === 'ERR_NETWORK';
    if (isNetwork || status === 404 || status === 501) {
      return await fallback();
    }
    throw err;
  }
};

// =====================
// AUTH (Backend)
// =====================
export const authAPI = {
  register: (payload) => http.post('/api/auth/register', payload), // expects { user }
  login:    (payload) => http.post('/api/auth/login', payload),    // expects { user }
};

// =====================
// PRODUCTS
// Prefer Backend. Fallback to DummyJSON if your backend endpoints aren't ready yet.
// Backend endpoints to implement (recommended):
//  GET  /api/products?limit=15&skip=0
//  GET  /api/products/:id
//  GET  /api/products/search?q=iphone
//  GET  /api/products/categories
//  GET  /api/products/category/:category
//  POST /api/products  (admin only)
// =====================
export const productsAPI = {
  getAll: (limit = 15, skip = 0) =>
    withFallback(
      () => http.get('/api/products', { params: { limit, skip } }),
      () => dummy.get(`/products?limit=${limit}&skip=${skip}`)
    ),

  getById: (id) =>
    withFallback(
      () => http.get(`/api/products/${id}`),
      () => dummy.get(`/products/${id}`)
    ),

  search: (query) =>
    withFallback(
      () => http.get('/api/products/search', { params: { q: query } }),
      () => dummy.get(`/products/search?q=${encodeURIComponent(query)}`)
    ),

  getCategories: () =>
    withFallback(
      () => http.get('/api/products/categories'),
      () => dummy.get('/products/categories')
    ),

// AFTER (use the looser fallback)
getCategories: () =>
  withFallbackLoose(
    () => http.get('/api/products/categories'),
    () => dummy.get('/products/categories')
  ),


  getByCategory: (category) =>
    withFallback(
      () => http.get(`/api/products/category/${encodeURIComponent(category)}`),
      () => dummy.get(`/products/category/${encodeURIComponent(category)}`)
    ),

  add: (product) => http.post('/api/products', product), // backend create (admin)
};

// =====================
// CART
// Keep using DummyJSON for now (until you build your cart backend)
// =====================
export const cartAPI = {
  add:   (cartData) => dummy.post('/carts/add', cartData),
  getById: (id)     => dummy.get(`/carts/${id}`),
};

export default http;
// ======= ADDED: expose backend base for convenience =======
export { API_BASE as BACKEND_BASE_URL };

// ======= ADDED: set/unset Authorization header (for JWT later) =======
export const setAuthToken = (token) => {
  if (token) {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common['Authorization'];
  }
};

// ======= ADDED: unified error extractor (pairs with your authSlice) =======
export const toApiError = (err) => {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length) return data.errors[0].msg;
  if (err?.code === 'ERR_NETWORK') return 'Cannot reach server';
  return err?.message || 'Something went wrong';
};

// ======= ADDED: optional interceptor to catch 401s globally =======
export const installHttpErrorInterceptor = (onUnauthorized) => {
  http.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401 && typeof onUnauthorized === 'function') {
        onUnauthorized();
      }
      return Promise.reject(err);
    }
  );
};

// ======= ADDED: simple health + (optional) profile helpers =======
export const systemAPI = {
  health: () => http.get('/health'),
};

export const usersAPI = {
  // Implement /api/users/me on backend when ready; safe to leave unused for now
  me: () => http.get('/api/users/me'),
};
// ADD: looser fallback that also falls back on 400 Bad Request
const withFallbackLoose = async (primary, fallback) => {
  try {
    return await primary();
  } catch (err) {
    const s = err?.response?.status;
    const isNetwork = err?.code === 'ERR_NETWORK';
    if (isNetwork || s === 404 || s === 400 || s === 501) {
      return await fallback();
    }
    throw err;
  }
};

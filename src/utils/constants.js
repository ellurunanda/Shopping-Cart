// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 10000,
  DEFAULT_LIMIT: 30,
  DEFAULT_SKIP: 0,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

// Demo Credentials
export const DEMO_CREDENTIALS = {
  ADMIN: {
    username: 'admin',
    password: 'admin123',
  },
  CLIENT: {
    username: 'client',
    password: 'client123',
  },
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  ALL: '',
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME: 'home',
};

// Form Validation
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
};

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'shopcart_user',
  CART: 'shopcart_cart',
  PREFERENCES: 'shopcart_preferences',
};
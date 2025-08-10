// Route exports
export { default as AppRoutes } from './AppRoutes';

// Route constants for easy reference
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protected routes
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  
  // Admin routes
  ADMIN_ADD_PRODUCT: '/admin/add-product',
  
  // Redirects
  HOME: '/',
};

// Helper function to generate product detail route
export const getProductDetailRoute = (id) => `/products/${id}`;

// Route groups for easier management
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
];

export const PROTECTED_ROUTES = [
  ROUTES.PRODUCTS,
  ROUTES.PRODUCT_DETAIL,
  ROUTES.CART,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_ADD_PRODUCT,
];
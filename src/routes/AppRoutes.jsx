import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

// Lazy loaded components
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const ProductList = lazy(() => import('../pages/ProductList/ProductList'));
const ProductDetail = lazy(() => import('../pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const AddProduct = lazy(() => import('../pages/AddProduct/AddProduct'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <Suspense fallback={<LoadingSpinner message="Loading login..." />}>
              <Login />
            </Suspense>
          } 
        />
        <Route 
          path="/register" 
          element={
            <Suspense fallback={<LoadingSpinner message="Loading registration..." />}>
              <Register />
            </Suspense>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner message="Loading products..." />}>
                <ProductList />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner message="Loading product details..." />}>
                <ProductDetail />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner message="Loading cart..." />}>
                <Cart />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/add-product" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Suspense fallback={<LoadingSpinner message="Loading admin panel..." />}>
                <AddProduct />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
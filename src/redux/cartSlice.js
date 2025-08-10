import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../utils/constants';

export const syncCartWithAPI = createAsyncThunk(
  'cart/syncWithAPI',
  async (cartData) => {
    // Mock API call - in real app would sync with backend
    return cartData;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Clear from localStorage
      localStorage.removeItem(STORAGE_KEYS.CART);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
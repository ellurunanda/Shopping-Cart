import { configureStore } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../utils/constants.js';
import authSlice from './authSlice.js';
import productSlice from './productSlice.js';
import cartSlice from './cartSlice.js';

// Load persisted state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch  {
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      cart: {
        items: state.cart.items,
        totalItems: state.cart.totalItems,
        totalPrice: state.cart.totalPrice,
      }
    });
    localStorage.setItem('reduxState', serializedState);
  } catch  {
    // Ignore write errors
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});
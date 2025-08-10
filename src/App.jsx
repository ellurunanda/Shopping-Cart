import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import Header from './components/Header/Header';
import { AppRoutes } from './routes';
import styles from './App.module.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className={styles.app}>
          <Header />
          <main className={styles.main}>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Package, LogIn } from 'lucide-react';
import { loginUser, clearError } from '../../redux/authSlice';
import { ROUTES } from '../../routes';
import styles from './Login.module.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.PRODUCTS);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  const handleDemoLogin = (type) => {
    const demoCredentials = type === 'admin' 
      ? { username: 'admin', password: 'admin123' }
      : { username: 'client', password: 'client123' };
    
    setCredentials(demoCredentials);
    dispatch(loginUser(demoCredentials));
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <Package size={32} />
          <span className={styles.logoText}>ShopCart Pro</span>
        </div>
        
        <h2 className={styles.title}>Welcome Back</h2>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className={styles.demoCredentials}>
          <div className={styles.demoTitle}>Demo Accounts</div>
          
          <div className={styles.demoItem}>
            <span className={styles.demoLabel}>Admin:</span>
            <div>
              <span className={styles.demoValue}>admin / admin123</span>
              <button 
                onClick={() => handleDemoLogin('admin')}
                style={{ 
                  marginLeft: '0.5rem', 
                  background: '#3b82f6', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Try
              </button>
            </div>
          </div>
          
          <div className={styles.demoItem}>
            <span className={styles.demoLabel}>Client:</span>
            <div>
              <span className={styles.demoValue}>client / client123</span>
              <button 
                onClick={() => handleDemoLogin('client')}
                style={{ 
                  marginLeft: '0.5rem', 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Try
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.registerLink}>
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className={styles.link}>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
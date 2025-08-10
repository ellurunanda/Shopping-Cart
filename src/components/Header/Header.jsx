import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Package, Shield } from 'lucide-react';
import { logout } from '../../redux/authSlice';
import { ROUTES } from '../../routes';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { totalItems } = useSelector(state => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.PRODUCTS} className={styles.logo}>
          <Package size={28} />
          <span>ShopCart Pro</span>
        </Link>

        <nav className={styles.nav}>
          <Link 
            to={ROUTES.PRODUCTS} 
            className={`${styles.navLink} ${isActive(ROUTES.PRODUCTS) ? styles.active : ''}`}
          >
            Products
          </Link>
          
          {user?.role === 'admin' && (
            <Link 
              to={ROUTES.ADMIN_ADD_PRODUCT} 
              className={`${styles.navLink} ${isActive(ROUTES.ADMIN_ADD_PRODUCT) ? styles.active : ''}`}
            >
              Add Product
            </Link>
          )}
        </nav>

        <div className={styles.userInfo}>
          <div className={`${styles.userBadge} ${user?.role === 'admin' ? styles.adminBadge : ''}`}>
            {user?.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
            <span>{user?.name}</span>
            {user?.role === 'admin' && <span>(Admin)</span>}
          </div>

          <button 
            onClick={() => navigate(ROUTES.CART)} 
            className={styles.cartButton}
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>
                {totalItems}
              </span>
            )}
          </button>

          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
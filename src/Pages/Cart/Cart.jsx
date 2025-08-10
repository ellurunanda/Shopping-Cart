import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Truck, Package } from 'lucide-react';
import { clearCart } from '../../redux/cartSlice';
import CartItem from '../../components/CartItem/CartItem';
import { ROUTES } from '../../routes';
import styles from './Cart.module.css';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector(state => state.cart);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!\n\nThis is a demo application.');
  };

  const shipping = totalPrice > 50 ? 0 : 8.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <ShoppingCart size={80} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyDescription}>
            Looks like you haven't added anything to your cart yet.
            Discover amazing products and start shopping!
          </p>
          <Link to={ROUTES.PRODUCTS} className={styles.shopButton}>
            <Package size={20} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <ShoppingCart size={40} />
          Shopping Cart ({totalItems} items)
        </h1>
        <button onClick={handleClearCart} className={styles.clearButton}>
          <Trash2 size={18} />
          Clear Cart
        </button>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
            <span className={styles.summaryValue}>${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Shipping</span>
            <span className={styles.summaryValue}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Tax</span>
            <span className={styles.summaryValue}>${tax.toFixed(2)}</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Total</span>
            <span className={styles.summaryValue}>${finalTotal.toFixed(2)}</span>
          </div>

          <div className={styles.deliveryInfo}>
            <div className={styles.deliveryTitle}>
              <Truck size={16} />
              Delivery Information
            </div>
            <p>
              {shipping === 0 
                ? 'Free shipping on orders over $50!'
                : 'Add $' + (50 - totalPrice).toFixed(2) + ' more for free shipping'
              }
            </p>
            <p>Estimated delivery: 3-5 business days</p>
          </div>

          <button onClick={handleCheckout} className={styles.checkoutButton}>
            <CreditCard size={24} />
            Proceed to Checkout
          </button>

          <Link to={ROUTES.PRODUCTS} className={styles.continueButton}>
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
import React from 'react';
import { useDispatch } from 'react-redux';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { updateQuantity, removeFromCart } from '../../redux/cartSlice';
import styles from './CartItem.module.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className={styles.cartItem}>
      <img 
        src={item.thumbnail || item.images?.[0]} 
        alt={item.title}
        className={styles.image}
      />
      
      <div className={styles.details}>
        <div className={styles.brand}>{item.brand || item.category}</div>
        <h3 className={styles.title}>{item.title}</h3>
        <div className={styles.price}>${item.price}</div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.quantityControls}>
          <button 
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button 
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus size={18} />
          </button>
        </div>
        
        <button 
          className={styles.removeButton}
          onClick={handleRemove}
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className={styles.subtotal}>
        <div className={styles.subtotalLabel}>Subtotal</div>
        <div className={styles.subtotalAmount}>${subtotal}</div>
      </div>
    </div>
  );
};

export default CartItem;
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { addToCart } from '../../redux/cartSlice';
import { getProductDetailRoute } from '../../routes';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleCardClick = () => {
    navigate(getProductDetailRoute(product.id));
  };

  const discountPercentage = product.discountPercentage || 0;
  const originalPrice = Math.round(product.price / (1 - discountPercentage / 100));
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={styles.star}
        fill={index < Math.floor(rating) ? '#fbbf24' : 'none'} 
      />
    ));
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', className: styles.outOfStock };
    if (stock <= 10) return { text: `Only ${stock} left`, className: styles.lowStock };
    return { text: `${stock} in stock`, className: styles.stock };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img 
          src={product.thumbnail || product.images?.[0]} 
          alt={product.title}
          className={styles.image}
          onError={e => { e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
        />
        {discountPercentage > 0 && (
          <div className={styles.discount}>
            -{Math.round(discountPercentage)}%
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.brand}>{product.brand || product.category}</div>
        <h3 className={styles.title}>{product.title}</h3>
        
        <div className={styles.rating}>
          <div className={styles.stars}>
            {renderStars(product.rating)}
          </div>
          <span className={styles.ratingText}>
            {product.rating} ({Math.floor(Math.random() * 100) + 10} reviews)
          </span>
        </div>
        
        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <div className={styles.price}>${product.price}</div>
            {discountPercentage > 0 && (
              <div className={styles.originalPrice}>${originalPrice}</div>
            )}
            <div className={stockStatus.className}>{stockStatus.text}</div>
          </div>
          
          <button 
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Plus size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Loader, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { fetchProductById, clearCurrentProduct } from '../../redux/productSlice';
import { addToCart } from '../../redux/cartSlice';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '../../routes';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, loading, error } = useSelector(state => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct?.images) {
      setSelectedImage(0);
    }
  }, [currentProduct]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Product not found
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(currentProduct));
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={20} 
        className={styles.star}
        fill={index < Math.floor(rating) ? '#fbbf24' : 'none'} 
      />
    ));
  };

  const getStockInfo = (stock) => {
    if (stock === 0) {
      return { 
        text: 'Out of Stock', 
        icon: <XCircle size={20} />, 
        className: styles.outOfStock 
      };
    }
    if (stock <= 10) {
      return { 
        text: `Only ${stock} left in stock`, 
        icon: <AlertCircle size={20} />, 
        className: styles.lowStock 
      };
    }
    return { 
      text: `${stock} in stock`, 
      icon: <CheckCircle size={20} />, 
      className: styles.inStock 
    };
  };

  const stockInfo = getStockInfo(currentProduct.stock);
  const discountPercentage = currentProduct.discountPercentage || 0;
  const originalPrice = discountPercentage > 0 
    ? Math.round(currentProduct.price / (1 - discountPercentage / 100))
    : null;

  const images = currentProduct.images || [currentProduct.thumbnail];

  return (
    <div className={styles.container}>
      <Link to={ROUTES.PRODUCTS} className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Products
      </Link>

      <div className={styles.productDetail}>
        <div className={styles.productContent}>
          <div className={styles.imageSection}>
            <img
              src={images[selectedImage]}
              alt={currentProduct.title}
              className={styles.mainImage}
            />
            
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${currentProduct.title} ${index + 1}`}
                    className={`${styles.thumbnail} ${index === selectedImage ? styles.active : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.brand}>
              {currentProduct.brand || currentProduct.category}
            </div>
            
            <h1 className={styles.title}>{currentProduct.title}</h1>
            
            <div className={styles.rating}>
              <div className={styles.stars}>
                {renderStars(currentProduct.rating)}
              </div>
              <span className={styles.ratingText}>
                {currentProduct.rating} ({Math.floor(Math.random() * 500) + 50} reviews)
              </span>
            </div>
            
            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>${currentProduct.price}</span>
              {originalPrice && (
                <>
                  <span className={styles.originalPrice}>${originalPrice}</span>
                  <span className={styles.discount}>-{Math.round(discountPercentage)}%</span>
                </>
              )}
            </div>
            
            <p className={styles.description}>{currentProduct.description}</p>
            
            <div className={styles.specifications}>
              <h3 className={styles.specsTitle}>Product Details</h3>
              <div className={styles.specsList}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Brand</span>
                  <span className={styles.specValue}>{currentProduct.brand || 'Not specified'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Category</span>
                  <span className={styles.specValue}>{currentProduct.category}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Weight</span>
                  <span className={styles.specValue}>{currentProduct.weight || 'Not specified'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Dimensions</span>
                  <span className={styles.specValue}>
                    {currentProduct.dimensions 
                      ? `${currentProduct.dimensions.width}×${currentProduct.dimensions.height}×${currentProduct.dimensions.depth} cm`
                      : 'Not specified'
                    }
                  </span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Warranty</span>
                  <span className={styles.specValue}>{currentProduct.warrantyInformation || 'Standard warranty'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Return Policy</span>
                  <span className={styles.specValue}>{currentProduct.returnPolicy || '30 days return'}</span>
                </div>
              </div>
            </div>
            
            <div className={`${styles.stockInfo} ${stockInfo.className}`}>
              {stockInfo.icon}
              <span>{stockInfo.text}</span>
            </div>
            
            <div className={styles.addToCartSection}>
              <div className={styles.quantitySelector}>
                <span className={styles.quantityLabel}>Quantity:</span>
                <div className={styles.quantityControls}>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className={styles.quantity}>{quantity}</span>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                    disabled={quantity >= currentProduct.stock}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <button 
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
              >
                <ShoppingCart size={24} />
                {currentProduct.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
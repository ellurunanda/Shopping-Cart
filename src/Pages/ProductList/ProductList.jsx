import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Package, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { 
  fetchProducts, 
  fetchCategories, 
  searchProducts, 
  fetchProductsByCategory,
  setSearchQuery,
  setSelectedCategory
} from '../../redux/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './ProductList.module.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { 
    items, 
    categories, 
    loading, 
    error, 
    searchQuery, 
    selectedCategory,
    total 
  } = useSelector(state => state.products);

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // ---- Normalize data shapes safely ----
  const safeItems = React.useMemo(() => {
    if (Array.isArray(items)) return items;
    if (Array.isArray(items?.products)) return items.products;   // DummyJSON style
    if (Array.isArray(items?.items)) return items.items;         // some APIs use items
    return [];
  }, [items]);

  const safeCategories = React.useMemo(() => {
    if (Array.isArray(categories)) return categories;
    if (Array.isArray(categories?.categories)) return categories.categories; // DummyJSON style
    return [];
  }, [categories]);

  const safeTotal = typeof total === 'number' ? total : safeItems.length;

  const handleClear = useCallback(() => {
    setLocalSearchQuery('');
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory(''));
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(setSearchQuery(debouncedSearchQuery));
      dispatch(searchProducts(debouncedSearchQuery));
    } else if (debouncedSearchQuery === '') {
      handleClear();
    }
  }, [debouncedSearchQuery, dispatch, handleClear]);

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery));
      dispatch(searchProducts(localSearchQuery));
    } else {
      handleClear();
    }
  };

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
    if (category) {
      dispatch(fetchProductsByCategory(category));
    } else {
      dispatch(fetchProducts());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ---- Sorting with safe fallbacks ----
  const sortedItems = React.useMemo(() => {
    const itemsCopy = safeItems.slice();
    const getTitle = (p) => (p?.title ?? p?.name ?? '').toString();
    const getPrice = (p) => Number.isFinite(p?.price) ? p.price : Number(p?.price) || 0;
    const getRating = (p) => Number.isFinite(p?.rating) ? p.rating : Number(p?.rating) || 0;

    switch (sortBy) {
      case 'price-low':
        return itemsCopy.sort((a, b) => getPrice(a) - getPrice(b));
      case 'price-high':
        return itemsCopy.sort((a, b) => getPrice(b) - getPrice(a));
      case 'rating':
        return itemsCopy.sort((a, b) => getRating(b) - getRating(a));
      case 'name':
        return itemsCopy.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
      default:
        return itemsCopy;
    }
  }, [safeItems, sortBy]);

  if (loading && safeItems.length === 0) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message="Loading amazing products..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Discover Products</h1>
        <p className={styles.subtitle}>
          Find the perfect products from our curated collection
        </p>
      </div>

      <div className={styles.searchFilters}>
        <div className={styles.searchGroup}>
          <div className={styles.inputGroup}>
            <label htmlFor="search" className={styles.label}>
              Search Products
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, brand, or description..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <select
              id="category"
              value={selectedCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              {safeCategories.map((category, idx) => {
                const val = typeof category === 'object'
                  ? (category.slug ?? category.name ?? String(idx))
                  : String(category);
                const label = typeof category === 'object'
                  ? (category.name ?? category.slug ?? `Category ${idx + 1}`)
                  : (val.charAt(0).toUpperCase() + val.slice(1));
                return (
                  <option key={val} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSearch} className={styles.searchButton}>
            <Search size={18} />
            Search
          </button>
          <button onClick={handleClear} className={styles.clearButton}>
            <X size={18} />
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      <div className={styles.resultsInfo}>
        <div className={styles.resultCount}>
          {safeTotal > 0 ? `Showing ${sortedItems.length} of ${safeTotal} products` : 'No products found'}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory && ` in "${selectedCategory}"`}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="default">Sort by Default</option>
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {sortedItems.length > 0 ? (
        <div className={styles.grid}>
          {sortedItems.map((product, index) => (
            <ProductCard
              key={product.id ?? product._id ?? product.sku ?? `${(product.title || product.name || 'item')}-${index}`}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <Package size={64} className={styles.noResultsIcon} />
          <h3>No products found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;

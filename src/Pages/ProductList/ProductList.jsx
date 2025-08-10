import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Loader, Package, X } from 'lucide-react';
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

  const sortedItems = React.useMemo(() => {
    const itemsCopy = [...items];
    switch (sortBy) {
      case 'price-low':
        return itemsCopy.sort((a, b) => a.price - b.price);
      case 'price-high':
        return itemsCopy.sort((a, b) => b.price - a.price);
      case 'rating':
        return itemsCopy.sort((a, b) => b.rating - a.rating);
      case 'name':
        return itemsCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return itemsCopy;
    }
  }, [items, sortBy]);

  if (loading && items.length === 0) {
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
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option 
                  key={typeof category === 'object' ? category.slug : category} 
                  value={typeof category === 'object' ? category.slug : category}
                >
                  {typeof category === 'object' 
                    ? category.name 
                    : category.charAt(0).toUpperCase() + category.slice(1)
                  }
                </option>
              ))}
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
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className={styles.resultsInfo}>
        <div className={styles.resultCount}>
          {total > 0 ? `Showing ${sortedItems.length} of ${total} products` : 'No products found'}
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
          {sortedItems.map(product => (
            <ProductCard key={product.id} product={product} />
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
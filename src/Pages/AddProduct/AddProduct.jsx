import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Upload, X, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { addProduct } from '../../redux/productSlice';
import { ROUTES } from '../../routes';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector(state => state.products);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    brand: '',
    category: '',
    stock: '',
    rating: '',
    weight: '',
    dimensions: {
      width: '',
      height: '',
      depth: ''
    },
    warrantyInformation: '',
    shippingInformation: '',
    returnPolicy: ''
  });

  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: event.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dragOver);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragOver);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragOver);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: event.target.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating) || 4.5,
        weight: parseFloat(formData.weight) || 1,
        dimensions: {
          width: parseFloat(formData.dimensions.width) || 10,
          height: parseFloat(formData.dimensions.height) || 10,
          depth: parseFloat(formData.dimensions.depth) || 5
        },
        images: images.map(img => img.url),
        thumbnail: images[0]?.url || 'https://via.placeholder.com/300x300?text=Product'
      };

      await dispatch(addProduct(productData)).unwrap();
      setSuccess(true);
      
      setTimeout(() => {
        navigate(ROUTES.PRODUCTS);
      }, 2000);
    } catch (err) {
      setError('Failed to add product. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.adminBadge}>
          <Shield size={16} />
          Admin Panel
        </div>
        <h1 className={styles.title}>
          <Plus size={40} />
          Add New Product
        </h1>
        <p className={styles.subtitle}>
          Create a new product listing for your store
        </p>
      </div>

      {success && (
        <div className={styles.success}>
          <CheckCircle size={20} />
          Product added successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Product Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              required
              placeholder="Enter product title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand" className={styles.label}>
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter brand name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price ($) <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={styles.input}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="discountPercentage" className={styles.label}>
              Discount Percentage
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              className={styles.input}
              min="0"
              max="100"
              placeholder="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option 
                  key={typeof category === 'object' ? category.slug : category} 
                  value={typeof category === 'object' ? category.slug : category}
                >
                  {typeof category === 'object' 
                    ? category.name 
                    : (typeof category === 'string' ? category.charAt(0).toUpperCase() + category.slice(1) : category)
                  }
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stock" className={styles.label}>
              Stock Quantity <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={styles.input}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="weight" className={styles.label}>
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className={styles.input}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rating" className={styles.label}>
              Rating (1-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className={styles.input}
              min="1"
              max="5"
              step="0.1"
              placeholder="4.5"
            />
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="description" className={styles.label}>
              Product Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              required
              placeholder="Describe the product features, benefits, and specifications..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Dimensions (cm)</label>
            <div className={styles.dimensionsGrid}>
              <input
                type="number"
                name="dimensions.width"
                value={formData.dimensions.width}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Width"
                min="0"
                step="0.1"
              />
              <input
                type="number"
                name="dimensions.height"
                value={formData.dimensions.height}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Height"
                min="0"
                step="0.1"
              />
              <input
                type="number"
                name="dimensions.depth"
                value={formData.dimensions.depth}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Depth"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="warrantyInformation" className={styles.label}>
              Warranty Information
            </label>
            <input
              type="text"
              id="warrantyInformation"
              name="warrantyInformation"
              value={formData.warrantyInformation}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g., 1 year manufacturer warranty"
            />
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label className={styles.label}>Product Images</label>
            <div
              className={styles.imageUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('imageInput').click()}
            >
              <Upload size={48} className={styles.uploadIcon} />
              <div className={styles.uploadText}>
                Click to upload or drag and drop images
              </div>
              <div className={styles.uploadHint}>
                PNG, JPG, GIF up to 10MB each
              </div>
              <input
                type="file"
                id="imageInput"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.hiddenInput}
              />
            </div>

            {images.length > 0 && (
              <div className={styles.imagePreview}>
                {images.map(image => (
                  <div key={image.id} className={styles.previewItem}>
                    <img
                      src={image.url}
                      alt="Product preview"
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className={styles.removeImage}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="returnPolicy" className={styles.label}>
              Return Policy
            </label>
            <input
              type="text"
              id="returnPolicy"
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g., 30 days return policy"
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Link to={ROUTES.PRODUCTS} className={styles.cancelButton}>
            <ArrowLeft size={18} />
            Cancel
          </Link>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <Plus size={18} />
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
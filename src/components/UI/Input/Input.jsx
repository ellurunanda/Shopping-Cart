import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  label,
  error,
  className = '',
  required = false,
  ...props 
}) => {
  const inputClass = `
    ${styles.input} 
    ${error ? styles.error : ''} 
    ${className}
  `.trim();

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input className={inputClass} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
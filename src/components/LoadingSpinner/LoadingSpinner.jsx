import React from 'react';
import { Loader } from 'lucide-react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <Loader size={48} className={styles.icon} />
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
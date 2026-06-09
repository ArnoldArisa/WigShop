import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.title}>Page not found</p>
      <p className={styles.sub}>The page you're looking for doesn't exist or has been moved.</p>
      <div className={styles.actions}>
        <Link to="/home" className={styles.btnPrimary}>Go home</Link>
        <Link to="/shop" className={styles.btnSecondary}>Browse wigs</Link>
      </div>
    </div>
  );
}

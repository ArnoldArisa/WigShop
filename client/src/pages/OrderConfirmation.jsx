import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './OrderConfirmation.module.css';

export default function OrderConfirmation() {
  const { id } = useParams();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Order placed!</h1>
        <p className={styles.sub}>
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className={styles.orderId}>Order <span>#{id}</span></p>
        <div className={styles.actions}>
          <Link to="/shop" className={styles.btnPrimary}>Continue shopping</Link>
          <Link to="/home" className={styles.btnSecondary}>Back to home</Link>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Checkout.module.css';

const money = cents => `$${(cents / 100).toFixed(2)}`;

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/cart', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          navigate('/cart');
        } else {
          setCart(data);
        }
      })
      .catch(() => setError('Could not load cart.'));
  }, [navigate]);

  const placeOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      navigate(`/order-confirmation/${data.orderId}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return (
    <div className={styles.page}>
      <div className="container"><p className={styles.loading}>Loading…</p></div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/cart" className={styles.back}>← Back to cart</Link>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          {/* Order summary */}
          <div className={styles.summary}>
            <h2 className={styles.sectionTitle}>Order summary</h2>
            <div className={styles.items}>
              {cart.items.map(item => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={item.image_url || 'https://placehold.co/80x96/E8E2D9/111111?text=Wig'}
                    alt={item.name}
                    className={styles.itemImg}
                  />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.itemPrice}>{money(item.price_cents * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>{money(cart.subtotal_cents)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span className={styles.free}>Free</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>{money(cart.subtotal_cents)}</span>
              </div>
            </div>
          </div>

          {/* Place order */}
          <div className={styles.actions}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.paymentNote}>
              This is a demo store — no real payment is processed.
            </p>
            {error && <p className={styles.error}>{error}</p>}
            <button
              className={styles.placeOrderBtn}
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? 'Placing order…' : `Place order — ${money(cart.subtotal_cents)}`}
            </button>
            <p className={styles.secure}>🔒 Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

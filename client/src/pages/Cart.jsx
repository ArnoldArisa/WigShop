import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cart.module.css';

const money = cents => `$${(cents / 100).toFixed(2)}`;

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/cart', { credentials: 'include' });
      const data = await res.json();
      setCart(data);
    } catch {
      setError('Could not load cart.');
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (id, quantity) => {
    await fetch(`http://localhost:4000/api/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  const removeItem = async (id) => {
    await fetch(`http://localhost:4000/api/cart/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchCart();
  };

  if (!cart) return <div className={styles.page}><p className={styles.loading}>Loading cart…</p></div>;

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Your cart</h1>

        {error && <p className={styles.error}>{error}</p>}

        {cart.items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link to="/shop" className={styles.shopLink}>Browse wigs →</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              {cart.items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>{money(item.price_cents)}</p>
                  </div>
                  <div className={styles.itemControls}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <p className={styles.subtotal}>Subtotal <span>{money(cart.subtotal_cents)}</span></p>
              <Link to="/checkout" className={styles.checkoutBtn}>Proceed to checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

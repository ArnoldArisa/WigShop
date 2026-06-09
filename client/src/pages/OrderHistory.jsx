import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './OrderHistory.module.css';

const money = cents => `$${(cents / 100).toFixed(2)}`;

const statusClass = s => ({
  pending:   styles.statusPending,
  shipped:   styles.statusShipped,
  delivered: styles.statusDelivered,
}[s?.toLowerCase()] || styles.statusPending);

export default function OrderHistory() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/orders', { credentials: 'include' })
      .then(r => r.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  if (!orders) return <div className={styles.page}><div className="container"><p className={styles.loading}>Loading…</p></div></div>;

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Your orders</h1>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>You haven't placed any orders yet.</p>
            <Link to="/shop" className={styles.shopLink}>Browse wigs →</Link>
          </div>
        ) : (
          <div className={styles.orders}>
            {orders.map(order => (
              <div key={order.id} className={styles.order}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={`${styles.status} ${statusClass(order.status)}`}>{order.status}</span>
                    <span className={styles.orderTotal}>{money(order.total_cents)}</span>
                  </div>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.item}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>× {item.quantity}</span>
                      <span className={styles.itemPrice}>{money(item.price_cents * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

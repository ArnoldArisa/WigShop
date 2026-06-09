import { useState } from 'react';
import styles from './Admin.module.css';

const INITIAL = [
  { id: '#1008', customer: 'Arisa A.', product: 'Silk Wave Lace Front', amount: '$189', date: 'May 27', status: 'Pending' },
  { id: '#1007', customer: 'Jane M.', product: 'Velvet Coil Bob', amount: '$149', date: 'May 26', status: 'Shipped' },
  { id: '#1006', customer: 'Grace T.', product: 'Golden Hour Straight', amount: '$210', date: 'May 25', status: 'Delivered' },
  { id: '#1005', customer: 'Lena K.', product: 'Midnight Curl', amount: '$175', date: 'May 24', status: 'Delivered' },
  { id: '#1004', customer: 'Mia R.', product: 'Copper Glam Bob', amount: '$160', date: 'May 23', status: 'Delivered' },
];

const STATUSES = ['All', 'Pending', 'Shipped', 'Delivered'];

const statusClass = s => ({
  Pending: styles.statusPending,
  Shipped: styles.statusShipped,
  Delivered: styles.statusDelivered,
}[s] || '');

export default function Orders() {
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState(INITIAL);

  const visible = orders.filter(o => filter === 'All' || o.status === filter);

  const updateStatus = (id, status) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Orders</h1>

      <div className={styles.filterRow}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ''}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map(o => (
              <tr key={o.id}>
                <td className={styles.mono}>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.product}</td>
                <td>{o.amount}</td>
                <td>{o.date}</td>
                <td><span className={`${styles.status} ${statusClass(o.status)}`}>{o.status}</span></td>
                <td>
                  <select
                    className={styles.statusSelect}
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                  >
                    {['Pending', 'Shipped', 'Delivered'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

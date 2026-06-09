import styles from './Admin.module.css';

const STATS = [
  { label: 'Total revenue', value: '$4,280', sub: '+12% this month' },
  { label: 'Total cost',    value: '$2,090', sub: 'cost of goods sold' },
  { label: 'Profit',        value: '$2,190', sub: '51% margin', highlight: true },
  { label: 'Orders',        value: '38',     sub: '4 pending' },
  { label: 'Products',      value: '6',      sub: '1 out of stock' },
  { label: 'Customers',     value: '24',     sub: '3 new this week' },
];

const RECENT_ORDERS = [
  { id: '#1008', customer: 'Arisa A.', product: 'Silk Wave Lace Front', amount: '$189', status: 'Pending' },
  { id: '#1007', customer: 'Jane M.', product: 'Velvet Coil Bob', amount: '$149', status: 'Shipped' },
  { id: '#1006', customer: 'Grace T.', product: 'Golden Hour Straight', amount: '$210', status: 'Delivered' },
  { id: '#1005', customer: 'Lena K.', product: 'Midnight Curl', amount: '$175', status: 'Delivered' },
];

const statusClass = s => ({
  Pending: styles.statusPending,
  Shipped: styles.statusShipped,
  Delivered: styles.statusDelivered,
}[s] || '');

export default function Dashboard() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <div key={s.label} className={`${styles.statCard} ${s.highlight ? styles.statCardHighlight : ''}`}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statSub}>{s.sub}</p>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Recent orders</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map(o => (
              <tr key={o.id}>
                <td className={styles.mono}>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.product}</td>
                <td>{o.amount}</td>
                <td><span className={`${styles.status} ${statusClass(o.status)}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

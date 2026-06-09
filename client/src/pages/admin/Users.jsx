import styles from './Admin.module.css';

const USERS = [
  { id: 1, name: 'Arisa A.', email: 'arisa@example.com', role: 'Customer', joined: 'May 20', orders: 3 },
  { id: 2, name: 'Jane M.', email: 'jane@example.com', role: 'Customer', joined: 'May 22', orders: 1 },
  { id: 3, name: 'Grace T.', email: 'grace@example.com', role: 'Customer', joined: 'May 23', orders: 2 },
  { id: 4, name: 'Lena K.', email: 'lena@example.com', role: 'Customer', joined: 'May 24', orders: 1 },
  { id: 5, name: 'Admin', email: 'admin@wigshop.test', role: 'Admin', joined: 'May 1', orders: 0 },
];

export default function Users() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Users</h1>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td className={styles.mono}>{u.email}</td>
                <td>
                  <span className={`${styles.status} ${u.role === 'Admin' ? styles.statusShipped : styles.statusDelivered}`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.joined}</td>
                <td>{u.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

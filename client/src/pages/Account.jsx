import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Account.module.css';

const money = cents => `$${(cents / 100).toFixed(2)}`;

const statusClass = s => ({
  pending:   styles.statusPending,
  shipped:   styles.statusShipped,
  delivered: styles.statusDelivered,
}[s?.toLowerCase()] || styles.statusPending);

const TABS = ['Profile', 'Password', 'Orders', 'Danger zone'];

export default function Account() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Profile');

  // Profile
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Orders
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', email: user.email });
  }, [user]);

  useEffect(() => {
    if (tab === 'Orders' && !orders) {
      fetch('http://localhost:4000/api/orders', { credentials: 'include' })
        .then(r => r.json())
        .then(setOrders)
        .catch(() => setOrders([]));
    }
  }, [tab, orders]);

  const saveProfile = async () => {
    setProfileMsg(''); setProfileErr(''); setProfileSaving(true);
    try {
      const res = await fetch('http://localhost:4000/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) { setProfileErr(data.error); return; }
      setUser(data);
      setProfileMsg('Profile updated.');
    } catch { setProfileErr('Could not connect to server.'); }
    finally { setProfileSaving(false); }
  };

  const savePassword = async () => {
    setPasswordMsg(''); setPasswordErr(''); setPasswordSaving(true);
    try {
      const res = await fetch('http://localhost:4000/api/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordErr(data.error); return; }
      setPasswords({ currentPassword: '', newPassword: '' });
      setPasswordMsg('Password updated.');
    } catch { setPasswordErr('Could not connect to server.'); }
    finally { setPasswordSaving(false); }
  };

  const deleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all your data. Are you sure?')) return;
    await fetch('http://localhost:4000/api/account', { method: 'DELETE', credentials: 'include' });
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>My account</h1>
        {user && <p className={styles.sub}>Signed in as <strong>{user.email}</strong></p>}

        <div className={styles.layout}>
          {/* Sidebar tabs */}
          <aside className={styles.sidebar}>
            {TABS.map(t => (
              <button
                key={t}
                className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''} ${t === 'Danger zone' ? styles.tabDanger : ''}`}
                onClick={() => setTab(t)}
              >{t}</button>
            ))}
          </aside>

          {/* Content */}
          <div className={styles.content}>

            {tab === 'Profile' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Profile details</h2>
                <div className={styles.fields}>
                  <label className={styles.label}>
                    Name
                    <input className={styles.input} type="text" value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                  </label>
                  <label className={styles.label}>
                    Email
                    <input className={styles.input} type="email" value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" required />
                  </label>
                </div>
                {profileErr && <p className={styles.error}>{profileErr}</p>}
                {profileMsg && <p className={styles.success}>{profileMsg}</p>}
                <button className={styles.btn} onClick={saveProfile} disabled={profileSaving}>
                  {profileSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            )}

            {tab === 'Password' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Change password</h2>
                <div className={styles.fields}>
                  <label className={styles.label}>
                    Current password
                    <input className={styles.input} type="password" value={passwords.currentPassword}
                      onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} placeholder="••••••••" />
                  </label>
                  <label className={styles.label}>
                    New password
                    <input className={styles.input} type="password" value={passwords.newPassword}
                      onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} placeholder="••••••••" />
                  </label>
                </div>
                {passwordErr && <p className={styles.error}>{passwordErr}</p>}
                {passwordMsg && <p className={styles.success}>{passwordMsg}</p>}
                <button className={styles.btn} onClick={savePassword} disabled={passwordSaving}>
                  {passwordSaving ? 'Updating…' : 'Update password'}
                </button>
              </div>
            )}

            {tab === 'Orders' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Order history</h2>
                {!orders && <p className={styles.muted}>Loading…</p>}
                {orders?.length === 0 && <p className={styles.muted}>No orders yet.</p>}
                {orders?.map(order => (
                  <div key={order.id} className={styles.order}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderId}>Order #{order.id}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
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

            {tab === 'Danger zone' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Danger zone</h2>
                <p className={styles.muted}>Deleting your account is permanent and cannot be undone. All your orders and data will be removed.</p>
                <button className={styles.btnDanger} onClick={deleteAccount}>Delete my account</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

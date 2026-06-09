import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/home" className={styles.brand}>Strand &amp; Style</Link>
        <nav className={styles.nav}>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          {user ? (
            <>
              <Link to="/account">{user.name || 'Account'}</Link>
              <Link to="/orders">Orders</Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

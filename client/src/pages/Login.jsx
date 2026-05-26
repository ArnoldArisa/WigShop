import { useState } from 'react';
import styles from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    // API call goes here
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Log in to your Strand &amp; Style account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          <button className={styles.btn} type="submit">Log in</button>
        </form>

        <p className={styles.footer}>
          Don't have an account? <a href="/register" className={styles.link}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

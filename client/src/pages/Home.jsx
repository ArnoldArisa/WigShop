import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const money = cents => `$${(cents / 100).toFixed(0)}`;

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(r => r.json())
      .then(data => setFeatured(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.heroEyebrow}>New arrivals</p>
          <h1 className={styles.heroHeading}>Hair that moves<br />with you.</h1>
          <p className={styles.heroSub}>Premium wigs crafted for every style, texture, and occasion.</p>
          <Link to="/shop" className={styles.heroBtn}>Shop the collection</Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className={styles.featured}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Featured styles</h2>
            <div className={styles.grid}>
              {featured.map(p => (
                <Link to={`/product/${p.id}`} key={p.id} className={styles.card}>
                  <img
                    src={p.image_url || 'https://placehold.co/400x500/E8E2D9/111111?text=Wig'}
                    alt={p.name}
                    className={styles.cardImg}
                  />
                  <div className={styles.cardBody}>
                    <span className={styles.cardName}>{p.name}</span>
                    <span className={styles.cardPrice}>{money(p.price_cents)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.viewAll}>
              <Link to="/shop" className={styles.viewAllLink}>View all styles →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand blurb */}
      <section className={styles.about}>
        <div className={`container ${styles.aboutInner}`}>
          <h2 className={styles.aboutHeading}>Why Strand &amp; Style?</h2>
          <p className={styles.aboutText}>
            We believe great hair is an act of self-expression. Every piece in our collection
            is selected for quality, comfort, and versatility — so you can wear it your way.
          </p>
          <Link to="/shop" className={styles.aboutBtn}>Explore all wigs</Link>
        </div>
      </section>
    </div>
  );
}

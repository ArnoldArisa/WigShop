import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Shop.module.css';

const money = cents => `$${(cents / 100).toFixed(0)}`;

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price_cents - b.price_cents;
      if (sort === 'price_desc') return b.price_cents - a.price_cents;
      return 0;
    });

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>All wigs</h1>
          <span className={styles.count}>{filtered.length} styles</span>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search wigs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.categories}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.catBtn} ${category === cat ? styles.catActive : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.toolbarRight}>
            <select
              className={styles.sort}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >⊞</button>
              <button
                className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`}
                onClick={() => setView('list')}
                title="List view"
              >☰</button>
            </div>
          </div>
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <p className={styles.empty}>No wigs match your search.</p>
        )}

        {/* Grid view */}
        {view === 'grid' && (
          <div className={styles.grid}>
            {filtered.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className={styles.card}>
                <div className={styles.cardImgWrap}>
                  <img
                    src={p.image_url || 'https://placehold.co/400x500/E8E2D9/111111?text=Wig'}
                    alt={p.name}
                    className={styles.cardImg}
                  />
                  {p.stock === 0 && <span className={styles.outOfStockBadge}>Out of stock</span>}
                </div>
                <div className={styles.cardBody}>
                  <div>
                    <p className={styles.cardCategory}>{p.category}</p>
                    <p className={styles.cardName}>{p.name}</p>
                  </div>
                  <p className={styles.cardPrice}>{money(p.price_cents)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className={styles.list}>
            {filtered.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className={styles.listItem}>
                <img
                  src={p.image_url || 'https://placehold.co/400x500/E8E2D9/111111?text=Wig'}
                  alt={p.name}
                  className={styles.listImg}
                />
                <div className={styles.listInfo}>
                  <p className={styles.cardCategory}>{p.category}</p>
                  <p className={styles.listName}>{p.name}</p>
                </div>
                <div className={styles.listRight}>
                  {p.stock === 0 && <span className={styles.outOfStockBadge}>Out of stock</span>}
                  <p className={styles.cardPrice}>{money(p.price_cents)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Product.module.css';

const money = cents => `$${(cents / 100).toFixed(0)}`;

function getEmbedUrl(url) {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('photo');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setProduct)
      .catch(() => setError('Product not found.'));
  }, [id]);

  const hasVideo = product && (product.video_url || product.video_file);

  const addToCart = async () => {
    if (!user) { navigate(`/register?next=/product/${id}`); return; }
    setLoading(true);
    setMsg('');
    try {
      await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      setMsg('Added to cart!');
    } catch {
      setMsg('Could not add to cart.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return (
    <div className={styles.page}>
      <div className="container">
        <p className={styles.error}>{error}</p>
        <Link to="/shop" className={styles.back}>← Back to shop</Link>
      </div>
    </div>
  );

  if (!product) return <div className={styles.page}><div className="container"><p>Loading…</p></div></div>;

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/shop" className={styles.back}>← Back to shop</Link>

        <div className={styles.layout}>
          <div className={styles.media}>
            {hasVideo && (
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${tab === 'photo' ? styles.tabActive : ''}`}
                  onClick={() => setTab('photo')}
                >Photo</button>
                <button
                  className={`${styles.tab} ${tab === 'video' ? styles.tabActive : ''}`}
                  onClick={() => setTab('video')}
                >Video</button>
              </div>
            )}

            {tab === 'photo' && (
              <img
                src={product.image_url || 'https://placehold.co/500x600/E8E2D9/111111?text=Wig'}
                alt={product.name}
                className={styles.image}
              />
            )}

            {tab === 'video' && hasVideo && (
              product.video_file ? (
                <video
                  className={styles.video}
                  src={`http://localhost:4000${product.video_file}`}
                  controls
                />
              ) : (
                <iframe
                  className={styles.video}
                  src={getEmbedUrl(product.video_url)}
                  title={product.name}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )
            )}
          </div>

          <div className={styles.info}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>{money(product.price_cents)}</p>

            <p className={styles.stockLabel}>
              {product.stock === 0
                ? <span className={styles.outOfStock}>Out of stock</span>
                : <span className={styles.inStock}>{product.stock} in stock</span>
              }
            </p>

            <div className={styles.qtyRow}>
              <label className={styles.qtyLabel}>Quantity</label>
              <div className={styles.qtyControls}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <button
              className={styles.addBtn}
              onClick={addToCart}
              disabled={loading || product.stock === 0}
            >
              {loading ? 'Adding…' : product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            </button>

            {msg && <p className={styles.msg}>{msg}</p>}
            {msg === 'Added to cart!' && (
              <Link to="/cart" className={styles.viewCart}>View cart →</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

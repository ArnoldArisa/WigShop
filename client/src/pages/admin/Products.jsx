import { useEffect, useState } from 'react';
import styles from './Admin.module.css';

const money = cents => `$${(cents / 100).toFixed(2)}`;

const EMPTY_FORM = { name: '', category: '', price_cents: '', cost_cents: '', stock: '', image_url: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [videoPanel, setVideoPanel] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoSaving, setVideoSaving] = useState(false);

  const fetchProducts = () => {
    fetch('http://localhost:4000/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {});
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setModal('add'); setForm(EMPTY_FORM); setError(''); };
  const openEdit = p => {
    setModal(p);
    setForm({
      name: p.name,
      category: p.category || '',
      price_cents: p.price_cents,
      cost_cents: p.cost_cents || '',
      stock: p.stock,
      image_url: p.image_url || '',
    });
    setError('');
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveProduct = async () => {
    setSaving(true);
    setError('');
    const body = {
      name: form.name,
      category: form.category,
      price_cents: Math.round(Number(form.price_cents) * 100),
      cost_cents: form.cost_cents ? Math.round(Number(form.cost_cents) * 100) : null,
      stock: Number(form.stock),
      image_url: form.image_url || null,
    };
    try {
      const isEdit = modal !== 'add';
      const res = await fetch(
        isEdit ? `http://localhost:4000/api/products/${modal.id}` : 'http://localhost:4000/api/products',
        { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save.'); return; }
      setModal(null);
      fetchProducts();
    } catch {
      setError('Could not connect to server.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async id => {
    if (!confirm('Delete this product?')) return;
    await fetch(`http://localhost:4000/api/products/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchProducts();
  };

  const saveVideo = async (productId) => {
    setVideoSaving(true);
    try {
      if (videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);
        await fetch(`http://localhost:4000/api/products/${productId}/video`, { method: 'POST', credentials: 'include', body: formData });
      } else {
        await fetch(`http://localhost:4000/api/products/${productId}/video`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ video_url: videoUrl || null }),
        });
      }
      setVideoPanel(null);
      fetchProducts();
    } finally {
      setVideoSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Products</h1>
        <button className={styles.btnPrimary} onClick={openAdd}>+ Add product</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Cost</th><th>Stock</th><th>Video</th><th></th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <>
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category || '—'}</td>
                  <td>{money(p.price_cents)}</td>
                  <td>{p.cost_cents ? money(p.cost_cents) : '—'}</td>
                  <td><span className={p.stock === 0 ? styles.outOfStock : ''}>{p.stock === 0 ? 'Out of stock' : p.stock}</span></td>
                  <td>{p.video_url || p.video_file ? <span className={styles.videoSet}>✓ Set</span> : <span className={styles.videoNone}>None</span>}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => openEdit(p)}>Edit</button>
                    <button className={styles.btnEdit} onClick={() => { setVideoPanel(p.id); setVideoUrl(p.video_url || ''); setVideoFile(null); }}>
                      {p.video_url || p.video_file ? 'Edit video' : 'Add video'}
                    </button>
                    <button className={styles.btnDelete} onClick={() => deleteProduct(p.id)}>Delete</button>
                  </td>
                </tr>
                {videoPanel === p.id && (
                  <tr key={`${p.id}-video`} className={styles.videoPanelRow}>
                    <td colSpan={7}>
                      <div className={styles.videoPanel}>
                        <p className={styles.videoPanelTitle}>Video for <strong>{p.name}</strong></p>
                        <div className={styles.videoPanelOptions}>
                          <div className={styles.videoPanelOption}>
                            <label className={styles.videoPanelLabel}>YouTube / Vimeo URL</label>
                            <input className={styles.videoPanelInput} type="url" placeholder="https://youtube.com/watch?v=…"
                              value={videoUrl} onChange={e => { setVideoUrl(e.target.value); setVideoFile(null); }} />
                          </div>
                          <div className={styles.videoPanelDivider}>or</div>
                          <div className={styles.videoPanelOption}>
                            <label className={styles.videoPanelLabel}>Upload video file (MP4)</label>
                            <input className={styles.videoPanelFile} type="file" accept="video/*"
                              onChange={e => { setVideoFile(e.target.files[0]); setVideoUrl(''); }} />
                          </div>
                        </div>
                        <div className={styles.videoPanelActions}>
                          <button className={styles.btnPrimary} onClick={() => saveVideo(p.id)} disabled={videoSaving}>
                            {videoSaving ? 'Saving…' : 'Save video'}
                          </button>
                          <button className={styles.btnEdit} onClick={() => setVideoPanel(null)}>Cancel</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{modal === 'add' ? 'Add product' : 'Edit product'}</h2>
            <div className={styles.modalFields}>
              {[
                { label: 'Name', name: 'name', type: 'text', required: true },
                { label: 'Category', name: 'category', type: 'text' },
                { label: 'Price ($)', name: 'price_cents', type: 'number', required: true },
                { label: 'Cost ($)', name: 'cost_cents', type: 'number' },
                { label: 'Stock', name: 'stock', type: 'number' },
                { label: 'Image URL', name: 'image_url', type: 'url' },
              ].map(f => (
                <label key={f.name} className={styles.modalLabel}>
                  {f.label}{f.required && ' *'}
                  <input
                    className={styles.modalInput}
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.label}
                  />
                </label>
              ))}
            </div>
            {error && <p className={styles.modalError}>{error}</p>}
            <div className={styles.modalActions}>
              <button className={styles.btnPrimary} onClick={saveProduct} disabled={saving}>
                {saving ? 'Saving…' : modal === 'add' ? 'Add product' : 'Save changes'}
              </button>
              <button className={styles.btnEdit} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

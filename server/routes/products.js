const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || !req.session.isAdmin) return res.status(403).json({ error: 'Forbidden.' });
  next();
};

router.get('/', (_req, res) => {
  res.json(db.prepare('SELECT * FROM products').all());
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

router.post('/', requireAdmin, (req, res) => {
  const { name, category, price_cents, cost_cents, stock, image_url } = req.body;
  if (!name || !price_cents) return res.status(400).json({ error: 'Name and price are required.' });
  const result = db.prepare(
    'INSERT INTO products (name, category, price_cents, cost_cents, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, category || null, price_cents, cost_cents || null, stock || 0, image_url || null);
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid));
});

router.patch('/:id', requireAdmin, (req, res) => {
  const { name, category, price_cents, cost_cents, stock, image_url } = req.body;
  db.prepare(
    'UPDATE products SET name=?, category=?, price_cents=?, cost_cents=?, stock=?, image_url=? WHERE id=?'
  ).run(name, category || null, price_cents, cost_cents || null, stock, image_url || null, req.params.id);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.patch('/:id/video', requireAdmin, (req, res) => {
  const { video_url } = req.body;
  db.prepare('UPDATE products SET video_url = ?, video_file = NULL WHERE id = ?')
    .run(video_url || null, req.params.id);
  res.json({ ok: true });
});

router.post('/:id/video', requireAdmin, upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  const fileUrl = `/uploads/${req.file.filename}`;
  db.prepare('UPDATE products SET video_file = ?, video_url = NULL WHERE id = ?')
    .run(fileUrl, req.params.id);
  res.json({ ok: true, fileUrl });
});

module.exports = router;

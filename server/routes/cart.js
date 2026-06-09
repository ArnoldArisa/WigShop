const express = require('express');
const db = require('../db');

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in.' });
  next();
};

router.get('/', requireAuth, (req, res) => {
  const items = db.prepare(`
    SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price_cents, p.image_url
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?
  `).all(req.session.userId);

  const subtotal_cents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  res.json({ items, subtotal_cents });
});

router.post('/', requireAuth, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  db.prepare(`
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
  `).run(req.session.userId, productId, quantity);
  res.status(201).json({ ok: true });
});

router.patch('/:id', requireAuth, (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1.' });
  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?')
    .run(quantity, req.params.id, req.session.userId);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.session.userId);
  res.json({ ok: true });
});

module.exports = router;

const express = require('express');
const db = require('../db');

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in.' });
  next();
};

// Get order history for logged-in user
router.get('/', requireAuth, (req, res) => {
  const orders = db.prepare(`
    SELECT o.id, o.total_cents, o.status, o.created_at
    FROM orders o
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `).all(req.session.userId);

  const getItems = db.prepare(`
    SELECT name, quantity, price_cents FROM order_items WHERE order_id = ?
  `);

  const result = orders.map(o => ({ ...o, items: getItems.all(o.id) }));
  res.json(result);
});

// Place a new order
router.post('/', requireAuth, (req, res) => {
  const userId = req.session.userId;

  const items = db.prepare(`
    SELECT ci.quantity, p.id as product_id, p.name, p.price_cents, p.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?
  `).all(userId);

  if (items.length === 0) return res.status(400).json({ error: 'Your cart is empty.' });

  const outOfStock = items.find(i => i.stock < i.quantity);
  if (outOfStock) return res.status(400).json({ error: `"${outOfStock.name}" doesn't have enough stock.` });

  const total_cents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

  const placeOrder = db.transaction(() => {
    const order = db.prepare('INSERT INTO orders (user_id, total_cents) VALUES (?, ?)').run(userId, total_cents);
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, name, quantity, price_cents) VALUES (?, ?, ?, ?, ?)');
    const deductStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    for (const item of items) {
      insertItem.run(order.lastInsertRowid, item.product_id, item.name, item.quantity, item.price_cents);
      deductStock.run(item.quantity, item.product_id);
    }
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
    return order.lastInsertRowid;
  });

  const orderId = placeOrder();
  res.status(201).json({ orderId, total_cents });
});

module.exports = router;

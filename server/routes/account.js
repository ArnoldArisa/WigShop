const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in.' });
  next();
};

router.patch('/profile', requireAuth, (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.session.userId);
  if (existing) return res.status(409).json({ error: 'That email is already in use.' });

  db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name || null, email, req.session.userId);
  const user = db.prepare('SELECT id, name, email, is_admin FROM users WHERE id = ?').get(req.session.userId);
  res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin === 1 });
});

router.patch('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both fields are required.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });

  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.session.userId);
  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });

  const hash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, req.session.userId);
  res.json({ ok: true });
});

router.delete('/', requireAuth, (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.session.userId);
  req.session.destroy(() => res.json({ ok: true }));
});

module.exports = router;

const bcrypt = require('bcrypt');
const db = require('./db');

console.log('Seeding database…');

db.exec(`
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM cart_items;
  DELETE FROM products;
  DELETE FROM users;
`);

const adminHash = bcrypt.hashSync('admin123', 10);
const userHash  = bcrypt.hashSync('hello123', 10);

db.prepare(`INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)`).run('Admin', 'admin@wigshop.test', adminHash, 1);
db.prepare(`INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)`).run('Arisa', 'arisa@example.com', userHash, 0);

const insertProduct = db.prepare(`
  INSERT INTO products (name, category, price_cents, stock, image_url) VALUES (?, ?, ?, ?, ?)
`);

insertProduct.run('Silk Wave Lace Front', 'Lace Front', 18900, 12, 'https://placehold.co/400x500/E8E2D9/111111?text=Wig');
insertProduct.run('Velvet Coil Bob',      'Bob',        14900, 8,  'https://placehold.co/400x500/E8E2D9/111111?text=Wig');
insertProduct.run('Golden Hour Straight', 'Straight',   21000, 5,  'https://placehold.co/400x500/E8E2D9/111111?text=Wig');
insertProduct.run('Midnight Curl',        'Curly',      17500, 0,  'https://placehold.co/400x500/E8E2D9/111111?text=Wig');
insertProduct.run('Copper Glam Bob',      'Bob',        16000, 3,  'https://placehold.co/400x500/E8E2D9/111111?text=Wig');
insertProduct.run('Natural Crown',        'Curly',      19500, 7,  'https://placehold.co/400x500/E8E2D9/111111?text=Wig');

console.log('Done. 6 products and 2 users inserted.');
console.log('Admin:    admin@wigshop.test / admin123');
console.log('Customer: arisa@example.com  / hello123');

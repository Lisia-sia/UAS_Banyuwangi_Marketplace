const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const db = require('./db');

const vendorA = require('./vendor/mahasiswa1');
const vendorB = require('./vendor/mahasiswa2');
const vendorC = require('./vendor/mahasiswa3');

const normalizeAllVendors = require('./integrator/mahasiswa4');

app.use(cors());
app.use(express.json());

app.get('/api/vendor-a', (req, res) => {
  res.json(vendorA);
});

app.get('/api/vendor-b', (req, res) => {
  res.json(vendorB);
});

app.get('/api/vendor-c', (req, res) => {
  res.json(vendorC);
});

app.get('/api/banyuwangi-marketplace', (req, res) => {
  const data = normalizeAllVendors();
  res.json({ total: data.length, data: data });
});

app.post("/api/products", async (req, res) => {
  const { code, name, price, stock, vendor_id, category } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO products (code, name, price, stock, vendor_id, category)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [code, name, price, stock, vendor_id, category]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah produk" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data produk" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, price, stock, vendor_id, category } = req.body;
  try {
    const result = await db.query(
      `UPDATE products 
       SET code=$1, name=$2, price=$3, stock=$4, vendor_id=$5, category=$6
       WHERE id=$7 RETURNING *`,
      [code, name, price, stock, vendor_id, category, id]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Gagal memperbarui produk" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Produk berhasil dihapus" });
  } catch {
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
});

app.get('/', (req, res) => res.send('Server Banyuwangi Marketplace Jalan!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3300;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Banyuwangi Marketplace API is running...");
});

// === AUTH (opsional) ===
app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role`,
      [username, hashed, role]
    );
    res.json({ message: "Registrasi berhasil", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const found = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    if (found.rows.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    const user = found.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Password salah" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login berhasil", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === VENDOR A (Mahasiswa 1) ===
app.get("/api/vendor-a", async (req, res) => {
  const result = await db.query("SELECT * FROM vendor_a_products");
  res.json(result.rows);
});

app.post("/api/vendor-a", async (req, res) => {
  try {
    const { kd_produk, nm_brg, hrg, ket_stok } = req.body;
    const result = await db.query(
      `INSERT INTO vendor_a_products (kd_produk, nm_brg, hrg, ket_stok)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [kd_produk, nm_brg, hrg, ket_stok]
    );
    res.status(201).json({ message: "Produk Vendor A ditambahkan", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/vendor-a/:id", async (req, res) => {
  try {
    const { kd_produk, nm_brg, hrg, ket_stok } = req.body;
    const result = await db.query(
      `UPDATE vendor_a_products
       SET kd_produk=$1, nm_brg=$2, hrg=$3, ket_stok=$4
       WHERE id=$5 RETURNING *`,
      [kd_produk, nm_brg, hrg, ket_stok, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk Vendor A diupdate", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/vendor-a/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM vendor_a_products WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk Vendor A dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === VENDOR B (Mahasiswa 2) ===
app.get("/api/vendor-b", async (req, res) => {
  const result = await db.query("SELECT * FROM vendor_b_products");
  res.json(result.rows);
});

app.post("/api/vendor-b", async (req, res) => {
  try {
    const { sku, product_name, price, is_available } = req.body;
    const result = await db.query(
      `INSERT INTO vendor_b_products (sku, product_name, price, is_available)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sku, product_name, price, is_available]
    );
    res.status(201).json({ message: "Produk Vendor B ditambahkan", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/vendor-b/:id", async (req, res) => {
  try {
    const { sku, product_name, price, is_available } = req.body;
    const result = await db.query(
      `UPDATE vendor_b_products
       SET sku=$1, product_name=$2, price=$3, is_available=$4
       WHERE id=$5 RETURNING *`,
      [sku, product_name, price, is_available, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk Vendor B diupdate", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/vendor-b/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM vendor_b_products WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk Vendor B dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === VENDOR C (Mahasiswa 3) ===
app.get("/api/vendor-c", async (req, res) => {
  const result = await db.query("SELECT * FROM vendor_c_products");
  res.json(result.rows);
});

app.post("/api/vendor-c", async (req, res) => {
  try {
    const { product_code, name, category, base_price, tax, stock } = req.body;
    const result = await db.query(
      `INSERT INTO vendor_c_products (product_code, name, category, base_price, tax, stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [product_code, name, category, base_price, tax, stock]
    );
    res.status(201).json({ message: "Produk Vendor C ditambahkan", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/vendor-c/:id", async (req, res) => {
  try {
    const { product_code, name, category, base_price, tax, stock } = req.body;
    const result = await db.query(
      `UPDATE vendor_c_products
       SET product_code=$1, name=$2, category=$3, base_price=$4, tax=$5, stock=$6
       WHERE id=$7 RETURNING *`,
      [product_code, name, category, base_price, tax, stock, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk Vendor C diupdate", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/vendor-c/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM vendor_c_products WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ message: "Produk Vendor C dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === INTEGRASI (Mahasiswa 4) ===
const { normalize } = require("./integrator/mahasiswa4");

// Ambil data dari DB → normalisasi → kirim
app.get("/api/banyuwangi-marketplace", async (req, res) => {
  try {
    // Ambil data dari DB
    const [a, b, c] = await Promise.all([
      db.query("SELECT * FROM vendor_a_products"),
      db.query("SELECT * FROM vendor_b_products"),
      db.query("SELECT * FROM vendor_c_products")
    ]);

    // Ganti fungsi normalize agar terima data dari DB
    const normalized = normalize(a.rows, b.rows, c.rows);
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengintegrasikan data" });
  }
});


if (require.main === module) {
  const PORT = process.env.PORT || 3300;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// WAJIB: export untuk Vercel
module.exports = app;
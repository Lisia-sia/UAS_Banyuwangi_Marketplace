require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { normalize } = require("./integrator/mahasiswa4");

const app = express();
const PORT = process.env.PORT || 3300;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Banyuwangi Marketplace API is running...");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username, role`,
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


app.get("/api/vendor-a/file", (req, res) => {
  try {
    const data = require("./vendor/mahasiswa1")();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal baca vendor file A" });
  }
});

app.get("/api/vendor-a", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM vendor_a_products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/vendor-a", async (req, res) => {
  try {
    const { kd_produk, nm_brg, hrg, ket_stok } = req.body;
    const result = await db.query(
      `INSERT INTO vendor_a_products (kd_produk, nm_brg, hrg, ket_stok)
       VALUES ($1,$2,$3,$4) RETURNING *`,
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
      `UPDATE vendor_a_products SET kd_produk=$1, nm_brg=$2, hrg=$3, ket_stok=$4 WHERE id=$5 RETURNING *`,
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

app.get("/api/vendor-b/file", (req, res) => {
  try {
    const data = require("./vendor/mahasiswa2")();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal baca vendor file B" });
  }
});

app.get("/api/vendor-b", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM vendor_b_products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/vendor-b", async (req, res) => {
  try {
    const body = req.body;
    const sku = body.sku;
    const productName = body.productName ?? body.product_name;
    const price = body.price;
    const isAvailable = (typeof body.isAvailable !== "undefined") ? body.isAvailable : body.is_available;
    const result = await db.query(
      `INSERT INTO vendor_b_products (sku, productName, price, isAvailable)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [sku, productName, price, isAvailable]
    );
    res.status(201).json({ message: "Produk Vendor B ditambahkan", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/vendor-b/:id", async (req, res) => {
  try {
    const body = req.body;
    const sku = body.sku;
    const productName = body.productName ?? body.product_name;
    const price = body.price;
    const isAvailable = (typeof body.isAvailable !== "undefined") ? body.isAvailable : body.is_available;
    const result = await db.query(
      `UPDATE vendor_b_products SET sku=$1, productName=$2, price=$3, isAvailable=$4 WHERE id=$5 RETURNING *`,
      [sku, productName, price, isAvailable, req.params.id]
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

app.get("/api/vendor-c/file", (req, res) => {
  try {
    const data = require("./vendor/mahasiswa3")();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal baca vendor file C" });
  }
});

app.get("/api/vendor-c", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM vendor_c_products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/vendor-c", async (req, res) => {
  try {
    const body = req.body;
    const product_code = body.product_code ?? (body.id ? String(body.id) : null);
    const name = body.name ?? (body.details ? body.details.name : null);
    const category = body.category ?? (body.details ? body.details.category : null);
    const base_price = body.base_price ?? (body.pricing ? body.pricing.base_price : null);
    const tax = body.tax ?? (body.pricing ? body.pricing.tax : null);
    const stock = body.stock;
    const result = await db.query(
      `INSERT INTO vendor_c_products (product_code, name, category, base_price, tax, stock)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
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
      `UPDATE vendor_c_products SET product_code=$1, name=$2, category=$3, base_price=$4, tax=$5, stock=$6 WHERE id=$7 RETURNING *`,
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

app.get("/api/banyuwangi-marketplace", (req, res) => {
  try {
    const vendorA = require("./vendor/mahasiswa1")();
    const vendorB = require("./vendor/mahasiswa2")();
    const vendorC = require("./vendor/mahasiswa3")();
    const normalized = normalize(vendorA, vendorB, vendorC);
    res.json(normalized);
  } catch (err) {
    console.error("Integrasi FILE error:", err);
    res.status(500).json({ error: "Gagal integrasi dari file" });
  }
});

app.get("/api/banyuwangi-marketplace/db", async (req, res) => {
  try {
    const [aRes, bRes, cRes] = await Promise.all([
      db.query("SELECT * FROM vendor_a_products"),
      db.query("SELECT * FROM vendor_b_products"),
      db.query("SELECT * FROM vendor_c_products")
    ]);

    const aRows = aRes.rows.map(r => ({
      kd_produk: r.kd_produk,
      nm_brg: r.nm_brg,
      hrg: String(r.hrg),
      ket_stok: r.ket_stok
    }));

    const bRows = bRes.rows.map(r => ({
      sku: r.sku,
      productName: r.product_name,
      price: r.price,
      isAvailable: r.is_available
    }));

    const cRows = cRes.rows.map(r => ({
      id: r.product_code ?? r.id,
      details: { name: r.name, category: r.category },
      pricing: { base_price: r.base_price, tax: r.tax },
      stock: r.stock
    }));

    const normalized = normalize(aRows, bRows, cRows);
    res.json(normalized);
  } catch (err) {
    console.error("Integrasi DB error:", err);
    res.status(500).json({ error: "Gagal integrasi dari database" });
  }
});

app.post("/api/banyuwangi-marketplace/save", async (req, res) => {
  try {
    const vendorA = require("./vendor/mahasiswa1")();
    const vendorB = require("./vendor/mahasiswa2")();
    const vendorC = require("./vendor/mahasiswa3")();

    const normalized = normalize(vendorA, vendorB, vendorC);

    await db.query("DELETE FROM integrated_products");

    for (const item of normalized) {
      await db.query(
        `INSERT INTO integrated_products (original_id, product_name, price_final, stock_status, vendor)
         VALUES ($1,$2,$3,$4,$5)`,
        [item.original_id, item.product_name, item.price_final, item.stock_status, item.vendor]
      );
    }

    res.json({ message: "Integrated saved", count: normalized.length });
  } catch (err) {
    console.error("Save integrated error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/integrated-products/db", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM integrated_products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

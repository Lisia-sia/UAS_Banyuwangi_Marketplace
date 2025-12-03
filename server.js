require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./middleware/auth.js");

// Vendor sources
const vendorA = require("./vendor/mahasiswa1");
const vendorB = require("./vendor/mahasiswa2");
const vendorC = require("./vendor/mahasiswa3");

// Integrator
const { normalize } = require("./integrator/mahasiswa4");

const app = express();
const PORT = process.env.PORT || 3300;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());


// =====================================================================
// ROOT
// =====================================================================
app.get("/", (req, res) => {
    res.send("Banyuwangi Marketplace API is running...");
});


// =====================================================================
// REGISTER
// =====================================================================
app.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (username, password, role)
             VALUES ($1, $2, $3)
             RETURNING id, username, role`,
            [username, hashed, role]
        );

        res.json({
            message: "Registrasi berhasil",
            user: result.rows[0],
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =====================================================================
// LOGIN
// =====================================================================
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const found = await db.query("SELECT * FROM users WHERE username=$1", [username]);

        if (found.rows.length === 0)
            return res.status(404).json({ message: "User tidak ditemukan" });

        const user = found.rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ message: "Login berhasil", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =====================================================================
// VENDOR GET API (asli mahasiswa)
// =====================================================================
app.get("/api/vendor-a", (req, res) => res.json(vendorA()));
app.get("/api/vendor-b", (req, res) => res.json(vendorB()));
app.get("/api/vendor-c", (req, res) => res.json(vendorC()));


// =====================================================================
// INTEGRATOR API
// =====================================================================
app.get("/api/banyuwangi-marketplace", (req, res) => {
    try {
        res.json(normalize());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// backup endpoint
app.get("/integrate", (req, res) => {
    res.json(normalize());
});


// =====================================================================
// CRUD PRODUCTS (UMUM)
// =====================================================================
app.get("/products", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products WHERE id=$1", [req.params.id]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Produk tidak ditemukan" });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/products", async (req, res) => {
    try {
        const { name, price, stock, category, vendor_id } = req.body;

        const result = await db.query(
            `INSERT INTO products (name, price, stock, category, vendor_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, price, stock, category, vendor_id]
        );

        res.json({ message: "Produk berhasil ditambahkan", data: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/products/:id", async (req, res) => {
    try {
        const { name, price, stock, category, vendor_id } = req.body;

        const result = await db.query(
            `UPDATE products
             SET name=$1, price=$2, stock=$3, category=$4, vendor_id=$5
             WHERE id=$6 RETURNING *`,
            [name, price, stock, category, vendor_id, req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Produk tidak ditemukan" });

        res.json({ message: "Produk berhasil diupdate", data: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const result = await db.query(
            `DELETE FROM products WHERE id=$1 RETURNING id`,
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Produk tidak ditemukan" });

        res.json({ message: "Produk berhasil dihapus", deleted_id: result.rows[0].id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =====================================================================
// START SERVER
// =====================================================================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Produk tidak ditemukan" });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE product
router.post('/', async (req, res) => {
    const { code, name, price, stock, vendor_id, category } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO products (code, name, price, stock, vendor_id, category) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [code, name, price, stock, vendor_id, category]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE product
router.put('/:id', async (req, res) => {
    const { code, name, price, stock, vendor_id, category } = req.body;

    try {
        const result = await db.query(
            `UPDATE products SET code=$1, name=$2, price=$3, stock=$4, vendor_id=$5, category=$6 
             WHERE id=$7 RETURNING *`,
            [code, name, price, stock, vendor_id, category, req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Produk tidak ditemukan" });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query("DELETE FROM products WHERE id=$1 RETURNING id", [req.params.id]);

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Produk tidak ditemukan" });

        res.json({ message: "Produk berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

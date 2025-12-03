const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// CRUD Vendor A
app.use('/api/vendor-a', require('./vendor/mahasiswa1'));

// CRUD Vendor B
app.use('/api/vendor-b', require('./vendor/mahasiswa2'));

// CRUD Vendor C
app.use('/api/vendor-c', require('./vendor/mahasiswa3'));

// CRUD Produk (PostgreSQL Neon)
app.use('/api/products', require('./products/products.routes'));

// Integrator (menggabungkan 3 vendor)
app.use('/api/banyuwangi-marketplace', require('./integrator/mahasiswa4'));

// ROUTE ROOT
app.get('/', (req, res) => {
    res.send('Server Banyuwangi Marketplace Jalan!');
});

// PORT
const port = process.env.PORT || 3300;

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;

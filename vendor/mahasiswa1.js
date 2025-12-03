const express = require('express');
const router = express.Router();

// Data Vendor A (Warung)
const data = [
    { 
        "kd_produk": "A001", 
        "nm_brg": "Kopi Bubuk 100g", 
        "hrg": "15000", 
        "ket_stok": "ada" 
    },
    { 
        "kd_produk": "A002", 
        "nm_brg": "Gula Merah", 
        "hrg": "12500", 
        "ket_stok": "habis" 
    },
    { 
        "kd_produk": "A003", 
        "nm_brg": "Minyak", 
        "hrg": "22000", 
        "ket_stok": "ada" 
    },
    { 
        "kd_produk": "A004", 
        "nm_brg": "Beras", 
        "hrg": "14500", 
        "ket_stok": "ada" 
    },
    { 
        "kd_produk": "A005", 
        "nm_brg": "Kacang Hijau", 
        "hrg": "15000", 
        "ket_stok": "habis" 
    }
];

router.get('/', (req, res) => {
    res.json(data);
});

module.exports = router;
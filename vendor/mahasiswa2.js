const express = require('express');
const router = express.Router();

// Data Vendor B (Distro)
const data = [
    { "sku": "TSHIRT-001", "productName": "Kaos Ijen Crater", "price": 75000, "isAvailable": true },
    { "sku": "TSHIRT-002", "productName": "Jaket Kawah", "price": 150000, "isAvailable": false }
];

router.get('/', (req, res) => {
    res.json(data);
});

module.exports = router;
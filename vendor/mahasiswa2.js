const express = require('express');
const router = express.Router();

// Data Vendor B (Distro)
const data = [
    { 
        "sku": "TSHIRT-001", 
        "productName": "Kaos Ijen Crater", 
        "price": 75000, 
        "isAvailable": true 
    },

    { 
        "sku": "TSHIRT-002", 
        "productName": "Jaket Kawah", 
        "price": 150000, 
        "isAvailable": false 
    },

    { 
        "sku": "TSHIRT-003", 
        "productName": "Hoodie Sunrise", 
        "price": 180000, 
        "isAvailable": true 
    },

    { 
        "sku": "TSHIRT-004", 
        "productName": "Sweater Blue Mountain", 
        "price": 130000, 
        "isAvailable": true 
    }
];

router.get('/', (req, res) => {
    res.json(data);
});

module.exports = router;


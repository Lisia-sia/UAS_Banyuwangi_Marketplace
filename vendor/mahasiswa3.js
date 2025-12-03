const express = require('express');
const router = express.Router();

// Data Vendor C (Resto)
const data = [
    { 
        "id": 501, 
        "details": { 
            "name": "Nasi Tempong", 
            "category": "Food" 
        }, 
        "pricing": { 
            "base_price": 20000, 
            "tax": 2000 
        }, 
        "stock": 50 
    },

    { 
        "id": 502, 
        "details": {
            "name": "Es Degan",
            "category": "Drink" 
        }, 
        "pricing": {
            "base_price": 5000, 
            "tax": 500 
        }, 
        "stock": 0 
    },

    
    { 
        "id": 503, 
        "details": {
            "name": "Ayam Penyet",
            "category": "Food"
        },
        "pricing": {
            "base_price": 25000,
            "tax": 2500
        },
        "stock": 30
    },

    
    { 
        "id": 504, 
        "details": {
            "name": "Jus Alpukat",
            "category": "Drink"
        },
        "pricing": {
            "base_price": 12000,
            "tax": 1200
        },
        "stock": 15
    },

    
    { 
        "id": 505, 
        "details": {
            "name": "Mie Goreng",
            "category": "Food"
        },
        "pricing": {
            "base_price": 18000,
            "tax": 1800
        },
        "stock": 25
    }
];

router.get('/', (req, res) => {
    res.json(data);
});

module.exports = router;

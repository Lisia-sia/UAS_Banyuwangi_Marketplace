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
    }
];

router.get('/', (req, res) => {
    res.json(data);
});

module.exports = router;
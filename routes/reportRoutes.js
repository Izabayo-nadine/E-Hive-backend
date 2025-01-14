// routes/reportRoutes.js
const express = require('express');
const Product = require('../models/product');
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');

const router = express.Router();

// Get best-selling products (Admin only)
router.get('/best-sellers', auth, admin, async (req, res) => {
    try {
        const bestSellers = await Product.find().sort({ sales: -1 }).limit(5);  // Sort by sales, top 5
        res.json(bestSellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// routes/reportRoutes.js
router.get('/low-stock', auth, admin, async (req, res) => {
    try {
        const lowStockProducts = await Product.find({ countInStore: { $lt: 10 } });  // Products with stock < 10
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

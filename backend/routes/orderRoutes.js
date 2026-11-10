const express = require("express");
const { submitOrder, getOrders } = require("../controllers/orderController");
const { protect, staffOnly } = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/orders', protect, submitOrder);
router.get('/orders', protect, staffOnly, getOrders);

module.exports = router;
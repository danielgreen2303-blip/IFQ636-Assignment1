const express = require("express");
const { submitOrder, getOrders, setAcceptStatus, setRejectStatus } = require("../controllers/orderController");
const { protect, staffOnly } = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/orders', protect, submitOrder);
router.get('/orders', protect, staffOnly, getOrders);
router.patch('/orders/:orderId/accept', protect, staffOnly, setAcceptStatus);
router.patch('/orders/:orderId/reject', protect, staffOnly, setRejectStatus);

module.exports = router;
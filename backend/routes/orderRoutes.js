const express = require("express");

const { 
    submitOrder, 
    getPendingOrders, 
    getPreparingOrders, 
    setAcceptStatus, 
    setRejectStatus 
} = require("../controllers/orderController");

const { protect, staffOnly } = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/orders', protect, submitOrder);
router.get('/orders/pending', protect, staffOnly, getPendingOrders);
router.get('/orders/preparing', protect, staffOnly, getPreparingOrders);
router.patch('/orders/:orderId/accept', protect, staffOnly, setAcceptStatus);
router.patch('/orders/:orderId/reject', protect, staffOnly, setRejectStatus);

module.exports = router;
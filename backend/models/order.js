const mongoose = require('mongoose');

// OrderSchema uses this schema to define the Array for orderItems
const OrderItemSchema = new mongoose.Schema({ 
    menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemTitle: { type: String, required: true },
    itemQuantity: { type: Number, min: 1, validate: Number.isInteger, required: true },
    itemPrice: { type: Number, min: 0.01, required: true },
})


// this is the exported schema used by the controller to define an order
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderItems: { type: [OrderItemSchema], validate: (items) => items.length >=1, required: true },
    orderTotalPrice: { type: Number, min: 0.01, required: true },
    orderStatus: { type: String, enum: ["Pending", "Preparing", "Ready", "Rejected"], required: true, default: "Pending" },
    orderTime: { type: Date, default: Date.now },
})

module.exports = mongoose.model("order", OrderSchema)
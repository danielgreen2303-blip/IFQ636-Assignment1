const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    itemTitle: { type: String, required: true },
    itemDescription: { type: String, required: true },
    itemPrice: { type: Number, min: 0.01, required: true },
    itemImageLocation: { type: String, required: true },
})

module.exports = mongoose.model("menuItem", MenuItemSchema)
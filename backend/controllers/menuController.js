const menuItems = require("../models/menuItems");

const getMenuItems = async (req, res) => {
    try {
        const items = await menuItems.find();

        res.status(200).json(items);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

module.exports = {getMenuItems,}
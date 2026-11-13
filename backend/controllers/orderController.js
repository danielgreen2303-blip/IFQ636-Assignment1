const mongoose = require("mongoose")
const user = require("../models/User");
const menuItems = require("../models/menuItems");
const order = require("../models/order");

// Controller
const submitOrder = async (req, res) => {

    const userId = req.user._id;
    // read the items from req
    const { orderItems } = req.body;

    try {

        // check if orderItems is not an array or that the it is 0 items long, return error if either is true
        if (!Array.isArray(orderItems) || orderItems.length === 0) 
            return res.status(400).json({ message: "An order must have atleast one item." });

        // check each item's quantity in the basket: <1 & for decimal's; return an error if either is true
        if (orderItems.some(item =>
            item.itemQuantity <1 || !Number.isInteger(item.itemQuantity)
        )) {return res.status(400).json({ message: "An item in the basket must be a whole number and be more than 0."});}

        if (orderItems.some(item =>
            !mongoose.isValidObjectId(item.menuItemId)
        )) {return res.status(400).json ({ message: "One or more menu item IDs are invalid." }); }

        // info from mongoDB
        const ids = orderItems.map(item => item.menuItemId);
        const uniqueIds = new Set(ids);

        // check for duplicate ids in the order
        if (ids.length !== uniqueIds.size) 
            return res.status(400).json({ message: "One or more menu items in the order is a duplicate." });

        const mongoItems = await menuItems.find({
            _id: { $in: ids },
        });

        // check if recieved order item IDs match database item IDs
        if (ids.length !== mongoItems.length) 
            return res.status(400).json({ message: "One or more menu items in the order were not found." });

        // validate the total price of the recieved order items using the price stored in the database instead of 
        // accepting the orderTotalPrice recieved from the frontend
        const validatedTotal = mongoItems.reduce((sum, mongoItem) => {

            // checking that the recieved item ids are in the database
            const match = orderItems.find(
                item => item.menuItemId === String(mongoItem._id)
            );
            const subtotal = mongoItem.itemPrice * match.itemQuantity;
            return sum + subtotal;
        }, 0);

        const userExists = await user.findById(userId);
        if (!userExists) 
            return res.status(400).json({ message: "User does not exist." });     

        const verifiedOrderItems = mongoItems.map(item => {
            // match uses find() to the matching mongoDB ID for the basketItem
            const match = orderItems.find(
                basketItem => basketItem.menuItemId === String(item._id)
            );

            return {
                menuItemId: item._id,
                itemTitle: item.itemTitle,
                itemPrice: item.itemPrice,
                itemQuantity: match.itemQuantity,   // this returns the corresponding item quantity for the matched item found above
            };
        });

        // create the order entry in the database and change the react order total to the validated total
        const createOrder = await order.create({ userId, orderItems: verifiedOrderItems, orderTotalPrice: validatedTotal });
        res.status(201).json({ 
            orderId: createOrder.id,
            user: createOrder.userId,
            items: createOrder.orderItems,
            price: createOrder.orderTotalPrice,
            orderStatus: createOrder.orderStatus,
            time: createOrder.orderTime,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

const getPendingOrders = async (req, res) =>  {
    try {
        const pendingOrders = await order.find({ orderStatus: "Pending" }).sort({ orderTime: -1 });
        return res.json(pendingOrders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

const getPreparingOrders = async (req, res) =>  {
    try {
        const preparingOrders = await order.find({ orderStatus: "Preparing" }).sort({ orderTime: -1 });
        return res.json(preparingOrders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

const setAcceptStatus = async (req, res) =>  {
    try {
        const { orderId } = req.params;
        const existingOrder = await order.findById(orderId);

        // Validate the order ID in MongoDB prior to changing the status to 'PReparing'
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({ message: "Invalid order ID." })
        }
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        if (existingOrder.orderStatus !== "Pending") {
            return res.status(409).json({ message: "Order cannot be accepted because the status is not 'Pending'." });
        }
        existingOrder.orderStatus = "Preparing"
        await existingOrder.save();
        return res.status(200).json(existingOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

const setRejectStatus = async (req, res) =>  {
    try {
        const { orderId } = req.params;
        const existingOrder = await order.findById(orderId);

        // Validate the order ID in MongoDB prior to changing the status to 'PReparing'
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({ message: "Invalid order ID." })
        }
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        if (existingOrder.orderStatus !== "Pending") {
            return res.status(409).json({ message: "Order cannot be rejected because the status is not 'Pending'." });
        }
        existingOrder.orderStatus = "Rejected"
        await existingOrder.save();
        return res.status(200).json(existingOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};

module.exports = { 
    submitOrder, 
    getPendingOrders, 
    getPreparingOrders, 
    setAcceptStatus, 
    setRejectStatus, 
}
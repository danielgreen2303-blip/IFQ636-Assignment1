const mongoose = require("mongoose");
const connectDB = require("./config/db");
const menuItem = require("./models/menuItems");
const dotenv = require('dotenv');

dotenv.config();

const menuItems = [
    {
        itemTitle: "Lemon Iced Tea",
        itemDescription: "Black tea served chilled with lemon and ice." ,
        itemPrice: 5.00,
        itemImageLocation: "/images/iced-lemon-tea.png",
    },
    {
        itemTitle: "Mango Smoothie",
        itemDescription: "Mango blended with milk and yoghurt." ,
        itemPrice: 7.50,
        itemImageLocation: "/images/mango-smoothie.png",
    },
    {
        itemTitle: "Classic Beef Burger",
        itemDescription: "Grilled beef patty with cheddar, lettuce, tomato and burger sauce on a brioche bun." ,
        itemPrice: 16.50,
        itemImageLocation: "/images/beef-burger.png",
    },
    {
        itemTitle: "Grilled Chicken Wrap",
        itemDescription: "Grilled chicken with lettuce, tomato and garlic yoghurt sauce in a toasted tortilla." ,
        itemPrice: 14.50,
        itemImageLocation: "/images/chicken-wrap.png",
    },
    {
        itemTitle: "Chocolate Brownie",
        itemDescription: "Chocolate brownie served with vanilla ice cream." ,
        itemPrice: 8.50,
        itemImageLocation: "/images/chocolate-brownie.png",
    },
    {
        itemTitle: "Lemon Cheesecake",
        itemDescription: "Baked lemon cheesecake with a biscuit base and berry sauce." ,
        itemPrice: 9.00,
        itemImageLocation: "/images/lemon-cheesecake.png",
    },
    {
        itemTitle: "Chips",
        itemDescription: "Golden potato chips tossed with salt and paprika." ,
        itemPrice: 6.00,
        itemImageLocation: "/images/seasoned-chips.png",
    },
    {
        itemTitle: "Garden Salad",
        itemDescription: "Mixed lettuce, cucumber, tomato, and red onion with a lemon dressing." ,
        itemPrice: 6.50,
        itemImageLocation: "/images/garden-salad.png",
    },

]

async function seedMenu() {
    await connectDB();
    await menuItem.insertMany(menuItems);
    await mongoose.disconnect();
}

seedMenu();
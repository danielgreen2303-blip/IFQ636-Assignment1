import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";


const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [basketItems, setBasketItems] = useState([]);
    const addToBasket = (item) => {
        setBasketItems((previousItems) => {
            
            const existingItem = previousItems.find(
                (basketItem) => basketItem._id === item._id
            );
            console.log(existingItem)

            if (existingItem) {
                return previousItems.map((basketItem) => {
                    if (basketItem._id === item._id) {
                        return { ...basketItem, quantity: basketItem.quantity + 1 };
                    }

                    return basketItem;
                });
            }

            return [
                ...previousItems,
                { ...item, quantity: 1 },
            ];
    });
    };

    useEffect(() => {
        const getMenuItems = async () => {
        try {
            const response = await axiosInstance.get('/api/menu');
            setMenuItems(response.data);
        } catch (error) {
            alert('Failed to fetch menu items.');
        }
        };

        getMenuItems();
    }, []);

    const basketTotal = basketItems.reduce((total, item) => {
        return total + item.itemPrice * item.quantity
    }, 0);

    return (
        <div>

            <h1 className="text-2xl font-bold mb-4 text-center">Menu</h1>

            <div>

                <h2 className="font-bold">Basket</h2>

                {basketItems.map((item) => (
                    <div key={item._id}>
                        <div>
                        {item.itemTitle}: {item.quantity} - ${(item.itemPrice * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}

                <div>
                    Total: ${basketTotal.toFixed(2)}
                </div>
                
            </div>

            <div>
                {menuItems.map((item) => (
                <div key={item._id}>
                    <img 
                        src={item.itemImageLocation} 
                        alt={item.itemTitle} 
                        className="w-48 h-32 object-cover">
                    </img>
                    <h2>
                        {item.itemTitle}
                    </h2>
                    <p>
                        {item.itemDescription}
                    </p>
                    <p>
                        ${item.itemPrice.toFixed(2)}
                    </p>
                    <button onClick={() => addToBasket(item)}> 
                        Add to Order
                    </button>
                </div>
                ))}
            </div>
          
        </div>
        
    );
}


export default Menu;
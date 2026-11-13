import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

/*The Menu variable holds all the variables, states, and functions that dyanmically construct the menu*/
const Menu = () => {

    //setMenuItems:
    // creates an empty array that is later filled by the setMenuItems
    const [menuItems, setMenuItems] = useState([]);

    //setBasketItems:
    // creates an empty array that addToBasket, increaseQuantity, decreaseQuantity, and removeItem add/remove from
    const [basketItems, setBasketItems] = useState([]);

    const { user } = useAuth();

    //addToBasket:
    // is used in the 'Add to Order' button in the below HTML. It adds an item the the setBasketItems [ ], 
    // checks if the item allready exists, if so, adds to the specific item quantity using basketItem.quantity + 1
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

    // Submit Order button for the basket will use this via onClick: transforms the orderItems into an array the backend expects (i.e., using menuItemId & itemQuantity)
    // the backend calculates the order price using the stored MongoDB item prices * quantity recieved
    const handleSubmitOrder = () => {
        const orderItems = basketItems.map(item => ({
            menuItemId: item._id,
            itemQuantity: item.quantity,
        }));

        if (!user?.token) {
            alert("Please log in before submitting an order.");
            return;
        }

        axiosInstance.post("/api/orders", { orderItems }, { 
            headers: {
                Authorization: `Bearer ${user.token}`
            }
         })
    };

    // decreaseQuantity: 
    // reduce an items quantity by 1
    const decreaseQuantity = (item) => {
        setBasketItems((previousItems) => {
            return previousItems.map((basketItem) => {

                // check if the .map() basketItem id matches the item id of the item the '-' button was clicked for, 
                // checks if its >0, then reduces quantity by 1 if true
                if (basketItem._id === item._id && basketItem.quantity >0) {
                    return { ...basketItem, quantity: basketItem.quantity - 1 };
            }

                return basketItem;

            // filter the above output to remove items from the basket that reach 0
            }).filter((basketItem) => basketItem.quantity >0 );
        });
    }

    const removeItem = (item) => {
        setBasketItems((previousItems) => {
            return previousItems.filter((basketItem) => {

                return basketItem._id !== item._id;
            });
        });
    }

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

            <div className="max-w-sm rounded-lg border border-gray-300 bg-gray-50 p-2">

                <h2 className="mb-3 text-lq font-bold">
                    Order
                </h2>

                {basketItems.map((item) => (
                    <div key={item._id}>
                        <div className="mb-1 rounded-sm border border-gray-200 bg-white p-1">
                            {/* basket item display */}
                            <p className="flex items-center justify-between gap-3">
                                <span>
                                    {item.itemTitle}
                                </span>
                                <span className="shrink-0">
                                    {/* addToBasket reused for the increase quantity button */}
                                    (${(item.itemPrice * item.quantity).toFixed(2)}) 
                                </span>
                                
                            </p>

                            {/* basket management buttons */}
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    className="min-w-9 rounded-md border border-gray-300 bg-white px-3 py-1 font-semibold hover:bg-gray-100"
                                    onClick={() => addToBasket(item)}
                                    > + </button>
                                <div>
                                    {item.quantity}
                                </div>
                                <button 
                                    className="min-w-9 rounded-md border border-gray-300 bg-white px-3 py-1 font-semibold hover:bg-gray-100" 
                                    onClick={() => decreaseQuantity(item)}
                                    > - </button>
                                <button 
                                    className="rounded-md border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
                                    onClick={() => removeItem(item)}
                                    > R </button>
                            </div> 
                        </div>
                    </div>
                    
                ))}

                <p className="mt-3 border-t border-gray-300 pt-3 font-bold">
                    Total: ${basketTotal.toFixed(2)}
                </p>
            </div>
            <div>
                <button
                    className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    disabled={basketItems.length === 0}
                    onClick={handleSubmitOrder}
                >Submit Order</button>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" key={item._id}>
                    <img className="mx-auto mt-3 h-28 w-40 rounded-md object-contain"
                        src={item.itemImageLocation} 
                        alt={item.itemTitle} 
                    >
                    </img>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                        <h2 className="text-lg font-semibold">
                            {item.itemTitle}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {item.itemDescription}
                        </p>
                        <p className="mt-auto pt-2 font-semibold">
                            ${item.itemPrice.toFixed(2)}
                        </p>
                        <button className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800" onClick={() => addToBasket(item)}> 
                            Add to Order
                        </button>
                    </div>
                </div>
                ))}
            </div>
          
        </div>
        
    );
}


export default Menu;
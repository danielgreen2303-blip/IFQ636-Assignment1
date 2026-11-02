import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";


const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
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

    return (
        <div>

            <h1 className="text-2xl font-bold mb-4 text-center">Menu</h1>
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
                </div>
                ))}
            </div>
          
        </div>
        
    );
}

export default Menu;
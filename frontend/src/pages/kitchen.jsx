import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

/*The kitchenBacklog variable holds all the variables, states, and functions that dyanmically construct the menu*/
const KitchenBacklog = () => {

    const [pendingOrders, setPendingOrders] = useState([]);

    const { user } = useAuth();

    const handlePendingOrders = async () => {

        if (!user?.token) {
            alert("Please log into a staff account to view pending orders.");
            return;
        }

        const response = await axiosInstance.get("/api/orders", {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        setPendingOrders(response.data)
    };

    return (
        <div>

            <h1 className="text-2xl font-bold mb-4 text-center">kitchen Backlog</h1>

            <div className="max-w-sm rounded-lg border border-gray-300 bg-gray-50 p-2">

                <h2 className="mb-3 text-lq font-bold">
                    Pending Orders
                </h2>

                {/* backlog refresh button */}
                <div className="mt-2 flex items-center gap-3">
                    <button
                        className="min-w-9 rounded-md border border-gray-300 bg-white px-3 py-1 font-semibold hover:bg-gray-100"
                        onClick={() => handlePendingOrders()}
                    > Refresh </button>
                </div>

                {pendingOrders.map((order) => (
                    <div key={order._id}>

                        {/* Display order info */}
                        <p>Order: {order._id}</p>
                        <p>Status: {order.orderStatus}</p>

                        {order.orderItems.map((item) => (
                            <div key={item._id}>
                                <p>{item.itemTitle}</p>
                                <p>Quantity: {item.itemQuantity} </p>
                            </div>
                        ))}

                        {/* Display order total */}
                        <p>Total: {order.orderTotalPrice.toFixed(2)} </p>

                    </div>
                ))}
            </div>
        </div>
    );
};

    export default KitchenBacklog;
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

/*The kitchenBacklog variable holds all the variables, states, and functions that dyanmically construct the menu*/
const KitchenBacklog = () => {

    const [pendingOrders, setPendingOrders] = useState([]);

    const [preparingOrders, setPreparingOrders] = useState([]);

    const { user } = useAuth();

    const handlePendingOrders = async () => {

        if (!user?.token) {
            alert("Please log into a staff account to view pending orders.");
            return;
        }

        const response = await axiosInstance.get("/api/orders/pending", {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        setPendingOrders(response.data)
        await handlePendingOrders();
    };

    const handlePreparingOrders = async () => {

        if (!user?.token) {
            alert("Please log into a staff account to view pending orders.");
            return;
        }

        const response = await axiosInstance.get("/api/orders/preparing", {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        setPreparingOrders(response.data)
        await handlePreparingOrders();
    };

    const handleAcceptOrders = async (orderId) => {

        try{
            if (!user?.token) {
            alert("Please log into a staff account to accept an order.");
            return;
        }

        await axiosInstance.patch(`/api/orders/${orderId}/accept`, {}, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        // Use existing refresh function to refresh the backlog once an order is accepted
        await handlePendingOrders();

        } catch (error) {
            alert("Failed to accept order.");
            console.error(error);
        }
    };

    const handleRejectOrders = async (orderId) => {

        try{
            if (!user?.token) {
            alert("Please log into a staff account to accept an order.");
            return;
        }

        await axiosInstance.patch(`/api/orders/${orderId}/reject`, {}, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        // Use existing refresh function to refresh the backlog once an order is accepted
        await handlePendingOrders();

        } catch (error) {
            alert("Failed to accept order.");
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">

            <h1 className="text-2xl font-bold mb-4 text-center">
                kitchen Backlog
            </h1>

            {/* Parent container for pending & preparing backlogs */}
            <div className="flex flex-row justify-center items-start gap-6">

                <div className="w-full max-w-sm mx-auto rounded-lg border border-gray-300 bg-gray-50 p-2">

                    <h2 className="mb-3 text-xl text-center font-bold">
                        Pending Orders
                    </h2>

                    {/* backlog refresh button */}
                    <div className="mt-2 flex flex-1 flex-col gap-3 p-2">
                        <button
                            className="min-w-9 rounded-md border border-gray-400 bg-white px-3 py-1 font-semibold hover:bg-gray-100"
                            onClick={() => handlePendingOrders()}> 
                            Refresh 
                        </button>
                    </div>

                    {pendingOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No pending orders.
                        </p>
                    ) : (
                        pendingOrders.map((order) => (
                        <div className="bg-white border rounded-lg shadow-sm p-4 mb-4" key={order._id}>

                            {/* Display order info */}
                            <p className="flex justify-between items-center mb-2">Order: {order._id}</p>
                            <p>Status: {order.orderStatus}</p>

                            {order.orderItems.map((item) => (
                                <div className="flex justify-between py-1" key={item._id}>
                                    <p>{item.itemTitle}</p>
                                    <p>Quantity: {item.itemQuantity} </p>
                                </div>
                            ))}

                            {/* Display order total */}
                            <p className="font-bold border-t pt-2 mt-2">
                                Total: {order.orderTotalPrice.toFixed(2)} 
                            </p>

                            <div className="mt-2 flex justify-between gap-3">
                                <button
                                    className="rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
                                    onClick={() => handleAcceptOrders(order._id)}
                                >Accept</button>

                                <button
                                    className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                                    onClick={() => handleRejectOrders(order._id)}
                                >Reject</button>
                            </div>

                        </div>
                    )))}
                    
                </div>
                
                {/* Preparing Orders  */}
                <div className="w-full max-w-sm mx-auto rounded-lg border border-gray-300 bg-gray-50 p-2">

                    <h2 className="mb-3 text-xl text-center font-bold">
                        Preparing Orders
                    </h2>

                    {/* backlog refresh button */}
                    <div className="mt-2 flex flex-1 flex-col gap-3 p-2">
                        <button
                            className="min-w-9 rounded-md border border-gray-400 bg-white px-3 py-1 font-semibold hover:bg-gray-100"
                            onClick={() => handlePreparingOrders()}> 
                            Refresh 
                        </button>
                    </div>

                    {preparingOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No accepted orders.
                        </p>
                    ) : (
                        preparingOrders.map((order) => (
                        <div className="bg-white border rounded-lg shadow-sm p-4 mb-4" key={order._id}>

                            {/* Display order info */}
                            <p className="flex justify-between items-center mb-2">Order: {order._id}</p>
                            <p>Status: {order.orderStatus}</p>

                            {order.orderItems.map((item) => (
                                <div className="flex justify-between py-1" key={item._id}>
                                    <p>{item.itemTitle}</p>
                                    <p>Quantity: {item.itemQuantity} </p>
                                </div>
                            ))}

                            {/* Display order total */}
                            <p className="font-bold border-t pt-2 mt-2">
                                Total: {order.orderTotalPrice.toFixed(2)} 
                            </p>

                            <div className="mt-2 flex justify-between gap-3">
                                <button
                                    className="rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
                                >Complete</button>
                            </div>

                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
};

    export default KitchenBacklog;
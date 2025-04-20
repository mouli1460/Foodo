// src/pages/OrderSummary/OrderSummary.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import "./OrderSummary.css"; // Optional styling

const OrderSummary = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) return <p>No order data found.</p>;

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <h3>Delivery Address:</h3>
      <p>{order.address.firstName} {order.address.lastName}</p>
      <p>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}, {order.address.country}</p>
      <p>Email: {order.address.email}</p>
      <p>Phone: {order.address.phone}</p>

      <h3>Ordered Items:</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} × {item.quantity} - ${item.price * item.quantity}
          </li>
        ))}
      </ul>

      <h3>Total Amount: ${order.amount}</h3>
    </div>
  );
};

export default OrderSummary;

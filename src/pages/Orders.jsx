import { useEffect, useState } from 'react';
import client from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    client.get('/orders/user/my-orders')
      .then(res => setOrders(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>My Orders</h2>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {orders.map(order => (
          <div key={order._id} className="card">
            <div className="flex-between">
              <h3>{order.restaurantId?.restaurantName || 'Restaurant'}</h3>
              <span style={{ fontWeight: 'bold' }}>{order.status}</span>
            </div>
            <p>Order ID: {order.orderNumber}</p>
            <p>{formatCurrency(order.pricing.totalAmount)} • {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
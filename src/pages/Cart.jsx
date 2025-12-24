import { useEffect, useState } from 'react';
import client from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [summary, setSummary] = useState(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const [cartRes, sumRes] = await Promise.all([
        client.get('/cart'),
        client.get('/cart/summary?cartType=foodCart')
      ]);
      setCart(cartRes.data.data?.foodCart || []);
      setSummary(sumRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (key) => {
    await client.delete('/cart/remove-item', { data: { cartType: 'foodCart', cartItemKey: key } });
    fetchCart();
  };

  const placeOrder = async () => {
    if (!address) return alert('Please enter address');
    try {
      await client.post('/orders/place-cash-order', {
        cartType: 'foodCart',
        deliveryAddress: { addressLine1: address, city: 'Unknown', coordinates: { coordinates: [0,0] } }, // Simplified for MVP
        notes: ''
      });
      alert('Order Placed Successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Order failed');
    }
  };

  if (!cart || cart.length === 0) return <div className="container mt-4">Cart is empty</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>Your Cart</h2>
      <div className="grid">
        <div style={{ gridColumn: 'span 2' }}>
          {cart.map(item => (
            <div key={item.cartItemKey} className="card flex-between" style={{ marginBottom: '1rem' }}>
              <div>
                <h4>{item.menuItemId.itemName}</h4>
                <p>Qty: {item.quantity}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <p>{formatCurrency(item.totalPrice)}</p>
                <button onClick={() => removeItem(item.cartItemKey)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="card" style={{ height: 'fit-content' }}>
          <h3>Summary</h3>
          <div className="flex-between" style={{ margin: '1rem 0' }}>
            <span>Total</span>
            <strong>{formatCurrency(summary?.totalAmount || 0)}</strong>
          </div>
          <input 
            className="input" 
            placeholder="Delivery Address" 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
          />
          <button onClick={placeOrder} className="btn btn-primary" style={{ width: '100%' }}>Place Order (COD)</button>
        </div>
      </div>
    </div>
  );
}
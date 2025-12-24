import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client'; // <--- UPDATED THIS LINE
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) return;
    try {
      const [cartRes, summaryRes] = await Promise.all([
        client.get('/cart'),
        client.get('/cart/summary?cartType=foodCart')
      ]);
      
      setCart(cartRes.data.data?.foodCart || []);
      setSummary(summaryRes.data.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  // Sync cart when user logs in/out
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
      setSummary(null);
    }
  }, [user]);

  // Add Item
  const addToCart = async (itemPayload) => {
    if (!user) {
      alert("Please login to add items");
      return;
    }
    setLoading(true);
    try {
      await client.post('/cart/add', { ...itemPayload, cartType: 'foodCart' });
      await fetchCart();
      alert("Item added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  // Update Quantity
  const updateQuantity = async (cartItemKey, quantity) => {
    setLoading(true);
    try {
      if (quantity <= 0) {
        await client.delete('/cart/remove-item', { 
          data: { cartType: 'foodCart', cartItemKey } 
        });
      } else {
        await client.put('/cart/update-quantity', { 
          cartType: 'foodCart', cartItemKey, quantity 
        });
      }
      await fetchCart();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, summary, loading, addToCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
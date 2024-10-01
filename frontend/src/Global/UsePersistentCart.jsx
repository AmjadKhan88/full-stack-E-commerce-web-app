import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { useUserContext } from './UserProvider';
import { useNavigate } from 'react-router-dom';

const UsePersistentCart = () => {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const token = localStorage.getItem('userToken');
  if(!user && !token) {
    navigate('/login');
    return false;
  }
  const { items, addItem, removeItem, updateItemQuantity, emptyCart } = useCart();
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setLocalCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever items change
    localStorage.setItem('cart', JSON.stringify(items));
    setLocalCart(items);
  }, [items]);

  return {
    items: localCart,
    addItem,
    removeItem,
    updateItemQuantity,
    emptyCart,
  };
};

export default UsePersistentCart;

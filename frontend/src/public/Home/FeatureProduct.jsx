import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCart } from 'react-use-cart';
import Notification from '../../notification/Notification';
import { Link } from 'react-router-dom';
import UsePersistentCart from '../../Global/UsePersistentCart';
import FeatureProductLoop from './FeatureProductLoop';

function FeatureProduct() {
    const [featuredProduct, setFeatureProduct] = useState([]);
    const [featureLoading, setFeatureLoading] = useState(false);
    const { removeItem } = UsePersistentCart();
    const { addItem, items } = useCart();
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('text-success');
    const [visibleProducts, setVisibleProducts] = useState(0); // State to track how many products to display

    const isItemInCart = items.some(item => item.id === featuredProduct.id);

    const handleAddToCart = () => {
      if (isItemInCart) {
        setShowNotification(true);
        setAlertType('alert-danger');
        setMessage('Item already in the cart');
        setTimeout(() => setShowNotification(false), 3000); 
      } else {
        addItem({ ...data, quantity: 1 });
        setShowNotification(true);
        setAlertType('alert-success');
        setMessage('Successfully added item');
        setTimeout(() => setShowNotification(false), 3000);
      }
    };

    const getFeturedProduct = async () => {
        setFeatureLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/featuredproducts`);
            if (response.status === 200) {
                setFeatureProduct(response.data.featureProduct);
                setFeatureLoading(false);
            }
        } catch (error) {
            console.error(error);
            setFeatureLoading(false);
        }
    }

    useEffect(() => {
        getFeturedProduct();
    }, []);

    useEffect(() => {
        // Display one product at a time with a 1-second delay
        if (featuredProduct.length > 0 && visibleProducts < featuredProduct.length) {
            const timer = setTimeout(() => {
                setVisibleProducts((prev) => prev + 1);
            }, 500); // 1 second delay

            return () => clearTimeout(timer); // Cleanup on component unmount or update
        }
    }, [visibleProducts, featuredProduct]);

    return (
        <>
            {(featureLoading) ? '...loading' : 
            featuredProduct.slice(0, visibleProducts).map((value) => (
                <FeatureProductLoop key={value.id} value={value}/> 
            ))}
        </>
    )
}

export default FeatureProduct;

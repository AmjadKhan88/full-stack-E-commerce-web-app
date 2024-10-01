import React, { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import Notification from '../../notification/Notification';
import { Link } from 'react-router-dom';
import UsePersistentCart from '../../Global/UsePersistentCart';
import axios from 'axios';

function ProductList({ data }) {
  const token = localStorage.getItem('userToken');
  const { addItem, items } = useCart();
  const { removeItem } = UsePersistentCart();
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('text-success');

  const [inWishlist, setInWishlist] = useState(false);

  // Check if the item is already in the cart
  const isItemInCart = items.some(item => item.id === data.id);

  useEffect(() => {
    // Check if product is in wishlist when component mounts
    axios.get(`${import.meta.env.VITE_API_URL}/wishlist/check/${data.id}`,{
        headers:{
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
      .then(response => {
        setInWishlist(response.data.inWishlist);
      })
      .catch(error => {
        console.error('Error checking wishlist:', error);
      });
  }, [data.id]);

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

  const handleAddToWishlist = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/wishlist/add/${data.id}`,{},
      {
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
    }
  )
      .then(response => {
        setInWishlist(true);
        setShowNotification(true);
        setAlertType('alert-success');
        setMessage('Added to wishlist');
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch(error => {
        console.error('Error adding to wishlist:', error);
      });
  };

  const handleRemoveFromWishlist = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/wishlist/remove/${data.id}`,{'_method':'delete'},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    })
      .then(response => {
        setInWishlist(false);
        setShowNotification(true);
        setAlertType('alert-success');
        setMessage('Removed from wishlist');
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch(error => {
        console.error('Error removing from wishlist:', error);
      });
  };

  return (
    <>
      <Notification
        message={message}
        visible={showNotification} 
        typ={alertType}
      />
      <div className="col-md-3">
        <div className="card product-card">
          <div className="product-image position-relative">
            <Link to={`/shop/products/${data.slug}`} className="product-img">
              <img className="card-img-top p-1" style={{ borderRadius: '10px 10px 0 0' }} src={`${import.meta.env.VITE_API_IMAGE}/products/${data.featured_image}`} alt={data.name} />
            </Link>

            <a className="wishlist ms-2" href="#!" onClick={(e) => {
              e.preventDefault();
              inWishlist ? handleRemoveFromWishlist() : handleAddToWishlist();
            }}>
              <i className={inWishlist ? 'fas fa-heart text-danger' : 'far fa-heart'}></i>
            </a>

            <div className="product-action">
              {!isItemInCart ? 
                <button className='btn btn-dark' onClick={handleAddToCart}>
                  <i className="fa fa-shopping-cart"></i>
                  Add To Cart
                </button> :
                <button className='btn btn-danger btn-sm' style={{ fontSize: 'small' }} onClick={() => removeItem(data.id)}>
                  <i className="fa fa-shopping-cart"></i>
                  Remove from Cart
                </button>
              }
            </div>
          </div>
          <div className="card-body text-center mt-2">
            <Link className="h6 link" to={`/shop/products/${data.slug}`}>
              {data.title}
            </Link>
            <div className="price mt-2">
              <span>
                <strong>${data.price}</strong>
              </span>
              {data.compare_price > 0 && (
                <span className="text-underline text-danger ms-2">
                  <del>{data.compare_price}</del>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;

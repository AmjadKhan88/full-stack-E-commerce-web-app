import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import Notification from "../../notification/Notification";
import { Link } from "react-router-dom";
import UsePersistentCart from "../../Global/UsePersistentCart";
import { Image } from "react-bootstrap";
import axios from "axios";

function FeatureProductLoop({ value }) {
  const token =localStorage.getItem('userToken');
  const { addItem, items } = useCart();
  const { removeItem } = UsePersistentCart();
  const [inWishlist, setInWishlist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("text-success");
  // Check if the item is already in the cart
  const isItemInCart = items.some((item) => item.id === value.id);

  const handleAddToCart = () => {
    if (isItemInCart) {
      setShowNotification(true);
      setAlertType("alert-danger");
      setMessage("item already in the cart");
      setTimeout(() => setShowNotification(false), 3000);
    } else {
      addItem({ ...value, quantity: 1 });
      setShowNotification(true);
      setAlertType("alert-success");
      setMessage("Succfully added item");
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleAddToWishlist = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/wishlist/add/${value.id}`,{},
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
    axios.post(`${import.meta.env.VITE_API_URL}/wishlist/remove/${value.id}`,{'_method':'delete'},{
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

  useEffect(() => {
    // Check if product is in wishlist when component mounts
    axios.get(`${import.meta.env.VITE_API_URL}/wishlist/check/${value.id}`,{
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
  }, [value.id]);
  return (
    <>
      <Notification
        message={message}
        visible={showNotification}
        typ={alertType}
      />
      <div key={value.id} className="col-md-2">
        <div className="card product-card">
          <div className="product-image position-relative">
            <Link to={`/shop/products/${value.slug}`} className="product-img">
              <Image
                className="card-img-top"
                src={`${import.meta.env.VITE_API_IMAGE}/products/${
                  value.featured_image
                }`}
                alt={value.featured_image}
                thumbnail
              />
            </Link>
            <a
              className="wishlist ms-2"
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                inWishlist ? handleRemoveFromWishlist() : handleAddToWishlist();
              }}
            >
              <i
                className={
                  inWishlist ? "fas fa-heart text-danger" : "far fa-heart"
                }
              ></i>
            </a>

            <div className="product-action">
              {!isItemInCart ? (
                <button className="btn btn-dark" onClick={handleAddToCart}>
                  <i className="fa fa-shopping-cart"></i> Add To Cart
                </button>
              ) : (
                <button
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: "small" }}
                  onClick={() => removeItem(value.id)}
                >
                  <i className="fa fa-shopping-cart"></i> Remove from Cart
                </button>
              )}
            </div>
          </div>
          <div className="card-body text-center mt-2">
            <Link className="h6 link" to={`/shop/products/${value.slug}`}>
              {value.title.length > 14
                ? `${value.title.slice(0, 14) + ".."}`
                : value.title}
            </Link>
            <div className="price mt-2">
              <span className="">
                <strong>${value.price}</strong>
              </span>
              {value.compare_price > 0 ? (
                <span className=" text-underline ms-2 text-danger">
                  <del>${value.compare_price}</del>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeatureProductLoop;

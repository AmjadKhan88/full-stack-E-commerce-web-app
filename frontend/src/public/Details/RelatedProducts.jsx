import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from 'react-use-cart';
import Notification from '../../notification/Notification';
import UsePersistentCart from '../../Global/UsePersistentCart';
function RelatedProducts({data}) {
  const { removeItem } = UsePersistentCart();

    const { addItem, items } = useCart();
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('text-success');
    // Check if the item is already in the cart
    const isItemInCart = items.some(item => item.id === data.id);
  
    const handleAddToCart = () => {
      if (isItemInCart) {
        setShowNotification(true);
        setAlertType('alert-danger');
        setMessage('item already in the cart');
      setTimeout(() => setShowNotification(false), 3000); 
      } else {
        addItem({ ...data, quantity: 1 });
        setShowNotification(true);
        setAlertType('alert-success');
        setMessage('Succfully added item');
        setTimeout(() => setShowNotification(false), 3000);
      }
    };
  return (
    <>
     <Notification
        message={message}
        visible={showNotification} 
        typ={alertType}
      />
    <div id="related-products" className="col-md-2">
        <div className="card product-card">
                        <div className="product-image position-relative">
                            <Link to={`/shop/products/${data.slug}`} className="product-img"><img className="card-img-top" src={`${import.meta.env.VITE_API_IMAGE}/products/${data.featured_image}`} alt=""/></Link>
                            <a className="whishlist" href="222"><i className="far fa-heart"></i></a>                            

                            <div className="product-action">
                             {!isItemInCart ?  <button className="btn btn-dark" onClick={handleAddToCart}>
                                    <i className="fa fa-shopping-cart"></i> Add To Cart
                                </button>    :                        
                                <button className="btn btn-danger btn-sm" style={{fontSize:'small'}} onClick={() => removeItem(data.id)}>
                                    <i className="fa fa-shopping-cart"></i> Remove from Cart
                                </button> 
                            }                           
                            </div>
                        </div>                        
                        <div className="card-body text-center mt-3">
                            <Link className="h6 link" to={`/shop/products/${data.slug}`}>{data.title}</Link>
                            <div className="price mt-2">
                                <span className="h5"><strong>${data.price}</strong></span>
                               {data.compare_price && <span className="h6 text-underline ms-2 text-danger"><del>${data.compare_price}</del></span>}
                            </div>
                        </div>                        
                    </div> 
                    </div>
    </>
  )
}

export default RelatedProducts

import React, { useEffect, useState } from 'react'
import RelatedProducts from './RelatedProducts'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios';
import { useCart } from 'react-use-cart';
import Notification from '../../notification/Notification';
import UsePersistentCart from '../../Global/UsePersistentCart';
function Product() {
    const { removeItem, emptyCart } = UsePersistentCart();

    const { slug } = useParams();
    const [loader, setLoader] = useState(false);
    const [product, setProduct] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addItem, items } = useCart();
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('text-success');

    // Check if the item is already in the cart
    const isItemInCart = items.some(item => item.id === product.id);
    const handleAddToCart = () => {
      if (isItemInCart) {
        setShowNotification(true);
        setAlertType('alert-danger');
        setMessage('item already in the cart');
      setTimeout(() => setShowNotification(false), 3000); 
      } else {
        addItem({ ...product, quantity: 1 });
        setShowNotification(true);
        setAlertType('alert-success');
        setMessage('Succfully added item');
        setTimeout(() => setShowNotification(false), 3000);
      }
    };
    
    const SingleProduct = async ()=> {
        setLoader(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/singleProduct/${slug}`);
            
            if(response.status === 200) {
                setProduct(response.data.product)
                setRelatedProducts(response.data.related_products? response.data.related_products : []);
                // console.log(response.data);
                setLoader(false);
            }
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    };
    
    useEffect(() => {
        SingleProduct();
         // Initialize carousel if using Bootstrap or any other library
         const carouselElement = document.querySelector('#product-carousel');
         if (carouselElement) {
             new bootstrap.Carousel(carouselElement, {
                 interval: 2000,
                 wrap: true
             });
         }
    }, [slug]);
  return (
    <>
     <Notification
        message={message}
        visible={showNotification} 
        typ={alertType}
      />
      <main>
    <section className="section-5 pt-3 pb-3 mb-3 bg-white">
        <div className="container">
            <div className="light-font">
                <ol className="breadcrumb primary-color mb-0">
                    <li className="breadcrumb-item"><Link className="white-text" to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link className="white-text" to="/shop">Shop</Link></li>
                    <li className="breadcrumb-item">{product.title}</li>
                </ol>
            </div>
        </div>
    </section>

    <section className="section-7 pt-3 mb-3">
        <div className="container">
        {(loader)? 
                <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div> :

            <>
               {product && 
            <div className="row ">
               
                 <div className="col-md-5">
                    <div id="product-carousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner bg-light">
                        {(product.images && product.images.length > 0)?
                            
                            product.images.map((img, index) => (
                                <div key={img} className={`carousel-item ${(index === 0)? 'active':null}`}>
                                    <img className="w-100 h-100" src={`${import.meta.env.VITE_API_IMAGE}/products/${img}`} alt="Image" />
                                </div>
                            ))                            
                           :
                           <div className="carousel-item active">
                                <img className="w-100 h-100" src={`${import.meta.env.VITE_API_IMAGE}/products/${product.featured_image}`} alt="Image"/>
                            </div>
                        }
                        </div>
                        <a className="carousel-control-prev" href="#product-carousel" data-bs-slide="prev">
                            <i className="fa fa-2x fa-angle-left text-dark"></i>
                        </a>
                        <a className="carousel-control-next" href="#product-carousel" data-bs-slide="next">
                            <i className="fa fa-2x fa-angle-right text-dark"></i>
                        </a>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="bg-light right">
                        <h1>{product.title}</h1>
                        <div className="d-flex mb-3">
                            <div className="text-primary mr-2">
                                <small className="fas fa-star"></small>
                                <small className="fas fa-star"></small>
                                <small className="fas fa-star"></small>
                                <small className="fas fa-star-half-alt"></small>
                                <small className="far fa-star"></small>
                            </div>
                            <small className="pt-1">(99 Reviews)</small>
                        </div>
                       {product.compare_price > 0 && <h2 className="price text-secondary"><del>${product.compare_price}</del></h2>}
                        <h2 className="price ">${product.price}</h2>

                        <p dangerouslySetInnerHTML={{__html: product.short_description}}></p>
                       {!isItemInCart ?  <button className='btn btn-dark' onClick={handleAddToCart}><i className="fas fa-shopping-cart"></i> &nbsp;ADD TO CART</button>
                       : <button className='btn btn-danger' onClick={() => removeItem(product.id)}><i className="fas fa-close"></i> &nbsp;Remove from cart</button>
                        }
                    </div>
                </div>

                <div className="col-md-12 mt-5">
                    <div className="bg-light">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="true">Description</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="shipping-tab" data-bs-toggle="tab" data-bs-target="#shipping" type="button" role="tab" aria-controls="shipping" aria-selected="false">Shipping & Returns</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">Reviews</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                                <p dangerouslySetInnerHTML={{__html: product.description}}>
                                    
                                </p>
                            </div>
                            <div className="tab-pane fade" id="shipping" role="tabpanel" aria-labelledby="shipping-tab">
                            <p dangerouslySetInnerHTML={{__html: product.shipping_returns}}></p>
                            </div>
                            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                            
                            </div>
                        </div>
                    </div>
                </div> 
               
                {/* // end of content  */}

            </div>      
            }
             </>
             }     
        </div>
    </section>

    {/* // show related products  */}
    <section className="pt-5 section-8">
        <div className="container">
            <div className="section-title">
                <h2>Related Products</h2>
            </div> 
            <div className="row">
                
                {relatedProducts && 
                relatedProducts.map((value)=>(
                  <RelatedProducts key={value.id} data={value}/>
                ))
                }
                 
            </div>
        </div>
    </section>
</main>
    </>
  )
}

export default Product

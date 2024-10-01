import React, { useState } from 'react'

import carouselm1 from '../../../public/frontend/images/carousel-1-m.jpg'
import carousel1 from '../../../public/frontend/images/carousel-1.jpg'
import carouselm2 from '../../../public/frontend/images/carousel-2-m.jpg'
import carousel2 from '../../../public/frontend/images/carousel-2.jpg'
import carouselm3 from '../../../public/frontend/images/carousel-3-m.jpg'
import carousel3 from '../../../public/frontend/images/carousel-3.jpg'
import axios from 'axios'
import HomeCategory from './HomeCategory'
import FeatureProduct from './FeatureProduct'
import LatestProduct from './LatestProduct'
import { Link } from 'react-router-dom'


function Home() {
    const [loading, setLoading] = useState(false);

    const fetchData =async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/frontend`)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };


  return (
    <>
      <main>
    <section className="section-1">
        <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="false">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    {/* <!-- <img src="images/carousel-1.jpg" className="d-block w-100" alt=""> --> */}

                    <picture>
                        <source media="(max-width: 799px)" srcSet={carouselm1} />
                        <source media="(min-width: 800px)" srcSet={carouselm1} />
                        <img src={carousel1} alt="" />
                    </picture>

                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                        <div className="p-3">
                            <h1 className="display-4 text-white mb-3">Kids Fashion</h1>
                            <p className="mx-md-5 px-5">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                            <Link className="btn btn-outline-light py-2 px-4 mt-3" to="/shop">Shop Now</Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    
                    <picture>
                        <source media="(max-width: 799px)" srcSet={carouselm2} />
                        <source media="(min-width: 800px)" srcSet={carouselm2} />
                        <img src={carousel2} alt="" />
                    </picture>

                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                        <div className="p-3">
                            <h1 className="display-4 text-white mb-3">Womens Fashion</h1>
                            <p className="mx-md-5 px-5">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                            <Link className="btn btn-outline-light py-2 px-4 mt-3" to="/shop">Shop Now</Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    {/* <!-- <img src="images/carousel-3.jpg" className="d-block w-100" alt=""> --> */}

                    <picture>
                        <source media="(max-width: 799px)" srcSet={carouselm3} />
                        <source media="(min-width: 800px)" srcSet={carouselm3} />
                        <img src={carousel3} alt="" />
                    </picture>

                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                        <div className="p-3">
                            <h1 className="display-4 text-white mb-3">Shop Online at Flat 70% off on Branded Clothes</h1>
                            <p className="mx-md-5 px-5">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                            <Link className="btn btn-outline-light py-2 px-4 mt-3" to="/shop">Shop Now</Link>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    </section>
    <section className="section-2">
        <div className="container">
            <div className="row">
                <div className="col-lg-3">
                    <div className="box shadow-lg">
                        <div className="fa icon fa-check text-primary m-0 mr-3"></div>
                        <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
                    </div>                    
                </div>
                <div className="col-lg-3 ">
                    <div className="box shadow-lg">
                        <div className="fa icon fa-shipping-fast text-primary m-0 mr-3"></div>
                        <h2 className="font-weight-semi-bold m-0">Free Shipping</h2>
                    </div>                    
                </div>
                <div className="col-lg-3">
                    <div className="box shadow-lg">
                        <div className="fa icon fa-exchange-alt text-primary m-0 mr-3"></div>
                        <h2 className="font-weight-semi-bold m-0">14-Day Return</h2>
                    </div>                    
                </div>
                <div className="col-lg-3 ">
                    <div className="box shadow-lg">
                        <div className="fa icon fa-phone-volume text-primary m-0 mr-3"></div>
                        <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
                    </div>                    
                </div>
            </div>
        </div>
    </section>
    <section className="section-3">
    <div className="container">
            <div className="section-title">
                <h2>Categories</h2>
            </div>
            <div  className="row pb-3">
       <HomeCategory/>
       </div>
    </div>
    </section>
    
    <section className="section-4 pt-5">
        <div className="container">
            <div className="section-title">
                <h2>Featured Products</h2>
            </div>    
            <div className="row pb-3">
              <FeatureProduct/>            
            </div>
        </div>
    </section>

    <section className="section-4 pt-5">
        <div className="container">
            <div className="section-title">
                <h2>Latest Produsts</h2>
            </div>    
            <div className="row pb-3">
               <LatestProduct/>
            </div>
        </div>
    </section>
</main>
    </>
  )
}

export default Home

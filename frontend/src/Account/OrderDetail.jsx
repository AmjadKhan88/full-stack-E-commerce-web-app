import React from 'react'
import { Link } from 'react-router-dom'

function OrderDetail() {
  return (
    <>
      <main>
    <section className="section-5 pt-3 pb-3 mb-3 bg-white">
        <div className="container">
            <div className="light-font">
                <ol className="breadcrumb primary-color mb-0">
                    <li className="breadcrumb-item"><Link className="white-text" to="/my-account">My Account</Link></li>
                    <li className="breadcrumb-item"><Link className="white-text" to="/my-account/my-orders">My Oders</Link></li>
                    <li className="breadcrumb-item">my order details</li>
                </ol>
            </div>
        </div>
    </section>

    <section className=" section-11 ">
        <div className="container  mt-5">
            <div className="row">
                
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="h5 mb-0 pt-2 pb-2">My Orders</h2>
                        </div>

                        <div className="card-body pb-0">
                            {/* <!-- Info --> */}
                            <div className="card card-sm">
                                <div className="card-body bg-light mb-3">
                                    <div className="row">
                                        <div className="col-6 col-lg-3">
                                            {/* <!-- Heading --> */}
                                            <h6 className="heading-xxxs text-muted">Order No:</h6>
                                            {/* <!-- Text --> */}
                                            <p className="mb-lg-0 fs-sm fw-bold">
                                            673290789
                                            </p>
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            {/* <!-- Heading --> */}
                                            <h6 className="heading-xxxs text-muted">Shipped date:</h6>
                                            {/* <!-- Text --> */}
                                            <p className="mb-lg-0 fs-sm fw-bold">
                                                <time datetime="2019-10-01">
                                                    01 Oct, 2019
                                                </time>
                                            </p>
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            {/* <!-- Heading --> */}
                                            <h6 className="heading-xxxs text-muted">Status:</h6>
                                            {/* <!-- Text --> */}
                                            <p className="mb-0 fs-sm fw-bold">
                                            Awating Delivery
                                            </p>
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            {/* <!-- Heading --> */}
                                            <h6 className="heading-xxxs text-muted">Order Amount:</h6>
                                            {/* <!-- Text --> */}
                                            <p className="mb-0 fs-sm fw-bold">
                                            $259.00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer p-3">

                            {/* <!-- Heading --> */}
                            <h6 className="mb-7 h5 mt-4">Order Items (3)</h6>

                            {/* <!-- Divider --> */}
                            <hr className="my-3"/>

                            {/* <!-- List group --> */}
                            <ul>
                                <li className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col-4 col-md-3 col-xl-2">
                                            {/* <!-- Image --> */}
                                            <a href="product.html"><img src="images/product-1.jpg" alt="..." className="img-fluid"/></a>
                                        </div>
                                        <div className="col">
                                            {/* <!-- Title --> */}
                                            <p className="mb-4 fs-sm fw-bold">
                                                <a className="text-body" href="product.html">Cotton floral print Dress x 1</a> <br/>
                                                <span className="text-muted">$40.00</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col-4 col-md-3 col-xl-2">
                                            {/* <!-- Image --> */}
                                            <a href="#"><img src="images/product-2.jpg" alt="..." className="img-fluid"/></a>
                                        </div>
                                        <div className="col">
                                            {/* <!-- Title --> */}
                                            <p className="mb-4 fs-sm fw-bold">
                                                <a className="text-body" href="#">Suede cross body Bag x 1</a> <br/>
                                                <span className="text-muted">$49.00</span>
                                            </p>                                       
                                        </div>
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col-4 col-md-3 col-xl-2">
                                            {/* <!-- Image --> */}
                                            <a href="#"><img src="images/product-3.jpg" alt="..." className="img-fluid"/></a>

                                        </div>
                                        <div className="col">

                                            {/* <!-- Title --> */}
                                            <p className="mb-4 fs-sm fw-bold">
                                                <a className="text-body" href="#">Sweatshirt with Pocket</a> <br/>
                                                <span className="text-muted">$39.00</span>
                                            </p>
                                            
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>                      
                    </div>
                    
                    <div className="card card-lg mb-5 mt-3">
                        <div className="card-body">
                            {/* <!-- Heading --> */}
                            <h6 className="mt-0 mb-3 h5">Order Total</h6>

                            {/* <!-- List group --> */}
                            <ul>
                                <li className="list-group-item d-flex">
                                    <span>Subtotal</span>
                                    <span className="ms-auto">$128.00</span>
                                </li>
                                <li className="list-group-item d-flex">
                                    <span>Tax</span>
                                    <span className="ms-auto">$0.00</span>
                                </li>
                                <li className="list-group-item d-flex">
                                    <span>Shipping</span>
                                    <span className="ms-auto">$8.00</span>
                                </li>
                                <li className="list-group-item d-flex fs-lg fw-bold">
                                    <span>Total</span>
                                    <span className="ms-auto">$136.00</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
    </>
  )
}

export default OrderDetail

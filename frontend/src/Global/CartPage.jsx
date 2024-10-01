import React, { useEffect } from 'react';
import UsePersistentCart from './UsePersistentCart'; // Import your custom hook
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeItem, updateItemQuantity, emptyCart } = UsePersistentCart();

  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  


  // Calculate total
  const total = subtotal;



  return (
    <>
      <main>
        <section className="section-5 pt-3 pb-3 mb-3 bg-white">
          <div className="container">
            <div className="light-font">
              <ol className="breadcrumb primary-color mb-0">
                <li className="breadcrumb-item">
                  <Link className="white-text" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link className="white-text" to="/shop">
                    shop
                  </Link>
                </li>
                <li className="breadcrumb-item">Cart</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section-9 pt-4">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="table-responsive">
                  <table className="table" id="cart">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length > 0 ? (
                        items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <img
                                  src={`http://localhost:8000/uploads/products/${item.featured_image}`}
                                  width={30}
                                  height=""
                                  alt={item.title}
                                />
                                <h2 className='text-start'>{item.title}</h2>
                              </div>
                            </td>
                            <td>${item.price}</td>
                            <td>
                              <div
                                className="input-group quantity mx-auto"
                                style={{ width: "100px" }}
                              >
                                <div className="input-group-btn">
                                  <button
                                    disabled={item.quantity <= 1}
                                    className="btn btn-sm btn-dark btn-minus p-2 pt-1 pb-1"
                                    onClick={() =>
                                      updateItemQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    <i className="fa fa-minus"></i>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  className="form-control form-control-sm border-0 text-center mx-2"
                                  style={{ marginTop: "21px" }}
                                  value={item.quantity}
                                  readOnly
                                />
                                <div className="input-group-btn">
                                  <button
                                    className="btn btn-sm btn-dark btn-plus p-2 pt-1 pb-1"
                                    onClick={() =>
                                      updateItemQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    <i className="fa fa-plus"></i>
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>${item.price * item.quantity}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeItem(item.id)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <h3>No products found</h3>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card cart-summery">
                  <div className="card-body">
                    <div className="sub-title">
                      <h3 className="bg-white">Cart Summary</h3>
                    </div>
                    <div className="d-flex justify-content-between pb-2">
                      <div>Subtotal</div>
                      <div>${subtotal}</div>
                    </div>

                    <div className="pt-5">
                      <Link
                        to="/my-account/checkout"
                        className="btn-dark btn btn-block w-100"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
                {/* <div className="input-group apply-coupon mt-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="form-control"
                  />
                  <button
                    className="btn btn-dark"
                    type="button"
                    id="button-addon2"
                  >
                    Apply Coupon
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CartPage;

import React, { useEffect, useState } from 'react'
import UsePersistentCart from '../Global/UsePersistentCart';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

function Checkout() {
  const { items, removeItem, updateItemQuantity, emptyCart } =
    UsePersistentCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [country, setCountry] = useState();
  const [countryLoding, setCountryLoading] = useState(false);
  const [phone, setPhone] = useState(""); // State to hold phone number
  const [pymentMethod, setPaymentMethod] = useState(false);
  const [loader, setLoader] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(50);

  const getCountry = async () => {
    setCountryLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/country`
      );
      if (response.status === 200) {
        setCountry(response.data.country);
        setCountryLoading(false);
      }
    } catch (error) {
      console.error(error);
      setCountryLoading(false);
    }
  };
  useEffect(() => {
    getCountry();
  }, []);
  
  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // Frontend validation
  const first_name = {
    required: { value: true, message: "The first_name field is required" },
    minLength: { value: 3, message: "Minimum value is 3" },
    maxLength: { value: 30, message: "Maximum value is 50" },
  };
  const last_name = {
    required: { value: true, message: "The last_name field is required" },
    minLength: { value: 3, message: "Minimum value is 3" },
    maxLength: { value: 30, message: "Maximum value is 50" },
  };
  const email = {
    required: { value: true, message: "The email field is required" },
    minLength: { value: 3, message: "Minimum value is 3" },
    maxLength: { value: 50, message: "Maximum value is 50" },
  };
  const address = {
    required: { value: true, message: "The address field is required" },
    minLength: { value: 10, message: "Minimum value is 10" },
    maxLength: { value: 150, message: "Maximum value is 150" },
  };
 
  const city = {
    required: { value: true, message: "The appartment field is required" },
    minLength: { value: 5, message: "Minimum value is 10" },
    maxLength: { value: 100, message: "Maximum value is 100" },
  };
  const zip = {
    required: { value: true, message: "The appartment field is required" },
    minLength: { value: 3, message: "Minimum value is 3" },
    maxLength: { value: 100, message: "Maximum value is 100" },
  };
  const state = {
    required: { value: true, message: "The state field is required" },
    minLength: { value: 3, message: "Minimum value is 3" },
    maxLength: { value: 100, message: "Maximum value is 100" },
  };
  const countries = {
    required: { value: true, message: "The country field is required" },
  };

  // handle country change
  const handleCuntryChange = (e)=> {
      setValue('country', e.target.value);

      getShippingCharge(watch('country'));
  };

  // handle cod change for payment methods
  const handleCheckBox = (e)=> {
      if(e.target.checked){
        setPaymentMethod(true);
        setValue('cod','cod');
      }else{
        setPaymentMethod(false);
        setValue('cod','');
      }
  }

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append("phone", phone);
    if (pymentMethod){
      formData.append("sub_total", total);
      formData.append("items", JSON.stringify(items)); // Serialize the items array
    }
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/orders/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Include cookies in the request
          }
        );

        if (response.status === 200) {
          console.log(response.data.message);
          emptyCart();
          setLoader(false);
          navigate("/my-account/my-orders");
        }
      } catch (err) {
        console.error("Error submitting form:", err);
        setLoader(false);
      }
  };
  // Calculate subtotal
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

    let totalItem = 0;

    items.map((item)=>{
      totalItem += item.quantity;
    })

  // Define shipping cost
  const shippingCost = shippingCharge * totalItem; // or calculate based on some logic

  // Calculate total
  const total = subtotal + shippingCost;

  // get userInfo from server
  const getuserInfo =async ()=>{
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getuseraddress`,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if(response.status === 200){
          const userInfo =response.data.user;
            setValue('first_name', userInfo?.first_name);
            setValue('last_name', userInfo?.last_name);
            setValue('email', userInfo?.email);
            setValue('country',userInfo?.country_id);
            setValue('address',userInfo?.address);
            setValue('city',userInfo?.city);
            setPhone(userInfo?.mobile);
            setValue('state',userInfo?.state);
            setValue('zip',userInfo?.zip);
            setValue('notes',userInfo?.notes);
            setValue("apartment", userInfo?.apartment);
        }
      } catch (error) {
        console.log(error)
      }
  }


  const getShippingCharge =async (id) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/shipping/get/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            if(response.status === 200) {
                setShippingCharge(response.data.charge.amount? response.data.charge.amount: 50);
            }
          } catch (error) {
              console.log(error)
          }
  }

  useEffect(() => {
      getuserInfo();
  }, [ ]);

    
  
  return (
    <main>
      <section className="section-5 pt-3 pb-3 mb-3 bg-white">
        <div className="container">
          <div className="light-font">
            <ol className="breadcrumb primary-color mb-0">
              <li className="breadcrumb-item">
                <Link className="white-text" href="/shop">
                  Shop
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link className="white-text" href="/my-account">
                  My account
                </Link>
              </li>
              <li className="breadcrumb-item">Checkout</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section-9 pt-4">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-8">
                <div className="sub-title">
                  <h2>Shipping Address</h2>
                </div>
                <div className="card shadow-lg border-0">
                  <div className="card-body checkout-form">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="form-control"
                            placeholder="First Name"
                            {...register("first_name", first_name)}
                          />
                          {errors.first_name && (
                            <span className="text-danger">
                              {errors.first_name.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="form-control"
                            placeholder="Last Name"
                            {...register("last_name", last_name)}
                          />
                          {errors.last_name && (
                            <span className="text-danger">
                              {errors.last_name.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="email"
                            id="email"
                            className="form-control"
                            placeholder="Email"
                            {...register("email", email)}
                          />
                          {errors.email && (
                            <span className="text-danger">
                              {errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          {countryLoding ? (
                            "loading.."
                          ) : (
                            <select
                              name="country"
                              id="country"
                              className="form-control pb-0 text-secondary"
                              {...register("country", countries)}
                              onChange={handleCuntryChange}
                            >
                              <option value="">Select a Country</option>
                              {country &&
                                country.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.name}
                                  </option>
                                ))}
                            </select>
                          )}
                          {errors.countries && (
                            <span className="text-danger">
                              {errors.countries.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <textarea
                            name="address"
                            id="address"
                            cols="30"
                            rows="3"
                            placeholder="Address"
                            className="form-control"
                            {...register("address", address)}
                          ></textarea>
                          {errors.address && (
                            <span className="text-danger">
                              {errors.address.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="apartment"
                            id="appartment"
                            className="form-control"
                            placeholder="Apartment, suite, unit, etc. (optional)"
                            {...register("apartment")}
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="form-control"
                            placeholder="City"
                            {...register("city", city)}
                          />
                          {errors.city && (
                            <span className="text-danger">
                              {errors.city.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="state"
                            id="state"
                            className="form-control"
                            placeholder="State"
                            {...register("state", state)}
                          />
                          {errors.state && (
                            <span className="text-danger">
                              {errors.state.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="zip"
                            id="zip"
                            className="form-control"
                            placeholder="Zip"
                            {...register("zip", zip)}
                          />
                          {errors.zip && (
                            <span className="text-danger">
                              {errors.zip.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <PhoneInput
                            country={"us"}
                            value={phone} // Use phone state
                            onChange={(phone) => setPhone(phone)} // Update phone state on change
                            inputClass="form-control"
                            placeholder="Mobile No"
                          />
                          {errors.mobile && (
                            <span className="text-danger">
                              {errors.mobile.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <textarea
                            name="order_notes"
                            id="order_notes"
                            cols="30"
                            rows="2"
                            placeholder="Order Notes (optional)"
                            className="form-control"
                            {...register("order_notes")}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="sub-title">
                  <h3>Order Summery</h3>
                </div>
                <div className="card cart-summery">
                  <table className="table table-striped fs-6 table-sm">
                    <thead className="bg-light">
                      <th>name</th>
                      <th>qty</th>
                      <th>T_price</th>
                    </thead>
                    <tbody>
                      {items &&
                        items.map((item) => (
                          <tr key={item.id}>
                            <td>{`${item.title.slice(0, 17) + ".."}`}</td>
                            <td>{item.quantity}</td>
                            <td>${item.itemTotal}</td>
                          </tr>
                        ))}
                      <tr className="text-primary">
                        <td>Shipping Charge</td>
                        <td className='text-primary' colSpan={2}>${shippingCharge + " * " + totalItem + ' = ' + '$'+shippingCharge*totalItem}</td>
                      </tr>
                      <tr className="text-info">
                        <td colSpan={2}>Total Price</td>
                        <td>${total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="input-group apply-coupan mt4">
                  <input type="text" placeholder='Coupon Code' className="form-control" />
                  <button type='button' id='button-addon2' className="btn btn-dark m-0 py-1">Apply Coupon</button>
                </div>
                <div className="card payment-form ">
                  <h3 className="card-title h5 mb-3">Payment Method</h3>

                  <div className="form-check ms-0 mb-3">
                    <input
                      type="checkbox"
                      onChange={handleCheckBox}
                      width={100}
                      name="pyment_method"
                      id="payment_1"
                    />
                    <label
                      htmlFor="payment_1"
                      className="form-check-label text-dark ms-2 fs-6"
                      style={{ transform: "translateY(0)", cursor: "pointer" }}
                    >
                      COD
                    </label>
                  </div>
                  {pymentMethod ? (
                    ""
                  ) : (
                    <div className="card-body p-0">
                      <div className="mb-3">
                        <label htmlFor="card_number" className="mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="card_number"
                          id="card_number"
                          placeholder="Valid Card Number"
                          className="form-control"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="expiry_date" className="mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry_date"
                            id="expiry_date"
                            placeholder="MM/YYYY"
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="expiry_date" className="mb-2">
                            CVV Code
                          </label>
                          <input
                            type="text"
                            name="expiry_date"
                            id="expiry_date"
                            placeholder="123"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="pt-4">
                    <button disabled={loader} className="btn btn-primary">
                      {loader ? (
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                  </div>
                </div>

                {/* <!-- CREDIT CARD FORM ENDS HERE --> */}
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Checkout

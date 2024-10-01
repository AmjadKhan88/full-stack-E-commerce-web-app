import React, {useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { data } from "jquery";

function ShippingInsert() {
  const [country, setCountry] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const getCountry = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/country`
      );
      if (response.status === 200) {
        setCountry(response.data.country);
        // console.log(response.data.country);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);
  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shipping/store`,
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
        setLoader(false);
        navigate("/admin/shipping");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoader(false);
    }
  };

  const changeHandler = (e) => {
    setValue('country',e.target.value);
    // console.log(e.target.value);

  };

  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid my-2">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Shipping Insert</h1>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/admin/shipping" className="btn btn-primary">
                  Back
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label>Select Country</label>
                        {country && (
                          <select
                            {...register("country", {
                              required: "Country field is required",
                            })}
                            name=""
                            defaultValue=""
                            onChange={changeHandler}
                            className="form-control"
                          >
                            <option value="">select country</option>
                            {country &&
                              country.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        )}
                        {errors.country && (
                          <span className="text-danger">
                            {errors.country.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="amount">Amount</label>
                        <input
                          type="number"
                          {...register("amount",{required:'Amount feild is required',})}
                          id="amount"
                          className="form-control"
                          placeholder="amount"
                        />
                        {errors.amount && (
                          <span className="text-danger">
                            {errors.amount.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-5 pt-3">
                <button disabled={loader} className="btn btn-primary">
                  {loader ? (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Create"
                  )}
                </button>
                <Link
                  to="/admin/category"
                  className="btn btn-outline-dark ml-3"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default ShippingInsert;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

function ShippingUpdate() {
    const {id} = useParams();
  const [country, setCountry] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [oldReloading, setOldReloading] = useState(false);

  const getCountry = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/country`
      );
      if (response.status === 200) {
        setCountry(response.data.country);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get old shipping records
  const GetOldShipping =async ()=>{
        setOldReloading(true); //
      const  token = localStorage.getItem('userToken');
        try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/shipping/single/${id}`,{
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            if(response.status === 200) {
                setValue('country_id', response.data.shipping.country_id);
                setValue('amount', response.data.shipping.amount);

                setOldReloading(false);
            }
        } catch (error) {
            console.log(error);
            setOldReloading(false);
        }
  }
  useEffect(() => {
    getCountry();
    GetOldShipping();
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
        `${import.meta.env.VITE_API_URL}/shipping/update/${id}`,
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


  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid my-2">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Shipping Update</h1>
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
                     {(oldReloading)? 'loading...' : <div className="mb-3">
                        <label>Select Country</label>
                        <select
                          {...register("country_id")}
                          name=""
                          className="form-control"
                        >
                          <option>select country</option>
                          {country &&
                            country.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        {errors.country && (
                          <span className="text-danger">
                            {errors.country.message}
                          </span>
                        )}
                      </div>
                     }
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="amount">Amount</label>
                      {oldReloading? 'loading...' :
                       <input
                          type="number"
                          {...register("amount")}
                          id="amount"
                          className="form-control"
                          placeholder="amount"
                        />
                      }
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

export default ShippingUpdate;

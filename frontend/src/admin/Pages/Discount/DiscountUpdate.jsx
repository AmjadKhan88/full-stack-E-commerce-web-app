import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

function DiscountUpdate() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [loader, setLoader] = useState(false);
  const [start_at, setStart_at] = useState('');
  const [expiry_at, setExpiry_at] = useState('');

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // get slug for sub categories
  //   const getSlug = (e) => {
  //     setValue("slug", slugify(e.target.value));
  //   };

  // Frontend validation
  const name = {
    required: { value: true, message: "The name field is required" },
    minLength: { value: 5, message: "Minimum value is 5" },
    maxLength: { value: 30, message: "Maximum value is 30" },
  };

  const code = {
    required: { value: true, message: "The code field is required" },
    minLength: { value: 5, message: "Minimum value is 5" },
    maxLength: { value: 100, message: "Maximum value is 100" },
  };

  const discount_amount = {
    required: { value: true, message: "The discount amount field is required" },
  };

  // validate start time 


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
        `${import.meta.env.VITE_API_URL}/discount/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        setLoader(false);
        navigate("/admin/discounts");
      }
     
    } catch (err) {
      if (err.response.data.errors.starts_at) {
        setStart_at(err.response.data.errors.starts_at);
      }else{
        setStart_at('');
      }
      if (err.response.data.errors.expires_at){
        setExpiry_at(err.response.data.errors.expires_at);
      }else{
        setExpiry_at('');
      }
        
        setLoader(false);
    }
  };

  // get old discount data
  const OldDiscountData =async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/discount/single/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if(response.status === 200) {
          const discount = response.data.discount;
          setValue('code', discount.code);
          setValue('name', discount.name);
          setValue("description", discount.description);
          setValue("discount_amount", discount.discount_amount);
          setValue("expires_at", discount.expires_at? discount.expires_at:'');
          setValue("starts_at", discount.starts_at? discount.starts_at:null);
          setValue("status", discount.status);
          setValue("type", discount.type);
          setValue('min_amount', discount.min_amount? discount.min_amount:'');
          setValue('max_uses_user', discount.max_uses_user);
          setValue('max_uses', discount.max_uses);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
      OldDiscountData();
   $("#starts_at").datetimepicker({
          // options heres
          format: "Y-m-d H:i:s",
        });
        $("#expires_at").datetimepicker({
          // options here
          format: "Y-m-d H:i:s",
        });
     
  },[ ])
  return (
    <div className="content-wrapper">
      {/* <!-- Content Header (Page header) --> */}
      <section className="content-header">
        <div className="container-fluid my-2">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Update Discount</h1>
            </div>
            <div className="col-sm-6 text-right">
              <Link to="/admin/discounts" className="btn btn-primary">
                Back
              </Link>
            </div>
          </div>
        </div>
        {/* <!-- /.container-fluid --> */}
      </section>
      {/* <!-- Main content --> */}
      <section className="content">
        {/* <!-- Default box --> */}
        <div className="container-fluid">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="code">Coupon Code</label>
                      <input
                        type="text"
                        {...register("code", code)}
                        id="code"
                        className="form-control"
                        placeholder="coupon code"
                      />
                      {errors.code && (
                        <span className="text-danger">
                          {errors.code.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        {...register("name", name)}
                        id="name"
                        className="form-control"
                        placeholder="Name"
                      />
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="max_uses">Max Uses</label>
                      <input
                        type="integer"
                        {...register("max_uses")}
                        id="max_uses"
                        className="form-control"
                        placeholder="max uses"
                      />
                      {errors.max_uses && (
                        <span className="text-danger">
                          {errors.max_uses.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="max_uses_user">Max Uses User</label>
                      <input
                        type="integer"
                        {...register("max_uses_user")}
                        id="max_uses_user"
                        className="form-control"
                        placeholder="max uses user"
                      />
                      {errors.max_uses_user && (
                        <span className="text-danger">
                          {errors.max_uses_user.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="discount_amount">Discount Amount</label>
                      <input
                        type="integer"
                        {...register("discount_amount", discount_amount)}
                        id="discount_amount"
                        className="form-control"
                        placeholder="discount amount"
                      />
                      {errors.discount_amount && (
                        <span className="text-danger">
                          {errors.discount_amount.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="type">type</label>
                      <select
                        id="type"
                        defaultValue={"percent"}
                        className="form-control"
                        {...register("type")}
                      >
                        <option value="percent">Percentage</option>
                        <option value="fixed">fixed</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="min_amount">Min Amount</label>
                      <input
                        type="integer"
                        {...register("min_amount")}
                        id="min_amount"
                        className="form-control"
                        placeholder="min amount"
                      />
                      {errors.min_amount && (
                        <span className="text-danger">
                          {errors.min_amount.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="starts_at">Start At</label>
                      <input
                        type="text"
                        {...register("starts_at")}
                        id="starts_at"
                        className="form-control"
                        placeholder="start time "
                        autoComplete="off"
                      />
                      {start_at && (
                        <span className="text-sm text-danger">
                          {start_at}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="expires_at">Expires At</label>
                      <input
                        type="text"
                        {...register("expires_at")}
                        id="expires_at"
                        className="form-control"
                        placeholder="min amount"
                        autoComplete="off"
                      />
                      {expiry_at && (
                        <span className="text-sm text-danger">
                          {expiry_at}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        defaultValue={1}
                        className="form-control"
                        {...register("status")}
                      >
                        <option value="1">true</option>
                        <option value="0">false</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="description">description</label>
                      <textarea
                        name="description"
                        {...register("description")}
                        id="description"
                        className="form-control"
                        placeholder="description"
                      ></textarea>
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
                  "Update"
                )}
              </button>
              <Link to="/admin/discounts" className="btn btn-outline-dark ml-3">
                Cancel
              </Link>
            </div>
          </form>
        </div>
        {/* <!-- /.card --> */}
      </section>
      {/* <!-- /.content --> */}
    </div>
  );
}



export default DiscountUpdate;

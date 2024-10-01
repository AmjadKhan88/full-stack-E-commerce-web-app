import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import slugify from "react-slugify";

function UpdateSubCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reloading, setReloding] = useState(false);
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState(null);

  // fetch the category value for Sub Category
  const Category = async () => {
    setReloding(true);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/category/active`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Include cookies in the request
        }
      );
      if (response.status === 200) {
        setCategory(response.data.category);

        setReloding(false);
      }
    } catch (error) {
      console.log(error);
      setReloding(false);
    }
  };

  useEffect(() => {
    Category();
  }, []);

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // get slug for sub categories
  const getSlug = (e) => {
    setValue("slug", slugify(e.target.value));
  };

  // Frontend validation
  const name = {
    required: { value: true, message: "The name field is required" },
    minLength: { value: 5, message: "Minimum value is 5" },
    maxLength: { value: 30, message: "Maximum value is 30" },
  };

  const slug = {
    required: { value: true, message: "The slug field is required" },
    minLength: { value: 5, message: "Minimum value is 5" },
    maxLength: { value: 30, message: "Maximum value is 30" },
  };

  const category_id = {
    required: { value: true, message: "The category field is required" },
  };

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
        `${import.meta.env.VITE_API_URL}/subcategory/update/${id}`,
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
        navigate("/admin/subcategory");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoader(false);
    }
  };

  const updateCategory = async () => {
    setReloding(true);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/subcategory/single/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSubCategory(response.data.sub_category.category_id);
        setValue("name", response.data.sub_category?.name);
        setValue("slug", response.data.sub_category?.slug);
        setValue("status", response.data.sub_category?.status);
        setReloding(false);
      }
    } catch (error) {
      console.log(error);
      setReloding(false);
    }
  };

  useEffect(() => {
    updateCategory();
  }, []);
  return (
    <div className="content-wrapper">
      {/* <!-- Content Header (Page header) --> */}
      <section className="content-header">
        <div className="container-fluid my-2">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>update Sub Category</h1>
            </div>
            <div className="col-sm-6 text-right">
              <Link to="/admin/subcategory" className="btn btn-primary">
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
          {reloading ? (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name">Category</label>
                        {subCategory ? (
                          <select
                            name="category"
                            id="category"
                            {...register("category_id", category_id)}
                            className="form-control"
                            defaultValue={subCategory ? subCategory : null}
                          >
                            {subCategory} <option>select category</option>
                            {category.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.name}
                              </option>
                            ))}
                          </select>
                        ) : null}
                        {errors.category_id && (
                          <span className="text-danger">
                            {errors.category_id.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          onKeyUp={getSlug}
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
                        <label htmlFor="email">Slug</label>
                        <input
                          type="text"
                          disabled
                          name="slug"
                          {...register("slug", slug)}
                          id="slug"
                          className="form-control"
                          placeholder="Slug"
                        />
                        {errors.slug && (
                          <span className="text-danger">
                            {errors.slug.message}
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
                    "update"
                  )}
                </button>
                <Link
                  to="/admin/subcategory"
                  className="btn btn-outline-dark ml-3"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
        {/* <!-- /.card --> */}
      </section>
      {/* <!-- /.content --> */}
    </div>
  );
}

export default UpdateSubCategory;

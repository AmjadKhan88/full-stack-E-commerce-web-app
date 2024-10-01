import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import slugify from 'react-slugify';

function InsertBrands() {
	const navigate = useNavigate();
	const [loader, setLoader] = useState(false);
	
	  // react-hook-form
	  const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	  } = useForm();
	  // Frontend validation
	  const name = {
		required: { value: true, message: "The name field is required" },
		minLength: { value: 2, message: "Minimum value is 2" },
		maxLength: { value: 30, message: "Maximum value is 30" },
	  };
	
	  const slug = {
		required: { value: true, message: "The slug field is required" },
		minLength: { value: 2, message: "Minimum value is 2" },
		maxLength: { value: 30, message: "Maximum value is 30" },
	  };
	  // get slug for sub categories
	  const getSlug = (e) => {
		setValue("slug", slugify(e.target.value));
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
        `${import.meta.env.VITE_API_URL}/brands/create`,
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
        navigate("/admin/brands");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoader(false);
    }
  };

  return (
    <>
      <div className="content-wrapper">
				{/* <!-- Content Header (Page header) --> */}
				<section className="content-header">					
					<div className="container-fluid my-2">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>Create Brand</h1>
							</div>
							<div className="col-sm-6 text-right">
								<Link to="/admin/brands" className="btn btn-primary">Back</Link>
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
											<label htmlFor="name">Name</label>
											<input type="text" onKeyUp={getSlug} id="name" {...register("name", name)} className="form-control" placeholder="Name"/>
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
											<input type="text" {...register("slug", slug)} id="slug" className="form-control" placeholder="Slug"/>	
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
											<select className='form-control'  id="status" defaultValue={1} {...register("status")}>
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
                      "Create"
                    )}
                  </button>
							<Link to="/admin/brands" className="btn btn-outline-dark ml-3">Cancel</Link>
						</div>
						</form>
					</div>
					{/* <!-- /.card --> */}
				</section>
				{/* <!-- /.content --> */}
			</div>
    </>
  )
}

export default InsertBrands

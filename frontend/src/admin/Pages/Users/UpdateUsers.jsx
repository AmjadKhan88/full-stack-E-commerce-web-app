import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../ImageCrop/cropImage";

function UpdateUsers() {
    const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [show, setShow] = useState(false);
  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  //   form validation
  const name = {
    required: { value: true, message: "the name fild is required" },
    minLength: { value: 5, message: "minimem value is 5" },
    maxLength: { value: 30, message: "maximem value is 30" },
  };

  const email = {
    required: { value: true, message: "the email is required" },
    minLength: { value: 5, message: "minimem value is 5" },
    maxLength: { value: 50, message: "maximem value is 50" },
  };

  const password = {
    required: { value: true, message: "the password is required" },
    minLength: { value: 8, message: "minimem value is 8" },
    maxLength: { value: 30, message: "maximem value is 30" },
  };

  const image ={
    required : {value:true, message: 'the avatr fild is required'},
    validate: {
      // Custom validation example: file size must be less than 2MB
      lessThan2MB: files => files[0]?.size < 3000000 || "File size should be less than 3MB",
      // Custom validation example: file must be an image
      acceptedFormats: files =>
        ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type) || "Only JPEG, PNG, and GIF files are accepted"
    }
  }

  // image crop
  // crop complete function
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  // handle file changes
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setShow(true);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // show cropt image
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);

      // Convert base64 to Blob
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const file = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });
      setValue("croppedImage", file);
    } catch (e) {
      console.error(e);
    }
    setShow(false);
  }, [imageSrc, croppedAreaPixels]);

  // submit form data
  const onSubmit = (data) => {
    setLoader(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('image', data.croppedImage);

    // Handle your form submission to Laravel backend here
    // For example, using Axios to send a POST request
    axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true, // Include cookies in the request
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.message);
          setLoader(false);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  
  };

  return (
    <>
      {/* // crop the image in hook  */}
      {show ? (
        <div className="content-wrapper">
          {show
            ? imageSrc && (
                <div>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropSize={{ width: 400, height: 400 }}
                  />
                  <button className="btn btn-primary"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "20%",
                      zIndex: "1000",
                    }}
                    onClick={showCroppedImage}
                  >
                    crop
                  </button>
                </div>
              )
            : null}
        </div>
      ) : null}

      {/* form submition in handle  */}
      {show ? null : (
        <div className="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <section className="content-header">
            <div className="container-fluid my-2">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Update User</h1>
                </div>
                <div className="col-sm-6 text-right">
                  <Link to="/admin/users" className="btn btn-primary">
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
                    <div className="mx-auto mt-2 mb-2">
                      <input
                        type="file"
                        className="form-control"
                        
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {croppedImage && (
                        <div className="text-center">
                          <h5>Cropped Image:</h5>
                          <img src={croppedImage} height={100} alt="Cropped" />
                        </div>
                      )}
                      <input type="hidden" {...register("image",image)} />
                      {errors.image && (
                            <span className="text-danger">
                              {errors.image.message}
                            </span>
                          )}
                    </div>
                    <div className="row">
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
                          <label htmlFor="email">Email</label>
                          <input
                            type="text"
                            {...register("email", email)}
                            id="email"
                            className="form-control"
                            placeholder="Email"
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
                          <label htmlFor="role">Role</label>
                          <select
                            className="form-control"
                            {...register("role")}
                          >
                            <option value="0">Normall</option>
                            <option value="1">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label htmlFor="password">password</label>
                          <input
                            {...register("password", password)}
                            id="password"
                            className="form-control"
                          />
                          {errors.password && (
                            <span className="text-danger">
                              {errors.password.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pb-5 pt-3">
                  <button disabled={loader} className="btn btn-primary">{(loader)? 'Submitting':'Create'}</button>
                  <Link to="/admin/users" className="btn btn-outline-dark ml-3">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
            {/* <!-- /.card --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
      )}
    </>
  );
}

export default UpdateUsers;

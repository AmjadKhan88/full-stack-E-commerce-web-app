import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import Cropper from "react-easy-crop";
import getCroppedImg from '../ImageCrop/cropImage';
import { useForm } from "react-hook-form";
import slugify from 'react-slugify';
import axios from 'axios';

function InsertCategory() {
    const navigate = useNavigate();
    const fileTypes = ["JPG", "PNG", "GIF"];
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
        setValue,
        formState: { errors },
    } = useForm();

    // image crop
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (file) => {
        if (file) {
            setShow(true);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(croppedImage);

            // Convert base64 to Blob
            const blob = await fetch(croppedImage).then((res) => res.blob());
            const file = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });
            setValue("croppedImage", file);
            setShow(false); // Close the cropper after setting the image
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels, setValue]);

    // Submit form data
    const onSubmit = async (data) => {
        setLoader(true);
        const token = localStorage.getItem("userToken");
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        if (croppedImage) {
            formData.append('image', data.croppedImage);
        } else {
            console.error("No cropped image found!");
            setLoader(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/category/store`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true, // Include cookies in the request
            });

            if (response.status === 200) {
                console.log(response.data.message);
                setLoader(false);
                navigate('/admin/category');
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setLoader(false);
        }
    };

    // Generate slug
    const getSlug = (e) => {
        const value = e.target.value;
        setValue('slug', slugify(value));
    };

    return (
        <>
            {show ? (
                <div className="content-wrapper">
                    {imageSrc && (
                        <div style={{width:'100%',padding:'30px',display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>
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
                            <input
                                type="range"
                                min={-3}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(e.target.value)}
                                style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)" }}
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
                                Crop
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid my-2">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Create Category</h1>
                                </div>
                                <div className="col-sm-6 text-right">
                                    <Link to="/admin/category" className="btn btn-primary">Back</Link>
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
                                                    <label htmlFor="Image">Image</label>
                                                    <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
                                                </div>
                                            </div>
                                            {croppedImage && <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="Image">Selected Image</label>
                                                    <img className='d-block' style={{maxWidth:'100px'}} width={100} src={croppedImage} alt="Selected" />
                                                </div>
                                            </div>}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="name">Name</label>
                                                    <input type="text" onKeyUp={getSlug}  {...register("name")} id="name" className="form-control" placeholder="Name" />
                                                    {errors.name && (
                                                        <span className="text-danger">{errors.name.message}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="slug">Slug</label>
                                                    <input disabled type="text"  {...register("slug")} id="slug" className="form-control" placeholder="Slug" />
                                                    {errors.slug && (
                                                        <span className="text-danger">{errors.slug.message}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="status">Status</label>
                                                    <select defaultValue="1"  {...register("status")} name="status" id="status" className='form-control'>
                                                        <option value="1">true</option>
                                                        <option value="0">false</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="status">Show on Top</label>
                                                    <select defaultValue="No"  {...register("show_on_top")} name="status" id="status" className='form-control'>
                                                        <option value="Yes">true</option>
                                                        <option value="No">false</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pb-5 pt-3">
                                    <button disabled={loader} className="btn btn-primary">
                                        {loader ? <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : 'Create'}
                                    </button>
                                    <Link to="/admin/category" className="btn btn-outline-dark ml-3">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default InsertCategory;

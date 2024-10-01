import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { FileUploader } from "react-drag-drop-files";
import slugify from "react-slugify";
import { Controller, useForm } from "react-hook-form";
import Cropper from "react-easy-crop";
import getCroppedImg from "../ImageCrop/cropImage";
import { MdDelete } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import axios from "axios";
import { PiTagSimple } from "react-icons/pi";
import  Accordion  from "react-bootstrap/Accordion";
function InsertProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [loader, setLoader] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [reloading, setReloading] = useState(false);
  // fetching data from server for product
  const [category, setCategory] = useState([]);
  const [sub_category, setSubCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
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

  // Frontend validation
  const title = {
    required: { value: true, message: "The title field is required" },
    minLength: { value: 5, message: "Minimum value is 5" },
    maxLength: { value: 30, message: "Maximum value is 50" },
  };

  const sku = {
    required: { value: true, message: "The sku field is required" },
  };
  const cheackCategory = {
    required: { value: true, message: "The category field is required" },
  };
  const slug = {
    required: { value: true, message: "The slug field is required" },
  };
  const price = {
    required: { value: true, message: "The price field is required" },
    pattern: {
      value: /^[0-9]+$/,
      message: "The price must be an integer",
    },
  };

  const featured_img = {
    required: { value: true, message: "The featured image field is required" },
  };

  // Generate slug
  const getSlug = (e) => {
    const value = e.target.value;
    setValue("slug", slugify(value));
  };

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (croppedImage) {
      formData.append("featured_image", data.croppedImage);
    } else {
      console.error("No cropped image found!");
      setLoader(false);
      return;
    }

    if (files) {
      files.forEach((file, index) => {
        formData.append(`images[]`, file);
      });
    }
    formData.append("track_qty", data.track_qty ? "Yes" : "No");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/create`,
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
        navigate("/admin/products");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoader(false);
    }
  };

  const handlemultipleChanges = (selectedFiles) => {
    // Log selected files to inspect them
    console.log("Selected files:", selectedFiles);

    // Convert to array and filter to ensure only valid File objects are processed
    const filesArray = Array.from(selectedFiles).filter(
      (file) => file instanceof File
    );

    // Check if filesArray contains valid files
    if (filesArray.length === 0) {
      console.error("No valid files found.");
      return;
    }

    // Set the files state
    setFiles(filesArray);

    // Generate preview URLs for each valid file
    const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleDelete = (index) => {
    // Remove the selected file and preview URL from the state
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    // Update state with the new arrays
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    // Revoke the object URL to release memory
    URL.revokeObjectURL(previews[index]);
  };

  // fetch the category value for brands
  const Category = async () => {
    setReloading(true);
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
        setReloading(false);
      }
    } catch (error) {
      console.log(error);
      setReloading(false);
    }
  };
  // fetch the sub_category value for brands
  const SubCategory = async () => {
    setReloading(true);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/subcategory/active`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Include cookies in the request
        }
      );
      if (response.status === 200) {
        setSubCategory(response.data.sub_category);
        setReloading(false);
      }
    } catch (error) {
      console.log(error);
      setReloading(false);
    }
  };
  // fetch the sub_category value for brands
  const getBrands = async () => {
    setReloading(true);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/brands/active`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Include cookies in the request
        }
      );
      if (response.status === 200) {
        setBrands(response.data.brands);
        setReloading(false);
      }
    } catch (error) {
      console.log(error);
      setReloading(false);
    }
  };

  useEffect(() => {
    Category();
    SubCategory();
    getBrands();
  }, []);

  useEffect(() => {
    setValue("featured_img", croppedImage);
  }, [croppedImage]);

  // Watch for changes in the selected category
  const selectedCategory = watch("category_id");

  // Filter subcategories based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = sub_category.filter(
        (sub) => sub.category_id === parseInt(selectedCategory)
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [selectedCategory, sub_category]);

  $('.related-product').select2({
    
    ajax: {
      url: `${import.meta.env.VITE_API_URL}/products/getRelatedProduct`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      type: 'get',
      withCredentials: true,
      dataType: 'json',
      tags: true,
      multiple: true,
      minimumInputLength: 3,
      processResults: function(data){
        return {
          results: data.tags
        }
      }
    }
  })

 

    // Listen for change event and update react-hook-form value
    $('#related_products').on('change', function () {
      const selectedValues = $(this).val();
      setValue('related_products', selectedValues); // Update the form value
     
    });
  

  return (
    <>
      {show ? (
        <div className="content-wrapper">
          {imageSrc && (
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
              <button
                className="btn btn-primary"
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
          {/* <!-- Content Header (Page header) --> */}
          <section className="content-header">
            <div className="container-fluid my-2">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Create Product</h1>
                </div>
                <div className="col-sm-6 text-right">
                  <Link to="/admin/products" className="btn btn-primary">
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
                  <div className="row">
                    <div className="col-md-8">
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="title">Title</label>
                                <input
                                  type="text"
                                  onKeyUp={getSlug}
                                  {...register("title", title)}
                                  id="title"
                                  className="form-control"
                                  placeholder="Title"
                                />
                                {errors.title && (
                                  <span className="text-danger">
                                    {errors.title.message}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Accordion>
                            <Accordion.Item eventKey="0">
                            <Accordion.Header> Description</Accordion.Header>
                            <Accordion.Body>
                            <div className="col-md-12">
                              <div className="mb-3">
                               
                                <Controller
                                  name="description"
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Editor
                                      apiKey="0a6tiq9u4ft8hji57eaoatrt1dg6t7bsy9hkyirdjnrm3niv"
                                      init={{
                                        plugins:
                                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                                        toolbar:
                                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                                      }}
                                      value={field.value} // Set the editor's value
                                      onEditorChange={(content) =>
                                        field.onChange(content)
                                      } // Update the field value on editor change
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                            <Accordion.Header>Short Description</Accordion.Header>
                            <Accordion.Body>
                            <div className="col-md-12">
                              <div className="mb-3">
                               
                                <Controller
                                  name="short_description"
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Editor
                                      apiKey="0a6tiq9u4ft8hji57eaoatrt1dg6t7bsy9hkyirdjnrm3niv"
                                      init={{
                                        plugins:
                                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                                        toolbar:
                                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                                      }}
                                      value={field.value} // Set the editor's value
                                      onEditorChange={(content) =>
                                        field.onChange(content)
                                      } // Update the field value on editor change
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                            <Accordion.Header>shipping & returns</Accordion.Header>
                            <Accordion.Body>
                            <div className="col-md-12">
                              <div className="mb-3">
                               
                                <Controller
                                  name="shipping_returns"
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Editor
                                      apiKey="0a6tiq9u4ft8hji57eaoatrt1dg6t7bsy9hkyirdjnrm3niv"
                                      init={{
                                        plugins:
                                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                                        toolbar:
                                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                                      }}
                                      value={field.value} // Set the editor's value
                                      onEditorChange={(content) =>
                                        field.onChange(content)
                                      } // Update the field value on editor change
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            </Accordion.Body>
                            </Accordion.Item>
                            </Accordion>
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Media</h2>
                          <FileUploader
                            multiple={true}
                            handleChange={handlemultipleChanges}
                            name="file[]"
                            types={fileTypes}
                          />
                          {/* Display the image previews if available */}
                          {previews.length > 0 && (
                            <div style={{ marginTop: "20px" }}>
                              <p>Image Previews:</p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {previews.map((url, index) => (
                                  <div
                                    key={index}
                                    style={{ position: "relative" }}
                                  >
                                    <TiDeleteOutline
                                      onClick={() => handleDelete(index)}
                                      className="text-danger shadow bg-danger"
                                      style={{
                                        position: "absolute",
                                        top: "0",
                                        right: "0",
                                        fontSize: "20px",
                                      }}
                                    />
                                    <img
                                      src={url}
                                      alt={`Preview ${index + 1}`}
                                      style={{ maxHeight: "100px" }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Pricing</h2>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="price">Price</label>
                                <input
                                  type="text"
                                  name="price"
                                  id="price"
                                  className="form-control"
                                  placeholder="Price"
                                  {...register("price", price)}
                                />
                                {errors.price && (
                                  <span className="text-danger">
                                    {errors.price.message}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="compare_price">
                                  Compare at Price
                                </label>
                                <input
                                  type="text"
                                  name="compare_price"
                                  id="compare_price"
                                  className="form-control"
                                  placeholder="Compare Price"
                                  {...register("compare_price")}
                                />
                                <p className="text-muted mt-3">
                                  To show a reduced price, move the product’s
                                  original price into Compare at price. Enter a
                                  lower value into Price.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Inventory</h2>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="sku">
                                  SKU (Stock Keeping Unit)
                                </label>
                                <input
                                  type="text"
                                  name="sku"
                                  id="sku"
                                  className="form-control"
                                  placeholder="sku"
                                  {...register("sku", sku)}
                                />
                                {errors.sku && (
                                  <span className="text-danger">
                                    {errors.sku.message}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="barcode">Barcode</label>
                                <input
                                  type="text"
                                  name="barcode"
                                  id="barcode"
                                  className="form-control"
                                  placeholder="Barcode"
                                  {...register("barcode")}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-1 mt-5">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    className="custom-control-input"
                                    type="checkbox"
                                    id="track_qty"
                                    name="track_qty"
                                    {...register("track_qty")}
                                  />
                                  <label
                                    htmlFor="track_qty"
                                    className="custom-control-label"
                                  >
                                    Track Quantity
                                  </label>
                                </div>
                              </div>
                              <div className="mb-3">
                                <input
                                  type="number"
                                  min="0"
                                  name="qty"
                                  id="qty"
                                  className="form-control"
                                  placeholder="Qty"
                                  {...register("qty")}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Slug</h2>
                          <div className="mb-3">
                            <input
                              type="text"
                              {...register("slug", slug)}
                              disabled
                              className="form-control"
                            />
                            {errors.slug && (
                              <span className="text-danger">
                                {errors.slug.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Product status</h2>
                          <div className="mb-3">
                            <select
                              defaultValue="1"
                              {...register("status")}
                              id="status"
                              className="form-control"
                            >
                              <option value="1">Active</option>
                              <option value="0">Block</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Featured image</h2>
                          <div className="mb-3">
                            <FileUploader
                              handleChange={handleFileChange}
                              name="featured_image"
                              types={fileTypes}
                            />
                            <input
                              type="hidden"
                              {...register("featured_img", featured_img)}
                            />
                            {errors.featured_img && (
                              <span className="text-danger">
                                {errors.featured_img.message}
                              </span>
                            )}
                          </div>
                        </div>
                        {croppedImage && (
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="Image">Selected Image</label>
                              <img
                                className="d-block"
                                width={100}
                                src={croppedImage}
                                alt="Selected"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="card">
                        <div className="card-body">
                          <h2 className="h4  mb-3">Product category</h2>
                          <div className="mb-3">
                            <label htmlFor="category">Category</label>
                            <select
                              defaultValue=""
                              {...register("category_id", cheackCategory)}
                              id="category"
                              className="form-control"
                            >
                              <option value="">select category</option>
                              {category &&
                                category.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.name}
                                  </option>
                                ))}
                            </select>
                            {errors.category && (
                              <span className="text-danger">
                                {errors.category.message}
                              </span>
                            )}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="category">Sub category</label>
                            <select
                              defaultValue=""
                              {...register("sub_category_id")}
                              id="sub_category"
                              className="form-control"
                            >
                              <option value="">select sub_category</option>
                              {filteredSubCategories &&
                                filteredSubCategories.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Product brand</h2>
                          <div className="mb-3">
                            <select
                              defaultValue=""
                              {...register("brand_id")}
                              id="brands"
                              className="form-control"
                            >
                              <option value="">select barnd</option>
                              {brands &&
                                brands.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <h2 className="h4 mb-3">Featured product</h2>
                          <div className="mb-3">
                            <select
                              defaultValue="No"
                              {...register("is_featured")}
                              id="featured"
                              className="form-control"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card mb-3">
                        <div className="card-body" style={{width:'100%',height:'auto'}}>
                          <h2 className="h4 mb-3">Related product</h2>
                            <select name="related_products" multiple={true} {...register('related_products')} className="related-product form-control" id="related_products">


                            </select>
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
                      to="/admin/products"
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
      )}
    </>
  );
}

export default InsertProduct;

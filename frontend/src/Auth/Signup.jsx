import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './login.module.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../admin/Pages/ImageCrop/cropImage";
import { useForm } from "react-hook-form";

function Signup() {
   const navigate = useNavigate();
   useEffect(() => {
    const auth = localStorage.getItem('userToken');
    if(auth && auth !== '') {
        navigate('/')
    }
 }, []);
   const {login_container,container,input_field,pswrd,show,button,inner,auth,links,facebook,google,signup} =styles;
   const [passwordShow, setPasswordShow] = useState(false);
   
  const [loader, setLoader] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCrop, setShow] = useState(false);
  const [error, setError] = useState([]);

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
      setValue('image', croppedImage);
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
       }
     })
     .then((response) => {
       if (response.status === 201) {
         console.log(response.data.message);
         setLoader(false);
         navigate('/login');
       }
     })
     .catch((err) => {
       console.log(err.response.data.errors);
       if(err.response.data.errors){
            setError(err.response.data.errors);
       }
       setLoader(false);
     });
     

   
   
 };


  return (
   <>
   {showCrop ? (
        <div style={{width:'100%'}}>
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
      {/* // form submition  */}
   {(showCrop)? null :
   <div className={login_container}>
    <div className={container}>
         <header>Sign up</header>
         <form onSubmit={handleSubmit(onSubmit)}>

         <input type="file" style={{width:'100%',padding:'8px'}} accept="image/*" onChange={handleFileChange} />
                      {croppedImage && (
                        <div style={{textAlign:'center'}}>
                          <h5>Cropped Image:</h5>
                          <img src={croppedImage} height={100} style={{borderRadius:'50%'}} alt="Cropped" />
                        </div>
                      )}
                      <input type="hidden" {...register("image",image)} />
                      {errors.image && (
                            <span style={{color:'red'}}>
                              {errors.image.message}
                            </span>
                          )}
           {(error)? <div style={{color:'red',fontSize:'small'}}>{error.map((message)=>(
               <li key={message}>{message}</li>
           ))}</div> : null}
            <div className={input_field}>
               <input type="text" required {...register("name",name)}/>
               <label>Full name</label>
            </div>
            {errors.name && (<span style={{color:'red'}}>{errors.name.message}</span>)}
            <div className={input_field}>
               <input type="text" {...register("email",email)}/>
               <label>Email or Username</label>
            </div>
            {errors.email && (<span style={{color:'red'}}>{errors.email.message}</span>)}
            <div className={input_field}>
               <input className={pswrd} type={(passwordShow)?"text":"password"} {...register("password",password)}/>
               <span className={show} onClick={()=>setPasswordShow((prev)=> !prev)}>{(passwordShow)?"Hide":"Show"}</span>
               <label>Password</label>
            </div>
            {errors.password && (<span style={{color:'red'}}>{errors.password.message}</span>)}
            <div className={button}>
               <div className={inner}></div>
               <button type='submit' disabled={loader}>{(loader)? 'Submiting' : 'Sign up'}</button>
            </div>
         </form>
         <div className={`${auth} mt-0`}>
            Or Signup with
         </div>
         <div className={links}>
            <div className={facebook}>
               <i className="fab fa-facebook-square"><span>Facebook</span></i>
            </div>
            <div className={google}>
               <i className="fab fa-google-plus-square"><span>Google</span></i>
            </div>
         </div>
         <div className={signup}>
            already registerd? <Link to="/login">Login now</Link>
         </div>
      </div>
      </div>
   }
      </>
  )
}

export default Signup

import React, { useEffect, useState } from 'react'
import styles from  './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useUserContext } from '../Global/UserProvider';


function Login() {
   const { user, setUser } = useUserContext();
   const navigate = useNavigate();
   useEffect(() => {
      const auth = localStorage.getItem('userToken');
      if(auth && auth !== '') {
          navigate('/')
      }
   }, []);
   const {login_container,container,input_field,pswrd,show,button,inner,auth,links,facebook,google,signup,loginButton} =styles;
   const [passwordShow, setPasswordShow] = useState(false);
   const [loader, setLoader] = useState(false);
   const [error, setError] = useState(false);

     // react-hook-form
  const {
   register,
   handleSubmit,
   watch,
   setValue,
   formState: { errors },
 } = useForm();

 // validation
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

 // submit form data
 const onSubmit = (data) => {
   setLoader(true);
   const formData = new FormData();
   for (const key in data) {
     formData.append(key, data[key]);
   }

   // Handle your form submission to Laravel backend here
   // For example, using Axios to send a POST request
   axios.post(`${import.meta.env.VITE_API_URL}/user/login`, formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       }
     })
     .then((response) => {
      console.log(response.data);
       if (response.status === 201) {
         localStorage.setItem('userToken', response.data.token);
         console.log(response.data.message);
         setUser(response.data.user);
         setLoader(false);
         navigate('/');
       }
     })
     .catch((err) => {
            setError(err.response.data.message);
       setLoader(false);
     });
     
 };

  return (
    <>
       <div className={login_container}>
    <div className={container}>
         <header>Login Form</header>
         <form onSubmit={handleSubmit(onSubmit)}>
         {(error)? <div style={{color:'red',fontSize:'small'}}>{error}
           </div> : null}
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
               <button className={loginButton} disabled={loader} type='submit'>{(loader)?'submiting':'LOGIN'}</button>
            </div>
         </form>
         <div className={auth}>
            Or login with
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
            Not a member? <Link to="/signup">Signup now</Link>
         </div>
      </div>
      </div>
    </>
  )
}

export default Login

import React, { useState } from 'react';
import './App.css'
import HomeLogout from './components/HomeLogout';
import { useUserContext } from './Global/UserProvider';
import Header from './public/Header/Header';
import { Outlet } from 'react-router-dom';
import Footer from './public/Footer/Footer';
function App() {
const auth = localStorage.getItem('userToken');
    const {user} = useUserContext();
    // welcome to home {(auth)? <HomeLogout/> : 'please login'}
    // <h1>{user?user.name:null}</h1>
  return (
   <>
      <Header/>
      <Outlet/>
      <Footer/>
    
   </>
  )
}

export default App

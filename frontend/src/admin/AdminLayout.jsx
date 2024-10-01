import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer/Footer';
import { useUserContext } from '../Global/UserProvider';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();
  const [initialized, setInitialized] = useState(false);

  const checkValidation = () => {
    const auth = localStorage.getItem('userToken');
    if (!auth) {
      navigate('/login');
    }
    if(!user.role == 1){
      navigate('/404NotFound');
    }
    
  };

  useEffect(() => {
    if (user && !initialized) {
      checkValidation();
      setInitialized(true); // Set initialized to true after the first check
    }
  }, [user]);

  useEffect(() => {
    if (initialized) {
      checkValidation();
    }
  }, [location]);

  if (!initialized) {
    return <div className="d-flex justify-content-center align-items-center" style={{minHeight:'100vh'}}>
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>// You can replace this with a spinner or loader
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  );
}

export default AdminLayout;

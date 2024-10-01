import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../../Global/UserProvider';
import axios from 'axios';
function Navbar() {
  const navigate = useNavigate();
  const {user} = useUserContext();

  const [imageUrl, setImageUrl] = useState('img/avatar5.png');

  useEffect(() => {
    if (user && user.image) {
      setImageUrl(`http://localhost:8000/uploads/${user.image}`); // Replace .jpg with correct extension
    }
  }, [user]);

  // user logout 

  const UserLogout = () => {
    const token = localStorage.getItem('userToken');
  
    axios.post(`${import.meta.env.VITE_API_URL}/user/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Ensure cookies are sent with the request
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem('userToken');
        navigate('/login');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          {/* Right navbar links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                <i className="fas fa-bars"></i>
              </a>
            </li>
          </ul>
          <div className="navbar-nav pl-2"></div>
          <ul className="navbar-nav ml-auto" style={{width:'60px'}}>
            <li className="nav-item">
              <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                <i className="fas fa-expand-arrows-alt"></i>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link p-0 pr-3" data-toggle="dropdown" href="#">
                <img
                  src={imageUrl}
                  className="img-circle elevation-2"
                  width="40"
                  height="40"
                  alt=""
                />
              </a>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-3">
                <h4 className="h4 mb-0">
                  <strong>{user?user.name:null}</strong>
                </h4>
                <div className="mb-3">{user?user.email:null}</div>
                <div className="dropdown-divider"></div>
                <Link to="/admin/users/sittings" className="dropdown-item">
                  <i className="fas fa-user-cog mr-2"></i> Settings
                </Link>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item">
                  <i className="fas fa-lock mr-2"></i> Change Password
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item text-danger" onClick={UserLogout}>
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
    </>
  )
}

export default Navbar

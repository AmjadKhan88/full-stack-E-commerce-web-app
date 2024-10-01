import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function HomeLogout() {
    const navigate = useNavigate();
    const logout = () => {
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
      <button className='btn btn-danger' onClick={logout}>logout</button>
    </>
  )
}

export default HomeLogout

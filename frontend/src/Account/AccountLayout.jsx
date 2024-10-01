import React, { useEffect, useState } from "react";
import profile from '../../public/img/avatar.png';
import { PiUserCircleCheckThin } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../Global/UserProvider";
import axios from "axios";
import { FaBars } from "react-icons/fa";
function AccountLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUserContext(); // Correct usage of the context
    const [userInfo, setUserInfo] = useState(null);
    const [userSitting, setUserSitting] = useState(false);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
        } else {
            setUserInfo(user);
        }
    }, [user, token, location, navigate]);

    const handleLogout =async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`,{},{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if(response.status === 200) {
                localStorage.removeItem('userToken'); // Remove token from localStorage
                navigate('/login'); // Redirect to login page
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container-fluid ps-1" style={{ display: 'flex', gap: '10px', justifyContent: 'left' }}>
           {userSitting && <div className="card col-md-3 p-2" style={{ display: 'flex', flexFlow: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <div className="border p-1 shadow" style={{ width: '100px',height:'100px', borderRadius: '50%',overflow:'hidden' }}>
                <img src={userInfo?.image ? `${import.meta.env.VITE_API_IMAGE}/${userInfo.image}` : profile}
                      alt="Profile" className="w-100"/>
                </div>
                <h3 className="fs-6 pt-2">{userInfo?.name}</h3>
                <div className="mt-4 text-left container ms-2 text-secondary">
                    <p className="fs-6 py-1"><NavLink to='/my-account' className="text-secondary"><PiUserCircleCheckThin className="pe-2 fs-2 text-info"/>Profile</NavLink></p>
                    <p className="fs-6 py-1"><NavLink to='/my-account/my-orders' className="text-secondary"><CiDeliveryTruck className="pe-2 fs-2 text-green"/>Orders</NavLink></p>
                    <p className="fs-6 py-1"><NavLink to='/my-account/my-wishlist' className="text-secondary"><CiHeart className="pe-2 fs-2 text-danger"/>Wishlist</NavLink></p>
                    <p className="fs-6 py-1"><CiSettings className="pe-2 fs-2 text-primary"/>Settings</p>
                </div>
                <span className="fs-6 text-danger my-4" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <CiLogout className="pe-2 fs-2 text-warning"/>Log out
                </span>
            </div>
            }
            <div className={userSitting?`col-md-9`:`col-md-12`}>
                <span onClick={()=>setUserSitting((prev)=> !prev)} style={{cursor:'pointer'}}><FaBars className={`me-1 m-2 p-1 fs-1 ${userSitting? 'bg-dark text-white shadow': 'bg-secondary text-white'}`}/></span>
                <Outlet />
            </div>
        </div>
    );
}

export default AccountLayout;

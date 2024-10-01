import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Notification from '../notification/Notification';

function Wishlist() {
    const token = localStorage.getItem('userToken');
    const [loading , setLoading] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('text-success');
    // get all wishlists
    const getWishlist =async ()=>{
        setLoading(true);
       try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if(response.status === 200){
                setWishlist(response.data.wishlist.data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
   // remove from wishlist
    const handleRemoveFromWishlist = (id) => {
        axios.post(`${import.meta.env.VITE_API_URL}/wishlist/remove/${id}`,{'_method':'delete'},{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        })
          .then(response => {
            setShowNotification(true);
            setAlertType('alert-success');
            setMessage('Removed from wishlist');
            setTimeout(() => setShowNotification(false), 3000);
            getWishlist();
          })
          .catch(error => {
            console.error('Error removing from wishlist:', error);
          });
      };


    useEffect(()=>{
        getWishlist();
    },[]);
  return (
    <>
      <main>
    <section className="section-5 pt-3 pb-3 mb-3 bg-white">
        <div className="container">
            <div className="light-font">
                <ol className="breadcrumb primary-color mb-0">
                    <li className="breadcrumb-item"><Link className="white-text" to="/my-account">My Account</Link></li>
                    <li className="breadcrumb-item">My Wishlist</li>
                </ol>
            </div>
        </div>
    </section>
    <Notification
        message={message}
        visible={showNotification} 
        typ={alertType}
      />
    <section className=" section-11 ">
        <div className="container  mt-5">
            <div className="row">
               
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="h5 mb-0 pt-2 pb-2">My Wishlist</h2>
                        </div>
                        <div className="card-body p-4">
                        {loading ? 'Loading...' :
                          (wishlist.length > 0) ? 
                          <table className='table table-bordered table-striped table-sm'>
                            <thead>
                                <th>title</th>
                                <th>price</th>
                                <th>actions</th>
                            </thead>
                            <tbody>
                                
                        { wishlist.map((value)=>(
                                <tr key={value.id} >
                                    <td style={{verticalAlign: 'middle'}} className='d-flex align-items-center'><img src={`${import.meta.env.VITE_API_IMAGE}/products/${value.products.featured_image}`} style={{maxWidth:'50px'}} alt="" /> <Link to={`/shop/products/${value.products.slug}`} className='ms-2'>{value.products.title}</Link></td>
                                    <td style={{verticalAlign: 'middle'}}>{value.products.price}</td>
                                    <td ><button className='btn btn-danger btn-sm' onClick={()=>handleRemoveFromWishlist(value.products.id)}>delete</button></td>
                                </tr>
                            ))
                        }
                        </tbody>
                            </table>
                             :
                            <div className='alert alert-info'>No wishlist fount</div>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
    </>
  )
}



export default Wishlist

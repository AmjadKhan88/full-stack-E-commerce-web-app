import axios from 'axios';
import React, { useEffect, useState } from 'react'

function HomeCategory() {
    const [homeCategory, setHomeCategory] = useState([]);
    const [categoryLoader, setCategoryLoader] = useState(false);
 
    const getHomeCategory =async () => {
        setCategoryLoader(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/frontend/active`);

                if(response.status === 200) {
                    setHomeCategory(response.data.category);
                    setCategoryLoader(false);
                }
            } catch (error) {
                console.error(error);
                setCategoryLoader(false);
            }
     };

     useEffect(() =>{
        getHomeCategory();
     },[])
  return (
    <>
          
            {(categoryLoader)? 'Loading...' :  
            homeCategory && homeCategory.map((value)=>(    
            
                <div key={value.id} className="col-lg-3" style={{minHeight:'94px'}}>
                    <div className="cat-card">
                        <div className="left">
                            <img src={`http://localhost:8000/uploads/category/${value.image}`} alt={value.image} className="img-fluid"/>
                        </div>
                        <div className="right">
                            <div className="cat-data">
                                <h2>{value.name}</h2>
                                <p>100 Products</p>
                            </div>
                        </div>
                    </div>
                </div>
            
            )) 
            }
        
    </>
  )
}

export default HomeCategory


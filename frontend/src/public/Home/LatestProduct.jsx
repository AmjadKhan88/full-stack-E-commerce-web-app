import axios from 'axios';
import React, { useEffect, useState } from 'react'

import LatestProductLoop from './LatestProductLoop';
function LatestProduct() {
    const [latestProduct, setLatestProduct] = useState([]);
    const [latestProductLoading, setLatestProductLoading] = useState(false);
  
    const getLatestProduct =async () =>{
        setLatestProductLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/latestproducts`);

            if(response.status === 200){
                setLatestProduct(response.data.latestProduct.data);
                setLatestProductLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLatestProductLoading(false);
        }
    }

    useEffect(()=>{
        getLatestProduct();
    },[]);
  return (
    <>
  
    {(latestProductLoading)? 'Loading...' : 
      latestProduct && latestProduct.map((value)=>(
                  <LatestProductLoop key={value.id} value={value}/>
                ))
            }
    </>
  )
}

export default LatestProduct

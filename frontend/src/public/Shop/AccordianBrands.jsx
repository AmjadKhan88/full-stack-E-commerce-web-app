import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function AccordianBrands() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accrodianBrands, setAccordianBrands] = useState([]);
  const [brandsLoader, setBrandsLoader] = useState(false);

  const getAccordianBrands = async () => {
    setBrandsLoader(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/brands/getActiveBrands`
      );

      if (response.status === 200) {
        setAccordianBrands(response.data.brands);
        setBrandsLoader(false);
      }
    } catch (error) {
      console.error(error);
      setBrandsLoader(false);
    }
  };

  const addValueToUrl = (e)=>{
    if(e.target.checked){
        // set or update a query parameter
    searchParams.set('brands',e.target.value);
    setSearchParams(searchParams);
    }else{
        searchParams.delete('brands');
        setSearchParams(searchParams);
    }
    
  }


  useEffect(() => {
    getAccordianBrands();
  }, []);

  return (
    <>
      {brandsLoader
        ?  <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
        : accrodianBrands &&
          accrodianBrands.map((value) => (
            <div key={value.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={value.slug}
                id={`flexCheckDefault${value.id}`}
                onClick={(e)=>addValueToUrl(e)}
                checked={(value.slug == searchParams.get('brands'))} 
                style={{cursor: 'pointer'}}
                onChange={()=>'checked'}
              />
              <label
                className="form-check-label"
                style={{ marginTop: "37px",cursor: 'pointer'}}
                htmlFor={`flexCheckDefault${value.id}`} 
              >
                {value.name}
              </label>
            </div>
          ))}
    </>
  );
}

export default AccordianBrands;

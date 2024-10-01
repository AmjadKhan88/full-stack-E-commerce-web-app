import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function AccordianCategory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accrodianCategory, setAccordianCategory] = useState([]);
  const [categoryLoader, setCategoryLoader] = useState(false);

  const getAccordianCategory = async () => {
    setCategoryLoader(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/category/frontend/active`
      );

      if (response.status === 200) {
        setAccordianCategory(response.data.category);
        setCategoryLoader(false);
      }
    } catch (error) {
      console.error(error);
      setCategoryLoader(false);
    }
  };

  useEffect(() => {
    getAccordianCategory();
  }, []);

  const addCategoryToUrl = (e) => {
    searchParams.delete('sub_category');
    setSearchParams(searchParams);
    searchParams.set("category", e.currentTarget.id);
    setSearchParams(searchParams);
  };

  const addSubCategoryToUrl = (category_slug,sub_category_slug) => {
    searchParams.set("category", category_slug);
    setSearchParams(searchParams);
    searchParams.set("sub_category", sub_category_slug);
    setSearchParams(searchParams);
  };

  const showAll = () => {
    searchParams.delete("sub_category");
    setSearchParams(searchParams);
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <>
      <span className={`ms-3 ${(!searchParams.get('category') && !searchParams.get('sub_category'))? 'text-success':null}`} onClick={showAll} style={{cursor:'pointer'}}>
        Show all
      </span>
      {categoryLoader ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        accrodianCategory &&
        accrodianCategory.map((value) =>
          value.sub_category.length > 0 ? (
            <div key={value.id} className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseOne${value.id}`}
                  aria-expanded="false"
                  aria-controls={`collapseOne${value.id}`}
                >
                  {value.name}
                </button>
              </h2>
              <div
                id={`collapseOne${value.id}`}
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="navbar-nav">
                    {/* <span
                      key={value.id}
                      style={{ cursor: "pointer" }}
                      onClick={addCategoryToUrl}
                      id={value.slug}
                      className="nav-item nav-link"
                    >
                      {value.name}
                    </span> */}
                    {value.sub_category.map((sub) => (
                      <span
                        key={sub.id}
                        onClick={() =>addSubCategoryToUrl(value.slug, sub.slug)}
                        id={sub.slug} 
                        style={{cursor: 'pointer'}} 
                        className={`nav-item nav-link ${(sub.slug == searchParams.get('sub_category'))? 'text-success' : null}`}
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={value.id} className="accordion-item ms-3 mt-4">
              <span
                onClick={addCategoryToUrl}
                id={value.slug}
                
                style={{ cursor: "pointer" }}
                className={`nav-item ${(value.slug == searchParams.get('category'))? 'text-success': null}`}
              >
                {value.name}{" "}
              </span>
            </div>
          )
        )
      )}
    </>
  );
}

export default AccordianCategory;

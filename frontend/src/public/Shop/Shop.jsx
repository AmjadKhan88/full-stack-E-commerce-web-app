import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import AccordianCategory from "./AccordianCategory";
import AccordianBrands from "./AccordianBrands";
import axios from "axios";
import ProductList from "./ProductList";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function Shop() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shopLoading, setShopLoading] = useState(false);
  const [shopProduct, setShopProduct] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [sortOrder, setSortOrder] = useState('latest'); // Default sorting order
  const [currentPage, setCurrentPage] = useState(1); // Default to page 1
  const [totalPages, setTotalPages] = useState(1); // Default total pages

  const getShopProducts = useCallback(async (page = 1) => {
    setShopLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/shop/products`;
      let params = [];

      if (searchParams.get("category")) {
        params.push(`category=${searchParams.get("category")}`);
      }
      if (searchParams.get("brands")) {
        params.push(`brands=${searchParams.get("brands")}`);
      }
      if (searchParams.get("sub_category")) {
        params.push(`sub_category=${searchParams.get("sub_category")}`);
      }
      if (searchParams.get("min_price")) {
        params.push(`min_price=${searchParams.get("min_price")}`);
      }
      if (searchParams.get("max_price")) {
        params.push(`max_price=${searchParams.get("max_price")}`);
      }
      if(searchParams.get("search")){
        params.push(`search=${searchParams.get("search")}`);
      }
      if (sortOrder) {
        params.push(`sort=${sortOrder}`);
      }
      params.push(`page=${page}`);

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      const response = await axios.get(url);

      if (response.status === 200) {
        setShopProduct(response.data.shopProduct.data);
        setTotalPages(response.data.shopProduct.last_page); // Update total pages from response
        setCurrentPage(page); // Update current page
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShopLoading(false);
    }
  }, [searchParams, sortOrder]);

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      min_price: priceRange[0],
      max_price: priceRange[1],
    });
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSortOrder(selectedSort);
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      sort: selectedSort
    });
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      page: pageNumber
    });
    setCurrentPage(pageNumber); // Update current page
  };

  useEffect(() => {
    getShopProducts(currentPage);
  }, [currentPage, getShopProducts]);

  return (
    <>
      <main>
        <section className="section-5 pt-3 pb-3 mb-3 bg-white">
          <div className="container">
            <div className="light-font">
              <ol className="breadcrumb primary-color mb-0">
                <li className="breadcrumb-item">
                  <Link className="white-text" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">Shop</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section-6 pt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-3 sidebar">
                <div className="sub-title">
                  <h3>Categories</h3>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div
                      className="accordion accordion-flush"
                      id="accordionExample"
                    >
                      <AccordianCategory />
                    </div>
                  </div>
                </div>

                <div className="sub-title mt-5">
                  <h3>Brand</h3>
                </div>

                <div className="card">
                  <div className="card-body">
                    <AccordianBrands />
                  </div>
                </div>

                <div className="sub-title mt-5">
                  <h3>Price</h3>
                </div>

                <div className="card">
                  <div className="card-body">
                    <Slider
                      range
                      min={5}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onChange={handlePriceChange}
                      onAfterChange={applyPriceFilter} // Apply filter after user stops dragging the slider
                    />
                    <div className="d-flex justify-content-between mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="row pb-3">
                  <div className="col-12 pb-1">
                    <div className="d-flex align-items-center justify-content-end mb-4">
                      <div className="ml-2">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-light dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            Sorting
                          </button>
                          <div className="dropdown-menu dropdown-menu-right">
                            <button 
                              className="dropdown-item" 
                              value="latest"
                              onClick={handleSortChange}
                            >
                              Latest
                            </button>
                            <button 
                              className="dropdown-item" 
                              value="price_high"
                              onClick={handleSortChange}
                            >
                              Price High
                            </button>
                            <button 
                              className="dropdown-item" 
                              value="price_low"
                              onClick={handleSortChange}
                            >
                              Price Low
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* // show product here  */}
                  {shopLoading ? (
                    <div className="w-100 h-50 d-flex align-items-center justify-content-center">
                      <div className="spinner-border text-info" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : shopProduct.length > 0 ? (
                    shopProduct.map((value) => (
                      <ProductList key={value.id} data={value} />
                    ))
                  ) : (
                    <h1 className="text-danger text-center">
                      No products found
                    </h1>
                  )}
                  <div className="col-md-12 pt-5">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-end">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Shop;

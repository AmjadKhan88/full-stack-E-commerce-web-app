import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListProducts from "./ListProducts";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState([]);
  const [current, setCurrent] = useState(
    `${import.meta.env.VITE_API_URL}/products`
  );

  const getData = async (keywords = "") => {
    setLoading(true);
    const token = localStorage.getItem("userToken");

    try {
      // Handle the URL with search parameters
      const url = new URL(current);
      if (keywords) {
        url.searchParams.set("keywords", keywords);
      }

      const response = await axios.get(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setProducts(response.data.products.data);
        setPages(response.data.products.links);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = (keywords) => {
    setCurrent(`${import.meta.env.VITE_API_URL}/products?keywords=${keywords}`);
  };

  useEffect(() => {
    getData();
  }, [current]);

  return (
    <>
      <div className="content-wrapper">
        {/* <!-- Content Header (Page header) --> */}
        <section className="content-header">
          <div className="container-fluid my-2">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Products</h1>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/admin/products/create" className="btn btn-primary">
                  New Product
                </Link>
              </div>
            </div>
          </div>
          {/* <!-- /.container-fluid --> */}
        </section>
        {/* <!-- Main content --> */}
        <section className="content">
          {/* <!-- Default box --> */}
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <div className="card-tools">
                  <div
                    className="input-group input-group"
                    style={{ width: "250px" }}
                  >
                    <input
                      type="text"
                      onKeyUp={(e) => handleSearch(e.target.value)}
                      className="form-control float-right"
                      placeholder="Search"
                    />

                    <div className="input-group-append">
                      <button type="submit" className="btn btn-primary m-0">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th width="60">ID</th>
                      <th width="80"></th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>SKU</th>
                      <th width="100">Status</th>
                      <th width="100">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr
                        className="spinner-border text-center m-5 text-info"
                        role="status"
                      >
                        <td colSpan={6} className="sr-only">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      products.map((value) => (
                        <ListProducts key={value.id} data={value} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="card-footer clearfix">
			  <ul className="pagination pagination m-0 float-right">
                  {pages.map((page, index) => (
                    page.url ? (
                      <li className="page-item mx-1" key={`${page.label}-${index}`}>
                        <a
                          className={`page-link ${page.active ? "bg-info" : ""}`}
                          onClick={() => setCurrent(page.url)}
                          href="#"
                        >
                          {(page.label == 'Next &raquo;')? <MdNavigateNext/> : (page.label == '&laquo; Previous')? <GrFormPrevious/> : page.label}
                        </a>
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* <!-- /.card --> */}
        </section>
        {/* <!-- /.content --> */}
      </div>
    </>
  );
}

export default Products;

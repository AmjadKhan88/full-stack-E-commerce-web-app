import React, { useEffect, useState, useId } from "react";
import { Link } from "react-router-dom";
import ListSubCategory from "./ListSubCategory";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

function SubCategory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState([]);
  const [current, setCurrent] = useState(`${import.meta.env.VITE_API_URL}/subcategory`);
  const randomId = useId();

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
        setData(response.data.subcategory.data);
        setPages(response.data.subcategory.links);
        console.log(response.data.subcategory.links);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = (keywords) => {
    setCurrent(`${import.meta.env.VITE_API_URL}/subcategory?keywords=${keywords}`);
  };

  useEffect(() => {
    getData();
  }, [current]);

  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid my-2">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Sub Category</h1>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/admin/subcategory/create" className="btn btn-primary">
                  New Sub Category
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <div className="card-tools">
                  <div
                    className="input-group input-group"
                    style={{ width: "250px" }}
                  >
                    <input
                      onKeyUp={(e) => handleSearch(e.target.value)}
                      type="text"
                      name="table_search"
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
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Category</th>
                      <th width="100">Status</th>
                      <th width="100">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="spinner-border text-center m-5 text-info" role="status">
                        <td colSpan={6} className="sr-only">Loading...</td>
                      </tr>
                    ) : (
                      data.map((value) => (
                        <ListSubCategory key={value.id} value={value} />
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
        </section>
      </div>
    </>
  );
}

export default SubCategory;

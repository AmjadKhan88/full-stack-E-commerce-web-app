import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import ListCategory from "./ListCategory";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

function Category() {
  const [loader, setLoader] = useState(false);
  const token = localStorage.getItem("userToken");
  const [data, setData] = useState([]);
  const [pages, setPages] = useState([]);
  const [current, setCurrent] = useState(
    `${import.meta.env.VITE_API_URL}/category`
  );

  // fetching the category

  const Category = async (keywords = "") => {
    setLoader(true);
    try {
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
        setPages(response.data.category.links);
        console.log(response.data.category);
        setData(response.data.category.data);
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };
  const handleSearch = (keywords) => {
    setCurrent(`${import.meta.env.VITE_API_URL}/category?keywords=${keywords}`);
  };

  useEffect(() => {
    Category();
  }, [current]);

  return (
    <>
      <div className="content-wrapper">
        {/* <!-- Content Header (Page header) --> */}
        <section className="content-header">
          <div className="container-fluid my-2">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Categories</h1>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/admin/category/create" className="btn btn-primary">
                  New Category
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
                      <th width="100">Status</th>
                      <th width="100">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loader ? (
                      <tr
                        className="text-success m-5 spinner-border"
                        role="status"
                      >
                        <td colSpan={5} className="sr-only">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      data.map((value) => (
                        <ListCategory key={value.id} data={value} />
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

export default Category;

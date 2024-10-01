import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UsePersistentCart from "../../Global/UsePersistentCart";
function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeItem, updateItemQuantity, emptyCart } = UsePersistentCart();
  const [topCategory, setTopCategory] = useState([]);
  const [search, setSearch] = useState('');
  const topNavbarCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/category/frontend/show_on_top`
      );

      if (response.status === 200) {
        setTopCategory(response.data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSearches = () => {    
      if(search != ''){
        if(location.pathname != '/shop'){
            navigate('/shop?search=' + search)
        }else{
        searchParams.set('search', search);
        setSearchParams(searchParams);
        }
      }
  }

  useEffect(() => {
    topNavbarCategory();
  }, []);

  return (
    <>
      <div className="bg-light top-header">
        <div className="container">
          <div className="row align-items-center py-3 d-none d-lg-flex justify-content-between">
            <div className="col-lg-4 logo">
              <a href="index.php" className="text-decoration-none">
                <span className="h3 text-uppercase bg-dark px-1">Online</span>
                <span className="h4 text-uppercase text-dark px-1 ml-n1">
                  SHOP
                </span>
              </a>
            </div>
            <div className="col-lg-6 col-6 text-left  d-flex justify-content-end align-items-center">
              <Link to="/my-account" className="nav-link text-dark">
                My Account
              </Link>
              <form action="">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search For Products"
                    className="form-control"
                    aria-label="Amount (to the nearest dollar)"
                    value={search}
                    onChange={(e) =>setSearch(e.target.value)}
                  />
                  <span className="input-group-text" onClick={addSearches}>
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-dark">
        <div className="container">
          <nav className="navbar navbar-expand-xl" id="navbar">
            <NavLink to="/" className="text-decoration-none mobile-logo">
              <span className="h2 text-uppercase text-primary bg-dark">
                Online
              </span>
              <span className="h2 text-uppercase text-white px-2">SHOP</span>
            </NavLink>
            <button
              className="navbar-toggler menu-btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              {/* <!-- <span className="navbar-toggler-icon icon-menu"></span> --> */}
              <i className="navbar-toggler-icon fas fa-bars"></i>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/"
                    title="Products"
                  >
                    Home
                  </NavLink>
                </li>

                {topCategory.length > 0
                  ? topCategory.map((value) =>
                      value.sub_category.length > 0 ? (
                        <li key={value.id} className="nav-item dropdown">
                          <button
                            className="btn btn-dark dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {value.name}
                          </button>
                          {value.sub_category.length > 0 ? (
                            <ul className="dropdown-menu dropdown-menu-dark">
                              {value.sub_category.map((sub) => (
                                <li key={sub.id}>
                                  <NavLink
                                    className="dropdown-item nav-link"
                                    to={`/shop?category=${value.slug}&sub_category=${sub.slug}`}
                                  >
                                    {sub.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ) : (
                        <li key={value.id} className="nav-item">
                          <NavLink
                            className="nav-link"
                            style={{ fontSize: "20px", marginTop: "20px" }}
                            to={`/shop?category=${value.slug}`}
                            title="Products"
                          >
                            {value.name}
                          </NavLink>
                        </li>
                      )
                    )
                  : null}
              </ul>
            </div>
            <div className="right-nav py-0">
              <NavLink to={(items?.length > 0)? `/cart`:null}  className="ml-3 d-flex pt-2">
                <i className="fas fa-shopping-cart text-primary"></i>
                <span className="bg-danger text-white mx-1 mb-2 p-1 text-center" style={{height:'20px',width:'20px',borderRadius:'50%',fontSize:'11px'}}>{items? items.length:''}</span>
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;

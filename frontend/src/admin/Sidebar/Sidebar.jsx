import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <img
            src="img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">LARAVEL SHOP</span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/category"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : ""}`
                  }
                >
                  <i className="nav-icon fas fa-file-alt"></i>
                  <p>Category</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/subcategory"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : ""}`
                  }
                >
                  <i className="nav-icon fas fa-file-alt"></i>
                  <p>Sub Category</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/brands"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <svg
                    className="h-6 nav-icon w-6 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p>Brands</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <i className="nav-icon fas fa-tag"></i>
                  <p>Products</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/shipping"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <i className="fas fa-truck nav-icon"></i>
                  <p>Shipping</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <i className="nav-icon fas fa-shopping-bag"></i>
                  <p>Orders</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/discounts"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <i className="nav-icon fa fa-percent" aria-hidden="true"></i>
                  <p>Discount</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <i className="nav-icon fas fa-users"></i>
                  <p>Users</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/pages"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "bg-success" : null}`
                  }
                >
                  <i className="nav-icon far fa-file-alt"></i>
                  <p>Pages</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar

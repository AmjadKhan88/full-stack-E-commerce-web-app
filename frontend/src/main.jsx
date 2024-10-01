import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import Category from "./admin/Pages/Category/Category.jsx";
import Login from "./Auth/Login.jsx";
import Signup from "./Auth/Signup.jsx";
import SubCategory from "./admin/Pages/SubCategory/SubCategory.jsx";
import InsertCategory from "./admin/Pages/Category/InsertCategory.jsx";
import UpdateCategory from "./admin/Pages/Category/UpdateCategory.jsx";
import InsertSubCategory from "./admin/Pages/SubCategory/InsertSubCategory.jsx";
import UpdateSubCategory from "./admin/Pages/SubCategory/UpdateSubCategory.jsx";
import Products from "./admin/Pages/Products/Products.jsx";
import InsertProduct from "./admin/Pages/Products/InsertProduct.jsx";
import UpdateProduct from "./admin/Pages/Products/UpdateProduct.jsx";
import Brands from "./admin/Pages/Brands/Brands.jsx";
import UpdateBrands from "./admin/Pages/Brands/UpdateBrands.jsx";
import InsertBrands from "./admin/Pages/Brands/InsertBrands.jsx";
import Orders from "./admin/Pages/Orders/Orders.jsx";
import OrdersDetails from "./admin/Pages/Orders/OrdersDetails.jsx";
import Discounts from "./admin/Pages/Discount/Discounts.jsx";
import Users from "./admin/Pages/Users/Users.jsx";
import InsertUsers from "./admin/Pages/Users/InsertUsers.jsx";
import UpdateUsers from "./admin/Pages/Users/UpdateUsers.jsx";
import Sitepages from "./admin/Pages/SitePages/Sitepages.jsx";
import InsertSitepages from "./admin/Pages/SitePages/InsertSitepages.jsx";
import UpdateSitepages from "./admin/Pages/SitePages/UpdateSitepages.jsx";
import UserProvider from "./Global/UserProvider.jsx";
import UserSittings from "./admin/Navbar/UserSittings.jsx";
import Error404Page from "./Errors/Error404Page.jsx";
import $ from 'jquery';
import Home from "./public/Home/Home.jsx";
import Shop from "./public/Shop/Shop.jsx";
import { CartProvider } from 'react-use-cart';
import CartPage from "./Global/CartPage.jsx";
import Product from "./public/Details/Product.jsx";
import UserAccount from "./Auth/UserAccount.jsx";
import AccountLayout from "./Account/AccountLayout.jsx";
import FrontOrders from "./Account/FrontOrders.jsx";
import OrderDetail from "./Account/OrderDetail.jsx";
import Wishlist from "./Account/Wishlist.jsx";
import Checkout from "./Account/Checkout.jsx";
import ShippingInsert from "./admin/Pages/Shipping/ShippingInsert.jsx";
import Shipping from "./admin/Pages/Shipping/Shipping.jsx";
import ShippingUpdate from "./admin/Pages/Shipping/ShippingUpdate.jsx";
import DiscountCreate from "./admin/Pages/Discount/DiscountCreate.jsx";
import DiscountUpdate from "./admin/Pages/Discount/DiscountUpdate.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  // admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      // Dashboard route
      {
        path: "",
        element: <Dashboard />,
      },
      // Category routes
      {
        // Category routes
        path: "category",
        element: null,
        children: [
          {
            // Category main page route
            path: "",
            element: <Category />,
          },
          {
            // Category create route
            path: "create",
            element: <InsertCategory />,
          },
          {
            // Category update route
            path: "update/:id",
            element: <UpdateCategory />,
          },
        ],
      },
      // Sub-Category routes
      {
        path: "subcategory",
        element: null,
        children: [
          {
            // Main SubCategory route
            path: "",
            element: <SubCategory />,
          },
          {
            // create sub-category
            path: "create",
            element: <InsertSubCategory />,
          },
          {
            // update sub-category
            path: "update/:id",
            element: <UpdateSubCategory />,
          },
        ],
      },
      // Products routes
      {
        path: "products",
        element: null,
        children: [
          {
            // main product route
            path: "",
            element: <Products />,
          },
          {
            // create product route
            path: "create",
            element: <InsertProduct />,
          },
          {
            // update product route
            path: "update/:id",
            element: <UpdateProduct />,
          },
        ],
      },
      // Brands routes
      {
        path: "brands",
        element: null,
        children: [
          {
            // main brands route
            path: "",
            element: <Brands />,
          },
          {
            // create brands route
            path: "create",
            element: <InsertBrands />,
          },
          {
            // update brand route
            path: "update/:id",
            element: <UpdateBrands />,
          },
        ],
      },
      // Orders routes
      {
        path: "orders",
        element: null,
        children: [
          {
            // Home orders route
            path: "",
            element: <Orders />,
          },
          {
            // details orders route
            path: "details/:id",
            element: <OrdersDetails />,
          },
        ],
      },
      // discounts routes
      {
        path: "discounts",
        element: null,
        children: [
          {
            // discount Home routes
            path: "",
            element: <Discounts />,
          },
          // discount create routes
          {
            path: "create",
            element: <DiscountCreate/>
          },
          // discount update routes
          {
            path: "update/:id",
            element: <DiscountUpdate/>
          }
        ],
      },
      // Users routes
      {
        path: "users",
        element: null,
        children: [
          {
            // Users Home route
            path: "",
            element: <Users />,
          },
          {
            // User create route
            path: "create",
            element: <InsertUsers />,
          },
          {
            // User update route
            path: "update/:id",
            element: <UpdateUsers />,
          },
          {
            // user sittings route
            path: "sittings",
            element: <UserSittings />,
          },
        ],
      },
      // Pages routes
      {
        path: "pages",
        element: null,
        children: [
          {
            // Pages Home route
            path: "",
            element: <Sitepages />,
          },
          {
            // Pages create route
            path: "create",
            element: <InsertSitepages />,
          },
          {
            // Pages update route
            path: "update/:id",
            element: <UpdateSitepages />,
          },
        ],
      },
      // Shipping routes admin
      {
        path: "shipping",
        element: null,
        children: [
          {
            path: "",
            element: <Shipping/>,
          },
          {
            path: "create",
            element: <ShippingInsert/>,
          },
          {
            path: "update/:id",
            element: <ShippingUpdate/>
          }
        ],
      },
     
    ],
  },
  // Web Home Route
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/shop/products/:slug",
        element: <Product />,
      },
      {
        path: "/my-account",
        element: <AccountLayout />,
        children: [
          {
            path: "",
            element: <UserAccount />,
          },
          {
            path: "my-orders",
            element: <FrontOrders />,
          },
          {
            path: "order-detail/:id",
            element: <OrderDetail />,
          },
          {
            path: "my-wishlist",
            element: <Wishlist />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
        ],
      },
    ],
    errorElement: <Error404Page />,
  },
  // Login Route
  {
    path: "/login",
    element: <Login />,
  },
  // Signup Route
  {
    path: "/signup",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
    <RouterProvider router={router} />
    </CartProvider>
    </UserProvider>
  </React.StrictMode>
);

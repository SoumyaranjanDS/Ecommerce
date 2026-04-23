import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ProductList from "./admin/ProductList";
import NavBar from "./components/NavBar";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Payment from "./pages/Payment";


const Layout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/admin/products",
        element: <ProductList />,
      },
      {
        path: "/admin/products/edit/:id",
        element: <EditProduct />,
      },
      {
        path: "/admin/products/add",
        element: <AddProduct />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/address",
        element: <Address />,
      },
      {
        path: "/payment",
        element: <Payment />,
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

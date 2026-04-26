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
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";
import Wishlist from "./pages/Wishlist";
import OrderDetails from "./pages/OrderDetails";
import Dashboard from "./admin/Dashboard";

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/order-details/:id",
        element: <OrderDetails />,
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
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
        path: "/admin/add-product",
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

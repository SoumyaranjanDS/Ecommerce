import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

// Components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Address = lazy(() => import("./pages/Address"));
const Payment = lazy(() => import("./pages/Payment"));

// Admin Lazy Pages
const Dashboard = lazy(() => import("./admin/Dashboard"));
const AddProduct = lazy(() => import("./admin/AddProduct"));
const EditProduct = lazy(() => import("./admin/EditProduct"));
const ProductList = lazy(() => import("./admin/ProductList"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
  </div>
);

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-1">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
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


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

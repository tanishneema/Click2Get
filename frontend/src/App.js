import './App.css';
import Header from './component/layout/Header/Header.js';
import Footer from './component/layout/Footer/Footer.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import WebFont from 'webfontloader';
import React from 'react';
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js"
import Profile from "./component/User/Profile.js"
import { useSelector } from 'react-redux';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.js'
import { useEffect, useState } from "react";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";
import axios from "axios";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);

  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Routes>
            <Route element={<ProtectedRoute />} >
              <Route path='/process/payment' element={<Payment />} exact />
            </Route>
          </Routes>
        </Elements>
      )}

      <Routes>
        <Route exact path="/" element={isAuthenticated ? <><UserOptions user={user} /><Home /></> : <Home />} />
        <Route path="/product/:id" element={isAuthenticated ? <><UserOptions user={user} /><ProductDetails /></> : <ProductDetails />} exact />
        <Route path="/products" element={isAuthenticated ? <><UserOptions user={user} /><Products /></> : <Products />} exact />
        <Route path="/products/:keyword" element={isAuthenticated ? <><UserOptions user={user} /><Products /></> : <Products />} />

        <Route path="/search" element={isAuthenticated ? <><UserOptions user={user} /><Search /></> : <Search />} exact />
        <Route path="/contact" element={isAuthenticated ? <><UserOptions user={user} /><Contact /></> : <Contact />} exact />
        <Route path="/about" element={isAuthenticated ? <><UserOptions user={user} /><About /></> : <About />} exact />
        <Route path="/password/forgot" element={<ForgotPassword />} exact />
        <Route path="/password/reset/:token" element={<ResetPassword />} exact />
        <Route path="/cart" element={isAuthenticated ? <><UserOptions user={user} /><Cart /></> : <Cart />} exact />

        <Route path="/login" element={isAuthenticated ? <><UserOptions user={user} /><LoginSignUp /></> : <LoginSignUp />} exact />

        <Route element={isAuthenticated ? <><UserOptions user={user} /><ProtectedRoute /></> : <LoginSignUp />} >
          <Route path='/account' element={<Profile />} exact />
          <Route path='/me/update' element={<UpdateProfile />} exact />
          <Route path='/password/update' element={<UpdatePassword />} exact />
          <Route path='/shipping' element={<Shipping />} exact />
          <Route path='/success' element={<OrderSuccess />} exact />
          <Route path='/orders' element={<MyOrders />} exact />
          <Route path='/order/confirm' element={<ConfirmOrder />} exact />
          <Route path='/order/:id' element={<OrderDetails />} exact />
          <Route isAdmin={true} path='/admin/dashboard' element={<Dashboard />} exact />
          <Route isAdmin={true} path='/admin/products' element={<ProductList />} exact />
          <Route isAdmin={true} path='/admin/product' element={<NewProduct />} exact />
          <Route isAdmin={true} path='/admin/product/:id' element={<UpdateProduct />} exact />
          <Route isAdmin={true} path='/admin/orders' element={<OrderList />} exact />
          <Route isAdmin={true} path='/admin/order/:id' element={<ProcessOrder />} exact />
          <Route isAdmin={true} path='/admin/users' element={<UsersList />} exact />
          <Route isAdmin={true} path='/admin/user/:id' element={<UpdateUser />} exact />
          <Route isAdmin={true} path='/admin/reviews' element={<ProductReviews />} exact />
          <Route isAdmin={true} path='/admin/users' element={<UsersList />} exact />
        </Route>
        <Route
          element={
            window.location.pathname === "/process/payment" ? null : <NotFound />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

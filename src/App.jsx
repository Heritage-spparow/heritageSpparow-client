// src/App.jsx
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Search from "./components/Search";
import ProductWindow from "./components/ProductWindow";
import FeatureProduct from "./components/FeatureProduct";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Orders from "./components/Orders";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import About from "./components/About";

function AppContent() {
  const location = useLocation();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/login", "/signup"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div className={shouldHideNavbar? "mt-0" : "mt-14"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:name" element={<ProductWindow />} />
          <Route path="/about" element={<About/>}/>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/feature/:id" element={<FeatureProduct />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer/>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

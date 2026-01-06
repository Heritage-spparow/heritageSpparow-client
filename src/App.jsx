import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import{ useEffect } from "react";
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
import CraftPage from "./components/craft";
import GoogleAuthCallback from "./components/GoogleAuthCallback";
import CampaignPage from "./components/Campaign";
import ScrollToTop from "./tool/ScrollToTop";
// ✅ Policy imports
import PolicyLayout from "./policies/PolicyLayout";
import PrivacyPolicyPage from "./policies/PrivacyPolicyPage";
import TermsConditionsPage from "./policies/TermsConditionsPage";
import ShippingReturnsRefundPage from "./policies/ShippingReturnsRefundPage";
import ShringarAlbum from "./components/ShringarAlbum";
import { useProduct } from "./context/ProductContext";
import AuthSuccess from "./components/AuthSuccess";

function AppContent() {
  const location = useLocation();
  const { fetchCategories } = useProduct();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <div className={shouldHideNavbar ? "mt-0" : "mt-14"}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:name" element={<ProductWindow />} />
          <Route path="/about" element={<About />} />
          <Route path="/craft" element={<CraftPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/campaigns/shringar-album" element={<ShringarAlbum />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleAuthCallback />}
          />
          <Route path="/auth/success" element={<AuthSuccess />} />
          {/* ✅ POLICY ROUTES (NESTED) */}
          <Route path="/policies" element={<PolicyLayout />}>
            <Route index element={<PrivacyPolicyPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsConditionsPage />} />
            <Route
              path="shipping-returns-refund"
              element={<ShippingReturnsRefundPage />}
            />
          </Route>

          {/* Protected pages */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/feature/:id" element={<FeatureProduct />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/917973926474"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="
          fixed bottom-8 right-4 z-[1000]
          flex items-center justify-center
          w-14 h-14 md:w-16 md:h-16
          rounded-full bg-[#25d3668f]
          shadow-lg hover:scale-110 hover:shadow-xl
          transition-transform duration-200
        "
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-7 h-7 md:w-9 md:h-9"
        />
      </a>

      {!shouldHideNavbar && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

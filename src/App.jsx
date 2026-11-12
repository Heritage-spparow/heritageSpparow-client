import React, { lazy, Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Maintenance from "./Maintainance";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import ProductWindow from "./components/ProductWindow";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import ScrollToTop from "./tool/ScrollToTop";
import { CategoryRouteResolver } from "./components/RouteResolvers";
import { useProduct } from "./context/ProductContext";

// Pages loaded on demand — home, category and product pages stay in the main bundle
const Search = lazy(() => import("./components/Search"));
const Checkout = lazy(() => import("./components/Checkout"));
const Payment = lazy(() => import("./components/Payment"));
const Profile = lazy(() => import("./components/Profile"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Orders = lazy(() => import("./components/Orders"));
const About = lazy(() => import("./components/About"));
const CraftPage = lazy(() => import("./components/craft"));
const GoogleAuthCallback = lazy(() => import("./components/GoogleAuthCallback"));
const CampaignPage = lazy(() => import("./components/Campaign"));
const PolicyLayout = lazy(() => import("./policies/PolicyLayout"));
const PrivacyPolicyPage = lazy(() => import("./policies/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./policies/TermsConditionsPage"));
const ShippingReturnsRefundPage = lazy(() => import("./policies/ShippingReturnsRefundPage"));
const ShringarAlbum = lazy(() => import("./components/ShringarAlbum"));
const AuthSuccess = lazy(() => import("./components/AuthSuccess"));
const OrderDetail = lazy(() => import("./components/OrderDetail"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#f9f6ef]">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#737144]/20 border-t-[#737144]" />
  </div>
);

function AppContent() {
  const location = useLocation();
  const { fetchCategories } = useProduct();
  const maintenance = false;
  // Hooks must run before any early return
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (maintenance) {
    return <Maintenance />;
  }

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <div className={shouldHideNavbar ? "mt-0" : "mt-14"}>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="/product/:name" element={<LegacyCategoryRedirect />} />
          <Route path="/feature/:id" element={<LegacyProductRedirect />} />
          <Route
            path="/products/:slug/:id"
            element={<LegacyProductRedirect />}
          /> */}
          <Route
            path="/:categorySlug/collections/:collectionSlug/:itemSlug"
            element={<CategoryRouteResolver />}
          />
          {/* Category */}
          <Route path="/:categorySlug" element={<ProductWindow />} />

          <Route
            path="/:categorySlug/collections/:collectionSlug"
            element={<ProductWindow />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/craft" element={<CraftPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/campaigns/shringar-album" element={<ShringarAlbum />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
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
          <Route path="/checkout" element={<Checkout />} />
          {/* Payment works for logged-in users and guests */}
          <Route path="/payment" element={<Payment />} />
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
        </Suspense>
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

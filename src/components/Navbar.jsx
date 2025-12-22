import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowLeft,
  Plus,
  Minus,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContex";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { fetchCategories } = useProduct();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { items, totalItems, error, clearError } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    CATEGORY: false,
    collections: false,
    curations: false,
  });
  const dropdownRef = useRef(null);

  const dinStyle = {
    fontFamily:
      "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 400,
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories(true);
        if (result.success) {
          setCategories(result.categories || []);
        } else {
          console.error("Failed to load categories:", result.error);
        }
      } catch (err) {
        console.error("Unexpected error in loadCategories:", err);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleShopMenu = () => setIsShopMenuOpen(!isShopMenuOpen);
  const toggleSection = (section) => {
    setExpandedSections({
      CATEGORY: section === "CATEGORY" ? !expandedSections.CATEGORY : false,
      collections:
        section === "collections" ? !expandedSections.collections : false,
      curations: section === "curations" ? !expandedSections.curations : false,
    });
  };

  const handleCartClick = () => {
    if (error) {
      alert(error);
      clearError();
    }
    setIsProfileDropdownOpen(false);
    navigate("/checkout");
  };
  const handleOrders = () => {
    setIsProfileDropdownOpen(false);
    navigate("/orders");
  };
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };
  const handleLogin = () => navigate("/login");
  const handleProfile = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav
      style={{
        ...dinStyle,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
      className="w-full bg-[var(--color-bg)] h-[56px] md:h-[64px] fixed top-0 left-0 z-50 border-b border-[var(--color-border)]"
    >
      {/* Desktop Navigation */}
    <div className="hidden md:flex h-full w-full text-white items-center justify-between px-6">
        <div className="flex h-full w-full justify-between items-center space-x-8">
          <Link
            className="hover:underline font-medium relative"
            onMouseEnter={() => setIsShopMenuOpen(true)}
            onMouseLeave={() => setIsShopMenuOpen(false)}
          >
            SHOP
          </Link>
          <Link to="/campaign" className={` hover:underline font-medium`}>
            CAMPAIGN
          </Link>
          <Link to="/craft" className={` hover:underline font-medium`}>
            CRAFT
          </Link>
          <h1
            className={` hover:underline flex items-center flex-col justify-center font-bold cursor-pointer text-xxl font-extrabold `}
            onClick={() => navigate("/")}
          >
            <span className="whitespace-nowrap cursor-pointer">
              HERITAGE SPARROW
            </span>
          </h1>
          <Link to="/about" className={` hover:underline font-medium`}>
            ABOUT
          </Link>
          <Link to="/search" className={` hover:underline font-medium`}>
            SEARCH
          </Link>
          {/* Profile Dropdown */}
          <div className="relative text-white" ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={toggleProfileDropdown}
                  className={` hover:underline font-medium flex items-center space-x-1 cursor-pointer`}
                >
                  <User size={20} />
                  <span className="hidden lg:block">
                    {user?.firstName || "Profile"}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-5 w-48 bg-[var(--color-bg)] py-1 z-50">
                    <button
                      onClick={handleProfile}
                      className="flex items-center px-4 py-2 text-sm hover:bg-[var(--color-surface)] w-full text-left"
                    >
                      <Settings size={16} className="mr-3" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm  hover:bg-[var(--color-surface)] w-full text-left"
                    >
                      <Package size={16} className="mr-3" />
                      My Orders
                    </button>
                    <button
                      onClick={handleCartClick}
                      className="flex items-center px-4 py-2 text-sm hover:bg-[var(--color-surface)] w-full text-left"
                    >
                      <ShoppingBag size={16} className="mr-3" />
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          totalItems > 0
                            ? "bg-white text-[var(--color-bg)]"
                            : "text-white border border-[var(--color-border)]"
                        }`}
                      >
                        {totalItems}
                      </span>
                    </button>
                    <div className="border-t border-[var(--color-border)]"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm  hover:bg-[var(--color-surface)] w-full text-left"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleLogin}
                className={`text-gray-700 ${
                  isShopMenuOpen ? "text-white" : "text-gray"
                } hover:underline font-medium flex items-center space-x-1 cursor-pointer`}
              >
                <User className={"text-white"} size={20} />
                <span className="hidden lg:block text-white">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Shop Submenu */}
      <div
        className={`md:hidden fixed right-0 top-0 h-full w-full bg-[var(--color-bg)] z-60 transform transition-transform duration-500 ease-in-out ${
          isShopMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex  items-center justify-between px-6 py-6">
          <button
            onClick={toggleShopMenu}
            className="text-white hover:opacity-90"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-white">SHOP</h2>
          </div>
          <div className="w-6"></div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center space-x-2 mb-8">
            <h3 className="text-white text-lg font-light">CATEGORIES</h3>
            <Minus className="text-white" size={16} />
          </div>
          <div className="space-y-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/product/${encodeURIComponent(category)}`}
                className="block text-white hover:opacity-90 text-xl font-light"
                onClick={() => {
                  setIsShopMenuOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                {category.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Shop Submenu */}
      <div
        onMouseEnter={() => setIsShopMenuOpen(true)}
        onMouseLeave={() => setIsShopMenuOpen(false)}
        className={`hidden md:block fixed left-0 w-full top-[3.5em] z-50 transition-all duration-100 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isShopMenuOpen ? "opacity-100 visible " : "opacity-0 invisible "
        }`}
      >
        <div
          className="mx-auto h-[50vh]  w-full bg-[var(--color-bg)]/95 backdrop-blur-sm ]
               border border-[var(--color-border)]  overflow-hidden
               transition-all duration-500 ease-in-out hover:shadow-[0_12px_45px_rgba(255,255,255,0.2)]"
        >
          <div className="px-6 py-5">
            <button
              onClick={() => toggleSection("CATEGORY")}
              className="flex items-center gap-[6%] text-white hover:text-gray-200 transition-colors"
            >
              <span className="text-base font-light opacity-80">CATEGORY</span>
              {expandedSections.CATEGORY ? (
                <Minus size={16} />
              ) : (
                <Plus size={16} />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                expandedSections.CATEGORY
                  ? "max-h-96 opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/product/${encodeURIComponent(category)}`}
                    className="block text-white hover:text-gray-300 text-base transition-all duration-300"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    {category.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex h-full w-full items-center justify-between px-4 py-4 ">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1
            onClick={() => navigate("/")}
            className="text-sm md:text-base text-white tracking-[0.18em] ml-[19px] font-medium"
          >
            HERITAGE SPARROW
          </h1>
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate("/search")} className="text-white">
              <Search size={20} />
            </button>
            <button onClick={handleCartClick} className="text-white relative">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[var(--color-bg)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 bg-[var(--color-bg)] z-50 transform transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <button onClick={toggleMenu} className="text-white">
              <X size={28} />
            </button>
            <h1 className="text-sm md:text-base text-white tracking-[0.18em] font-medium">HERITAGE SPARROW</h1>
            <div className="w-7"></div>
          </div>

          <div className="flex flex-col px-8 py-8 space-y-8">
            <button
              className="text-left text-white border-b border-[var(--color-border)] pb-4"
              onClick={() => {
                setIsShopMenuOpen(true);
                setIsMenuOpen(false);
              }}
            >
              SHOP
            </button>
            <Link
              to="/campaign"
              className="text-white border-b border-[var(--color-border)] pb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              CAMPAIGN
            </Link>
            <Link
              to="/craft"
              className="text-white border-b border-[var(--color-border)] pb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              CRAFT
            </Link>
            <Link
              to="/about"
              className="text-white border-b border-[var(--color-border)] pb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              to="/search"
              className="text-white border-b border-[var(--color-border)] pb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              SEARCH
            </Link>
            <button
              className="flex items-center space-x-3 border-b border-[var(--color-border)] pb-4 text-left"
              onClick={() => {
                handleCartClick();
                setIsMenuOpen(false);
              }}
            >
              <span className="text-white">BAG</span>
              <span
                className={`text-white border px-3 py-1 ${
                  totalItems > 0 ? "bg-white text-[var(--color-bg)]" : ""
                }`}
              >
                {totalItems}
              </span>
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    handleProfile();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-white border-b border-[var(--color-border)] pb-4"
                >
                  MY PROFILE
                </button>
                <button
                  onClick={() => {
                    handleOrders();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-white border-b border-[var(--color-border)] pb-4"
                >
                  MY ORDERS
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-white border-b border-[var(--color-border)] pb-4"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                className="text-left text-white border-b border-[var(--color-border)] pb-4"
              >
                LOGIN / SIGNUP
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

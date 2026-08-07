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
import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContex";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";
import { buildCategoryPath, buildCollectionPath } from "../utils/productUrl";

const Navbar = () => {
  const { collections, fetchCollections } = useProduct();

  // const firstCategorySlug = useMemo(() => {
  //   if (!categories || categories.length === 0) return null;

  //   const cat = categories[0];

  //   if (typeof cat === "string") return cat;
  //   if (cat.category) return cat.category;
  //   if (cat.name) return cat.name;

  //   return null;
  // }, [categories]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems, error, clearError } = useCart();
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

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

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
  const uniqueCollections = collections;

  return (
    <nav
      style={{
        ...dinStyle,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        backgroundImage: "url('/olivegreenBackground.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "lighten",
      }}
      className="w-full bg-[var(--color-bg)] h-[56px] md:h-[64px] fixed top-0 left-0 z-50 border-b border-[var(--color-border)]"
    >
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full w-full text-white items-center justify-between px-6">
        <div className="flex h-full w-full justify-between items-center space-x-8">
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsShopMenuOpen(true)}
            onMouseLeave={() => setIsShopMenuOpen(false)}
          >
            <button className="hover:underline font-medium cursor-pointer">
              SHOP
            </button>

            {isShopMenuOpen && (
              <div
                className="absolute top-full ml-[-24px] left-0 w-screen bg-[var(--color-bg)] border-t border-[var(--color-border)] shadow-2xl animate-fadeIn"
                style={{
                  backgroundImage: "url('/olivegreenBackground.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "lighten",
                }}
              >
                <div className="max-w-7xl  px-12 py-10 opacity-100">
                  <div className="grid grid-cols-2 gap-10">
                    {uniqueCollections.map((collection) => (
                      <div
                        key={collection}
                        onClick={() => {
                          navigate(
                            buildCollectionPath(collection.name.toLowerCase()),
                          );
                          setIsShopMenuOpen(false);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="overflow-hidden  bg-[var(--color-surface)] aspect-[16/8]">
                          <img
                            src={
                              collection.coverImage?.url || "/coverImage.png"
                            }
                            alt={collection}
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div>
                            <h3 className="text-white text-2xl tracking-wide">
                              {collection.name.toUpperCase()}
                            </h3>
                          </div>

                          <span className="text-white group-hover:translate-x-2 transition">
                            →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
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
                onClick={handleCartClick}
                className="relative text-white hover:opacity-90 transition"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[var(--color-bg)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

  
      {/* Mobile Shop Submenu */}
      <div
        className={`md:hidden fixed inset-0 z-[60]  bg-[var(--color-bg)] transform transition-transform duration-500 ${
          isShopMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
                  backgroundImage: "url('/olivegreenBackground.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "lighten",
                }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <h2 className="text-white tracking-[0.35em] text-sm uppercase">
            Collections
          </h2>

          <button
            onClick={() => setIsShopMenuOpen(false)}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Collections */}
        <div className="overflow-y-auto h-[calc(100%-76px)] px-5 py-6 space-y-5">
          {uniqueCollections.map((collection) => (
            <button
              key={collection.name}
              onClick={() => {
                setIsShopMenuOpen(false);
                navigate(buildCollectionPath(collection.name.toLowerCase()));
              }}
              className="group relative w-full h-52  overflow-hidden"
            >
              {/* Cover Image */}
              <img
                src={collection.coverImage?.url || "/coverImage.png"}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <p className="text-white/70 text-xs tracking-[0.35em] uppercase">
                    Heritage Sparrow
                  </p>

                  <h3
                    className="text-white text-2xl mt-2"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {collection.name}
                  </h3>
                </div>

                <div className="text-white text-2xl transition-transform duration-300 group-hover:translate-x-2">
                  →
                </div>
              </div>
            </button>
          ))}
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
          style={{
            backgroundImage: "url('/olivegreenBackground.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "lighten",
          }}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <button onClick={toggleMenu} className="text-white">
              <X size={28} />
            </button>
            <h1 className="text-sm md:text-base text-white tracking-[0.18em] font-medium">
              HERITAGE SPARROW
            </h1>
            <div className="w-7"></div>
          </div>

          <div className="flex flex-col px-8 py-8 space-y-8">
            <button
              onClick={() => {
                setIsShopMenuOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between text-white border-b border-[var(--color-border)] pb-4"
            >
              <span>SHOP</span>
              <Plus size={18} />
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

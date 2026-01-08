import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContex";
import { useProduct } from "../context/ProductContext";
import img from "../assets/demo3.jpg";
import { useAuth } from "../context/AuthContext";
import sizeChart from "../assets/SizeChart-01.png";
import FullscreenImageViewer from "./FullscreenImageViewer";
import { cloudinaryOptimize } from "../utils/loudinary";

export default function FeatureProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {
    fetchProductById,
    fetchProducts,
    products,
    currentProduct,
    loading,
    error,
    clearError,
  } = useProduct();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageContainerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStock, setSelectedStock] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const lastDistance = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  //  const currentProduct = {
  //   name: "Traditional Embroidered Juttis",
  //   images: [
  //     "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=1000&fit=crop",
  //     "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop",
  //     "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=1000&fit=crop",
  //     "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=1000&fit=crop"
  //   ]
  // };
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsZooming(true);
      lastDistance.current = getDistance(e.touches);
      return;
    }

    if (scale > 1) {
      dragStart.current = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      };
      return;
    }

    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && lastDistance.current) {
      e.preventDefault();

      const newDistance = getDistance(e.touches);
      const zoomFactor = newDistance / lastDistance.current;

      setScale((prev) => Math.min(Math.max(prev * zoomFactor, 1), 4));
      lastDistance.current = newDistance;
      return;
    }

    if (scale > 1) {
      e.preventDefault();
      setOffset({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
      return;
    }

    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    lastDistance.current = null;

    if (scale > 1) return;

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (Math.abs(distance) < 50) return;

    setActiveImage((prev) =>
      distance > 0
        ? Math.min(prev + 1, images.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  useEffect(() => {
    if (scale === 1) {
      setIsZooming(false);
      setOffset({ x: 0, y: 0 });
    }
  }, [scale]);

  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setIsZooming(false);
  }, [activeImage]);

  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetchProductById(id);
      // console.log(response);
      const defaultSizeObj = sizes.find((s) => s.stock > 0) || sizes[0];

      if (response.success && response.product) {
        setSelectedColor(response.product.colors?.[0]?.name || "");
        setSelectedSize(response.product.sizes?.[0]?.size || "");
        setSelectedStock(defaultSizeObj?.stock || 0);
      } else {
        alert(response.error || "Product not found");
      }
    };
    loadProduct();
  }, [id, fetchProductById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const images = [
    cloudinaryOptimize(currentProduct?.coverImage?.url, "detail"),
    ...(currentProduct?.galleryImages || []).map((img) =>
      cloudinaryOptimize(img.url, "detail")
    ),
  ].filter(Boolean);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    // size must be selected
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // stock check (frontend safety)
    if (selectedStock <= 0) {
      alert("This size is out of stock");
      return;
    }

    // quantity should never exceed stock
    if (quantity > selectedStock) {
      alert(`Only ${selectedStock} item(s) available for this size`);
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await addToCart(
        currentProduct,
        selectedSize,
        quantity // 👈 IMPORTANT: use quantity, not 1
      );

      if (response?.success) {
        setAddedToCart(true);
      } else {
        alert(response?.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleProceedToPay = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 👇 SAME LOGIC
      localStorage.setItem("redirectAfterLogin", "/payment");
      navigate("/login");
      return;
    }

    navigate("/payment");
  };
  // const handleViewCart = () => {
  //   if (error) {
  //     alert(error);
  //     clearError();
  //   }
  //   navigate("/checkout");
  // };

  const dinStyle = {
    fontFamily:
      "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 400,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F3ED]">
        <div className="loader"></div>
        <p className="mt-4 text-[#737144] uppercase tracking-[0.25em] text-sm font-light"></p>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="p-10 text-center">
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F3ED]">
          <div className="loader"></div>
          <p className="mt-4 text-[#737144] uppercase tracking-[0.25em] text-sm font-light"></p>
        </div>
      </div>
    );
  }
  const currentProductId = currentProduct._id || currentProduct.id;

  const relatedProducts = products.filter(
    (item) =>
      (item._id || item.id) !== currentProductId &&
      item.category === currentProduct.category
  );
  return (
    <div style={dinStyle} className="bg-[#f9f6ef]">
      <div className=" min-h-screen ">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <div className="w-full  md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail column (desktop only) */}
                <div className="hidden md:flex md:flex-col gap-2 md:overflow-y-auto scrollbar-thin scrollbar-thumb-[#737144]/50 scrollbar-track-transparent">
                  {images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-20 h-24 overflow-hidden border transition-all duration-600 ${
                        activeImage === index
                          ? "border-[#737144] shadow-[0_0_6px_rgba(115,113,68,0.4)]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        loading="lazy"
                        decoding="async"
                        alt={`${currentProduct.name}-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <v className="flex-1 flex items-center justify-center">
                  <div
                    ref={imageContainerRef}
                    className="relative w-full md:max-w-full  overflow-hidden flex items-center justify-center touch-pan-y"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {/* ✅ SLIDER TRACK (FIXES STICKING ISSUE) */}
                    <div className="relative w-full overflow-hidden">
                      <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{
                          transform: isZooming
                            ? "translateX(0px)"
                            : `translateX(-${activeImage * 100}%)`,
                        }}
                      >
                        {images.map((image, index) => {
                          const isActive = index === activeImage;

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-center w-full min-w-full overflow-hidden"
                              style={{
                                pointerEvents: isActive ? "auto" : "none",
                              }}
                              onClick={() => {
                                if (isActive) {
                                  setViewerOpen(true); // 👈 open fullscreen viewer
                                }
                              }}
                            >
                              <img
                                src={image}
                                className="w-full max-h-[85vh] object-contain select-none"
                                loading="lazy"
                                decoding="async"
                                alt={`${currentProduct.name}-${index}`}
                                draggable={false}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewerOpen(true);
                                }}
                                className="  absolute  bottom-4 right-4  text-white  p-2  transition "
                                aria-label="Zoom image"
                              >
                                <img
                                  width="20"
                                  height="20"
                                  src="/icons8-zoom-in-50.png"
                                  alt="zoom-in--v1"
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image counter */}
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-700">
                      {activeImage + 1} / {images.length}
                    </div>

                    {/* Swipe arrows (mobile only) */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none md:hidden">
                      {activeImage > 0 && (
                        <div className="text-white/70 text-2xl">‹</div>
                      )}
                      {activeImage < images.length - 1 && (
                        <div className="text-white/70 text-2xl ml-auto">›</div>
                      )}
                    </div>

                    {/* Dot indicators (overlay on image – mobile only) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (isAnimating) return;
                            setIsAnimating(true);
                            setActiveImage(index);
                            setTimeout(() => setIsAnimating(false), 300);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeImage === index
                              ? "bg-white w-6"
                              : "bg-white/50 w-2"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </v>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8 px-8 py-12 lg:max-w-lg max-w-none">
            {/* Product Name */}
            <div>
              <h1 className="text-lg font-bold text-[#737144] tracking-wide mb-6">
                {currentProduct.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mt-2">
                {currentProduct.comparePrice &&
                currentProduct.comparePrice < currentProduct.price ? (
                  <>
                    <span className="text-xl font-medium text-[#737144]">
                      INR {Number(currentProduct.comparePrice).toLocaleString()}
                    </span>

                    <span className="text-base text-neutral-500 line-through">
                      INR {Number(currentProduct.price).toLocaleString()}
                    </span>

                    <span className="text-xs text-[#737144] bg-[#f4f3ed] px-2 py-0.5 rounded-md tracking-wider">
                      {Math.round(
                        ((currentProduct.price - currentProduct.comparePrice) /
                          currentProduct.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-medium text-[#737144]">
                    INR {Number(currentProduct.price).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#737144] mb-6">
                (Inclusive of all Taxes)
              </p>
            </div>

            {/* Color Selection */}
            {/* {currentProduct.colors && currentProduct.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#737144] mb-4">
                  Color: <span className="text-[#737144]">{selectedColor}</span>
                </h3>
                <div className="flex space-x-3">
                  {currentProduct.colors.map((color) => (
                    <button
                      key={color._id}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setAddedToCart(false);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-gray-800 ring-2 ring-offset-2 ring-gray-300"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )} */}

            {/* Size Selection */}
            {currentProduct.sizes && currentProduct.sizes.length > 0 && (
              <div className="mt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-light tracking-[0.1em] text-[#737144] uppercase">
                    Size:{" "}
                    <span className="font-medium text-[#555]">
                      {selectedSize}
                    </span>
                  </h3>
                  <button
                    className="text-xs text-[#737144] underline underline-offset-4 hover:text-[#5f5d3d] transition-colors"
                    onClick={() => setOpen(true)}
                  >
                    Size Chart
                  </button>
                </div>
                {open && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    {/* Modal Box */}
                    <div className="relative bg-[#f6edd3] rounded-xl shadow-xl max-w-3xl w-full p-4">
                      {/* Close Button */}
                      <button
                        onClick={() => setOpen(false)}
                        className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-black"
                      >
                        ✕
                      </button>

                      {/* Image */}
                      <div className="flex justify-center">
                        <img
                          src={sizeChart}
                          loading="lazy"
                          decoding="async"
                          alt="Size Chart"
                          className="
                  max-h-[80vh]
                  w-auto
                  max-w-full
                  object-contain
                "
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Size Buttons */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {currentProduct.sizes.map((size) => (
                    <button
                      key={size._id}
                      onClick={() => {
                        setSelectedSize(size.size);
                        setSelectedStock(size.stock);
                        setQuantity(1);
                        setAddedToCart(false);
                      }}
                      disabled={size.stock === 0}
                      className={`relative py-2 px-3 text-sm font-light tracking-wide  border transition-all duration-300
            ${
              size.stock === 0
                ? "opacity-40 cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
                : selectedSize === size.size
                ? "border-[#737144] bg-[#737144]/10 text-[#737144] shadow-inner"
                : "border-neutral-300 bg-white text-[#555] hover:border-[#737144]/60 hover:text-[#737144]"
            }`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quantity */}

            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm text-[#737144] tracking-wide uppercase">
                Quantity
              </span>

              <div className="flex items-center border border-[#737144]/40">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!selectedSize}
                  className={`px-4 py-2 text-lg ${
                    !selectedSize
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#737144]"
                  }`}
                >
                  −
                </button>

                <span className="px-4 py-2 text-sm text-[#555]">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(selectedStock || 1, q + 1))
                  }
                  disabled={!selectedSize || quantity >= selectedStock}
                  className={`px-4 py-2 text-lg ${
                    !selectedSize || quantity >= selectedStock
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#737144]"
                  }`}
                >
                  +
                </button>
              </div>

              {selectedSize ? (
                <span className="text-xs text-[#737144]"></span>
              ) : (
                <span className="text-xs text-neutral-400">
                  Select a size first
                </span>
              )}
            </div>

            {/* Tabs */}
            <div>
              <div className="border-b border-neutral-300">
                <nav className="flex flex-wrap gap-6 sm:gap-10">
                  {[
                    { key: "description", label: "DESCRIPTION" },
                    { key: "shipping", label: "SHIPPING" },
                    // { key: "dimension", label: "DIMENSION" },
                    { key: "care", label: "CARE" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative py-3 text-xs sm:text-sm tracking-[0.15em] font-light uppercase transition-all duration-300
            ${
              activeTab === tab.key
                ? "text-[#737144] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#737144]"
                : "text-[#777] hover:text-[#737144] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#737144] hover:after:w-full after:transition-all after:duration-300"
            }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="pt-8 pb-10">
                <div className="text-sm text-[#555] leading-relaxed max-w-3xl">
                  {activeTab === "description" && (
                    <div className="space-y-4">
                      <p>{currentProduct.description}</p>
                      <p>
                        {currentProduct.origin ||
                          "Made in India with love and care."}
                      </p>
                    </div>
                  )}

                  {activeTab === "shipping" && (
                    <div className="space-y-3 text-sm text-[#555] leading-relaxed">
                      <p>
                        Delivery across India typically takes{" "}
                        <span className="text-[#737144]">
                          8–10 working days
                        </span>{" "}
                        from dispatch, and{" "}
                        <span className="text-[#737144]">
                          shipping is complimentary across India
                        </span>
                        .
                      </p>

                      <p className="pt-2 text-[#737144] font-medium">
                        What you’ll receive in the box:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Personalised postcard sealed in a heritage sparrow
                          envelope
                        </li>
                        <li>Protective jutti dust bag</li>
                        <li>Handwritten cash memo</li>
                      </ul>
                    </div>
                  )}

                  {/* {activeTab === "dimension" && (
                    <p>{currentProduct.dimensions?.size || "long"}</p>
                  )} */}

                  {activeTab === "care" && (
                    <p>
                      {currentProduct.specifications?.care ||
                        "Dry clean only. Avoid moisture and direct contact with water. After use, allow the pair to air out and store it in the Heritage Sparrow dust bag provided to preserve its shape and embroidery."}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {!addedToCart ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedSize}
                  className={`w-full py-4 px-6 text-sm tracking-[0.15em] uppercase font-light transition-all duration-300
        ${
          isAddingToCart || !selectedSize
            ? "bg-[#737144]/30 text-gray-300 cursor-not-allowed"
            : "bg-[#737144] text-white hover:bg-[#5f5d3d]"
        }`}
                >
                  {isAddingToCart ? "Adding to Bag..." : "Add to Bag"}
                </button>
              ) : (
                <button
                  onClick={handleProceedToPay}
                  className="w-full py-4 px-6 text-sm tracking-[0.15em] uppercase font-light
        bg-[#737144] text-white hover:bg-[#5f5d3d]
        transition-all duration-300"
                >
                  Proceed to Pay
                </button>
              )}
            </div>

            {/* Need Assistance */}
            {/* <div className="pt-4">
              <button className="text-sm text-gray-600 underline hover:text-gray-800 tracking-wide">
                NEED ASSISTANCE?
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="w-full py-16">
          <div className=" mx-auto px-8">
            <h2 className="text-lg font-bold text-[#737144] tracking-wide mb-6">
              RELATED PRODUCTS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/feature/${rel._id}`)}
                >
                  <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                    <img
                      src={rel.coverImage?.url || img}
                      alt={rel.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-sm font-medium text-[#737144] uppercase tracking-wide mb-1">
                    <div className="text-center text-sm tracking-wide">
                      {rel.name}
                    </div>
                    <div className="text-center text-sm  mt-1">
                      INR {Number(rel.price).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD FULLSCREEN VIEWER HERE */}
      {viewerOpen && (
        <FullscreenImageViewer
          images={images}
          startIndex={activeImage}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}

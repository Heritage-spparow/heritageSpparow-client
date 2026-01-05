import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContex";
import { useProduct } from "../context/ProductContext";
import img from "../assets/demo3.jpg";
import { useAuth } from "../context/AuthContext";
import sizeChart from "../assets/SizeChart-01.png";

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
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageContainerRef = useRef(null);

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
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }

    if (isRightSwipe) {
      setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetchProductById(id);
      console.log(response);

      if (response.success && response.product) {
        setSelectedColor(response.product.colors?.[0]?.name || "");
        setSelectedSize(response.product.sizes?.[0]?.size || "");
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
    currentProduct?.coverImage?.url,
    ...(currentProduct?.galleryImages || []).map((img) => img.url),
  ].filter(Boolean);

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login", { state: { from: `/feature/${id}` } });
      return;
    }
    if (!selectedSize) {
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await addToCart(currentProduct, selectedSize, 1);
      if (response.success) {
        setAddedToCart(true);
      } else {
        alert(response.error || "Failed to add to cart");
      }
    } catch (err) {
      alert("An error occurred while adding to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };
  const handleViewCart = () => {
    if (error) {
      alert(error);
      clearError();
    }
    navigate("/checkout");
  };

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
        <p className="text-red-600">{error || "Product not found."}</p>
        <button
          onClick={() => {
            clearError();
            navigate("/");
          }}
          className="mt-4 bg-green-800 text-white px-8 py-3 rounded-md font-medium hover:bg-green-900"
        >
          Back to Home
        </button>
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
                        alt={`${currentProduct.name}-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 flex items-center justify-center">
                  <div
                    ref={imageContainerRef}
                    className=" relative w-full  md:max-w-full bg-white overflow-hidden flex items-center justify-center touch-pan-y "
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <img
                      src={images[activeImage]}
                      alt={currentProduct.name}
                      className="
              w-full
              h-full
              object-contain
              transition-transform
              duration-700
            "
                    />

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
                          onClick={() => setActiveImage(index)}
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
                </div>
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

              {/* Shipping Link */}
              <div className="mb-8">
                <button className="text-sm text-[#737144] underline hover:text-blue-700">
                  Shipping
                </button>
                <span className="text-xs text-[#737144] ml-2">
                  calculated at checkout.
                </span>
              </div>
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
                    <p>
                      {currentProduct.shippingInfo?.estimatedDelivery ||
                        "Standard delivery: 7 – 10 business days. Free shipping on orders over INR 1,500."}
                    </p>
                  )}

                  {/* {activeTab === "dimension" && (
                    <p>{currentProduct.dimensions?.size || "long"}</p>
                  )} */}

                  {activeTab === "care" && (
                    <p>
                      {currentProduct.specifications?.care ||
                        "Dry clean only. Store in a cool, dry place away from direct sunlight."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button Section */}
            <div className="space-y-4 mt-6">
              {addedToCart ? (
                <button
                  onClick={handleViewCart}
                  className="w-full py-4 px-6 bg-[#737144] text-white text-sm  tracking-[0.15em] uppercase font-light  
                  transition-all duration-300 hover:bg-[#5f5d3d] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={
                    isAddingToCart ||
                    (currentProduct.sizes?.length > 0 && !selectedSize) ||
                    (currentProduct.colors?.length > 0 && !selectedColor)
                  }
                  className={`w-full py-4 px-6 text-sm tracking-[0.15em] uppercase font-light  transition-all duration-300 
        ${
          isAddingToCart ||
          (currentProduct.sizes?.length > 0 && !selectedSize) ||
          (currentProduct.colors?.length > 0 && !selectedColor)
            ? "bg-[#737144]/30 text-gray-300 cursor-not-allowed"
            : "bg-[#737144] text-white hover:bg-[#5f5d3d] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
        }`}
                >
                  {isAddingToCart ? "Adding to Bag..." : "Add to Bag"}
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
    </div>
  );
}

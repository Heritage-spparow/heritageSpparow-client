import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContex";
import { useProduct } from "../context/ProductContext";
import img from "../assets/demo3.jpg";
import { useAuth } from "../context/AuthContext";

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

  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetchProductById(id);
      if (response.success && response.product) {
        setSelectedColor(response.product.colors?.[0]?.name || "");
        setSelectedSize(response.product.sizes?.[0]?.name || "");
      } else {
        alert(response.error || "Product not found");
      }
    };
    loadProduct();
  }, [id, fetchProductById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async () => {
  if (!isAuthenticated || !user) {
    alert("Please log in to add products to your cart.");
    navigate("/login", { state: { from: `/feature/${id}` } });
    return;
  }
  if (!selectedColor || !selectedSize) {
    alert("Please select both color and size before adding to cart.");
    return;
  }

  setIsAddingToCart(true);
  try {
    const response = await addToCart(
      currentProduct,
      selectedColor,
      selectedSize,
      1
    );
    if (response.success) {
      setAddedToCart(true);
      alert("Product added to cart successfully!");
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

  const relatedProducts = products.filter(
    (item) =>
      item.id !== currentProduct.id && item.category === currentProduct.category
  );

  return (
    <div style={dinStyle} className="min-h-screen bg-[#f9f6ef]">
      <div className="px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          {/* Product Gallery */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail column */}
            <div className="flex md:flex-col gap-2 md:overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#737144]/50 scrollbar-track-transparent">
              {currentProduct.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border transition-all duration-300 ${
                    activeImage === index
                      ? "border-[#737144] shadow-[0_0_6px_rgba(115,113,68,0.4)]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${currentProduct.name}-${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main product image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[3/4] overflow-hidden  bg-[#f5f5f5] group">
                <img
                  src={img}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 "
                />

                {/* Subtle scroll indicator for mobile */}
                <div className="absolute bottom-3 right-3 text-xs text-[#737144]/70 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md md:hidden">
                  Swipe →
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8 max-w-lg">
            {/* Product Name */}
            <div>
              <h1 className="text-lg font-bold text-[#737144] tracking-wide mb-6">
                {currentProduct.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mt-2">
                {currentProduct.discountPrice ? (
                  <>
                    {/* Discounted Price */}
                    <span className="text-xl font-medium text-[#737144]">
                      INR{" "}
                      {Number(currentProduct.discountPrice).toLocaleString()}
                    </span>

                    {/* Original Price (struck through) */}
                    <span className="text-base text-neutral-500 line-through">
                      INR {Number(currentProduct.price).toLocaleString()}
                    </span>

                    {/* Discount Percentage (optional, subtle badge) */}
                    {currentProduct.price > currentProduct.discountPrice && (
                      <span className="text-xs text-[#737144] bg-[#f4f3ed] px-2 py-0.5 rounded-md tracking-wider">
                        {Math.round(
                          ((currentProduct.price -
                            currentProduct.discountPrice) /
                            currentProduct.price) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                  </>
                ) : (
                  // No discount — show normal price
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
                  <button className="text-xs text-[#737144] underline underline-offset-4 hover:text-[#5f5d3d] transition-colors">
                    Size Chart
                  </button>
                </div>

                {/* Size Buttons */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {currentProduct.sizes.map((size) => (
                    <button
                      key={size._id}
                      onClick={() => {
                        setSelectedSize(size.name);
                        setAddedToCart(false);
                      }}
                      disabled={size.stock === 0}
                      className={`relative py-2 px-3 text-sm font-light tracking-wide  border transition-all duration-300
            ${
              size.stock === 0
                ? "opacity-40 cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
                : selectedSize === size.name
                ? "border-[#737144] bg-[#737144]/10 text-[#737144] shadow-inner"
                : "border-neutral-300 bg-white text-[#555] hover:border-[#737144]/60 hover:text-[#737144]"
            }`}
                    >
                      {size.name}
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
                    { key: "dimension", label: "DIMENSION" },
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
                        {currentProduct.material ||
                          "Crafted from premium silk, this saree features intricate handwoven patterns that reflect traditional artistry."}
                      </p>
                      <p>
                        {currentProduct.style ||
                          "Perfect for weddings, festivals, and special occasions, this saree adds a touch of elegance to any ensemble."}
                      </p>
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

                  {activeTab === "dimension" && (
                    <p>{currentProduct.dimensions?.size || "long"}</p>
                  )}

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
                  className="w-full py-4 px-6 bg-[#737144] text-white text-sm tracking-[0.15em] uppercase font-light  transition-all duration-300 hover:bg-[#5f5d3d] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
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
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-lg font-medium text-gray-900 mb-8 tracking-wide">
              RELATED PRODUCTS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/feature/${rel.id}`)}
                >
                  <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                    <img
                      src={rel.images?.[0]?.url || img}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-700 tracking-wide">
                    {rel.name}
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-1">
                    INR {Number(rel.price).toLocaleString()}
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

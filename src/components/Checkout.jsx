import React, { useState } from "react";
import { useCart } from "../context/CartContex";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import favicon from "../assets/logo.png";

export default function Checkout() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearError,
    loading,
    error,
  } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const conversionRate = 83;

  const dinStyle = {
    fontFamily:
      "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 400,
  };

  const convert = (amount) => {
    const validAmount = Number(amount) || 0;
    return currency === "INR"
      ? `₹ ${validAmount.toLocaleString("en-IN")}`
      : `$ ${(validAmount / conversionRate).toFixed(2)}`;
  };
  // console.log(items);
  const shippingCost = totalPrice > 1500 ? 0 : 150;
  // const taxAmount = Math.round((Number(totalPrice) || 0) * 0.18);
  const taxAmount = 0;
  const grandTotal = (Number(totalPrice) || 0) + shippingCost + taxAmount;

  const handleQuantityChange = async (_id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await updateQuantity(_id, newQuantity);
      if (!response.success) alert(response.error);
    } catch {
      alert("An error occurred while updating quantity.");
    }
  };

  const handleRemoveItem = async (productId, size) => {
    await removeFromCart(productId, size);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 300));

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.setItem("redirectAfterLogin", "/payment");
        navigate("/login");
        return;
      }

      navigate("/payment");
    } catch {
      alert("An error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    clearError();
    console.log(items);
    navigate("/");
  };

  if (loading)
    return (
      <div
        style={dinStyle}
        className="min-h-screen bg-[#f9f6ef] flex items-center justify-center text-[#737144] text-xl font-medium"
      >
        Loading your cart...
      </div>
    );

  if (error)
    return (
      <div
        style={dinStyle}
        className="min-h-screen bg-[#f9f6ef] flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-3xl font-semibold text-[#737144] mb-4">
          Error Loading Cart
        </h1>
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={handleContinueShopping}
          className="px-6 py-3 rounded-lg bg-[#737144] text-white font-medium hover:bg-[#5f5d3d] transition"
        >
          Back to Home
        </button>
      </div>
    );

  if (!items || items.length === 0)
    return (
      <div
        style={dinStyle}
        className="min-h-screen bg-[#f9f6ef] flex flex-col items-center justify-center text-center px-6"
      >
        {/* <div className="w-12 h-12 mb-4 bg-[#737144]  flex items-center justify-center rounded-full">
          <img
            src="./heitageSparrow.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div> */}
        <h1 className="text-3xl font-semibold text-[#737144] mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven’t added any items yet.
        </p>
        <button
          onClick={handleContinueShopping}
          className="px-6 py-3 rounded-lg bg-[#737144] text-white uppercase tracking-[0.15em] font-light hover:bg-[#5f5d3d] transition"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div style={dinStyle} className="min-h-screen bg-[#f9f6ef] pt-20 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-16 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleContinueShopping}
            className="text-[#737144] hover:opacity-80 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#737144] uppercase tracking-wider">
              Checkout
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {totalItems} item{totalItems !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-[#f9f6ef] shadow-sm border border-gray-200/80 p-6 transition"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image */}
                <div className="w-full sm:w-1/3 bg-gray-100  overflow-hidden">
                  <img
                    src={item.product?.coverImage?.url}
                    alt={item.product?.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-bg)]">
                      {item.product.name || "Unnamed Product"}
                    </h3>
                    <p className="text-md mt-1 font-medium text-[#737144]">
                      {item.product.discountPrice ? (
                        <>
                          <span className="line-through text-[var(--color-bg)] mr-2">
                            {convert(item.product.price)}
                          </span>
                          <span className="text-green-700 font-semibold">
                            {convert(item.product.discountPrice)}
                          </span>
                        </>
                      ) : (
                        convert(item.product.price)
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-bg)]">
                    <span>
                      Size:{" "}
                      <span className="font-medium">{item.size || "N/A"}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[var(--color-bg)]">
                        Quantity:
                      </span>
                      <div className="flex items-center text-[var(--color-bg)] border border-gray-300 rounded-md glass-card">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              (item.quantity || 1) - 1
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition"
                          disabled={loading || item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              (item.quantity || 1) + 1
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition"
                          disabled={loading}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleRemoveItem(item.product._id, item.size)
                      }
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="text-right mt-3 font-medium text-[#737144]">
                    Subtotal:{" "}
                    {convert(
                      (item.product.discountPrice || item.product.price || 0) *
                        (item.quantity || 1)
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-[#f9f6ef] shadow-sm border border-gray-200/80 p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#737144] uppercase tracking-wider">
              Order Summary
            </h2>
            {/* <button
              onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
              className="text-sm text-blue-700 hover:underline"
            >
              View in {currency === "INR" ? "USD" : "INR"}
            </button> */}
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Items ({totalItems})</span>
              <span>{convert(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : convert(shippingCost)}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Tax</span>
              <span>{convert(taxAmount)}</span>
            </div> */}
            <hr className="my-2" />

            <div className="flex justify-between font-semibold text-[#737144] text-lg">
              <span>Total</span>
              <span>{convert(grandTotal)}</span>
            </div>

            <p className="mt-1 text-[11px] text-gray-500 tracking-wide">
              Inclusive of all taxes
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleCheckout}
              disabled={isProcessing || loading}
              className={`w-full py-4 px-6 text-sm tracking-[0.15em] uppercase font-light  transition-all duration-300 ${
                isProcessing || loading
                  ? "bg-[#737144]/30 text-gray-100 cursor-not-allowed"
                  : "bg-[#737144] text-white hover:bg-[#5f5d3d] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
              }`}
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </button>

            <button
              onClick={handleContinueShopping}
              className="w-full py-3 bg-transparent text-[#737144]  font-medium border border-[#737144] hover:bg-[#737144]/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

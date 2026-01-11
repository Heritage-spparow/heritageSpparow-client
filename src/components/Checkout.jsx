import React, { useState } from "react";
import { useCart } from "../context/CartContex";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { cloudinaryOptimize } from "../utils/loudinary";

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

  const dinStyle = {
    fontFamily:
      "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 400,
  };

  const convert = (amount) => {
    const validAmount = Number(amount) || 0;
    return `₹ ${validAmount.toLocaleString("en-IN")}`;
  };

  const shippingCost = totalPrice > 1500 ? 0 : 150;
  const taxAmount = 0;
  const grandTotal = (Number(totalPrice) || 0) + shippingCost + taxAmount;

  const handleQuantityChange = async (_id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await updateQuantity(_id, newQuantity);
      if (!res.success) alert(res.error);
    } catch {
      alert("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId, size) => {
    await removeFromCart(productId, size);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/payment");
      navigate("/login");
      return;
    }

    navigate("/payment");
    setIsProcessing(false);
  };

  const handleContinueShopping = () => {
    clearError();
    navigate("/");
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div
        style={dinStyle}
        className="min-h-screen bg-[#f9f6ef] flex items-center justify-center text-[#737144] tracking-[0.2em] uppercase text-sm"
      >
        Preparing your cart…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={dinStyle}
        className="min-h-screen bg-[#f9f6ef] flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-xl tracking-[0.2em] uppercase text-[#737144] mb-4">
          Unable to Load Cart
        </h1>
        <p className="text-sm text-[#737144]/70 mb-6">{error}</p>
        <button
          onClick={handleContinueShopping}
          className="px-8 py-3 border border-[#737144]/40 text-[#737144] tracking-[0.15em] uppercase text-xs hover:bg-[#737144]/10 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div
        style={dinStyle}
        className="min-h-screen bg-[#f9f6ef] flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-xl tracking-[0.25em] uppercase text-[#737144] mb-4">
          Your Bag is Empty
        </h1>
        <p className="text-sm text-[#737144]/70 mb-8">
          Begin your journey with our handcrafted pieces.
        </p>
        <button
          onClick={handleContinueShopping}
          className="px-10 py-3 border border-[#737144]/40 text-[#737144] uppercase tracking-[0.2em] text-xs hover:bg-[#737144]/10 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div style={dinStyle} className="min-h-screen bg-[#f9f6ef] pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-16 mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={handleContinueShopping}
            className="text-[#737144]/80 hover:text-[#737144]"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg tracking-[0.25em] uppercase text-[#737144]">
            Checkout
          </h1>
        </div>
        <p className="text-xs tracking-wide text-[#737144]/70">
          {totalItems} item{totalItems > 1 ? "s" : ""}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 px-6 md:px-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="border border-[#737144]/15 p-6 md:p-8 bg-[#f9f6ef]"
            >
              <div className="flex flex-col sm:flex-row gap-8">
                {/* Image */}
                <div className="w-full sm:w-1/3 bg-[#efeada] p-3">
                  <img
                    src={cloudinaryOptimize(
                      item.product?.coverImage?.url,
                      "card"
                    )}
                    alt={item.product?.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.15em] text-[#737144]">
                      {item.product?.name}
                    </h3>

                    <p className="mt-3 text-sm text-[#737144]/80 tracking-wide">
                      {convert(item.product?.price)}
                    </p>

                    <p className="mt-2 text-xs text-[#737144]/70">
                      Size:{" "}
                      <span className="uppercase tracking-wide">
                        {item.size}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    {/* Quantity */}
                    <div className="flex items-center border border-[#737144]/30">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-[#737144]/10 transition"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="px-4 py-2 text-sm text-[#737144]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            item.quantity + 1
                          )
                        }
                        className="p-2 hover:bg-[#737144]/10 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        handleRemoveItem(item.product._id, item.size)
                      }
                      className="text-[#737144]/50 hover:text-[#737144]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-right text-[#737144]">
                    Subtotal:{" "}
                    {convert(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[#f6f2e8] border border-[#737144]/20 p-8 h-fit sticky top-28">
          <h2 className="text-sm tracking-[0.25em] uppercase text-[#737144] mb-8">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm text-[#737144]/80">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{convert(totalPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Complimentary" : convert(shippingCost)}</span>
            </div>

            <hr className="border-[#737144]/20 my-4" />

            <div className="flex justify-between text-[#737144] text-base">
              <span>Total</span>
              <span>{convert(grandTotal)}</span>
            </div>

            <p className="text-[11px] tracking-wide text-[#737144]/60">
              Inclusive of all taxes
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 uppercase tracking-[0.2em] text-xs transition ${
                isProcessing
                  ? "bg-[#737144]/30 text-white cursor-not-allowed"
                  : "bg-[#737144] text-[#f9f6ef] hover:bg-[#5f5d3d]"
              }`}
            >
              Proceed to Payment
            </button>

            <button
              onClick={handleContinueShopping}
              className="w-full py-3 border border-[#737144]/40 text-[#737144] uppercase tracking-[0.15em] text-xs hover:bg-[#737144]/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

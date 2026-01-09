import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContex";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Truck, Check, Info, X, CreditCard } from "lucide-react";

import { useForm } from "react-hook-form";

// THEME COLORS (same as FeatureProduct)
const BRAND_COLOR = "#737144";
const BG_COLOR = "#f9f6ef";

export default function Payment() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const { createOrder } = useOrder();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [emailNews, setEmailNews] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const { register, handleSubmit, reset } = useForm();

  const reverseGeocode = async (lat, lon) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    return res.json();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/payment" },
      });
    }
  }, [isAuthenticated]);

  const currentUser = {
    firstName: user?.firstName || "Guest",
    lastName: user?.lastName || "",
    email: user?.email,
    phone: user?.phone || "",
    addresses: user?.addresses ?? [],
  };

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Secure Online Payment (UPI, Cards, Wallets)",
      description: "",
      icon: CreditCard,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "",
      icon: Truck,
    },
  ];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  // Default address selection
  useEffect(() => {
    const defaultAddress =
      currentUser.addresses.find((a) => a.isDefault) ||
      currentUser.addresses[0];

    if (defaultAddress) {
      setSelectedAddress(formatAddress(defaultAddress));
    }
  }, [currentUser.addresses]);

  useEffect(() => {
    // If address already exists → DO NOTHING
    if (currentUser.addresses.length > 0) return;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await reverseGeocode(latitude, longitude);

          const addr = data.address || {};

          setSelectedAddress({
            firstName: "",
            lastName: "",
            phone: "",
            street: "",
            addressLine2: "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            zipCode: addr.postcode || "",
            country: addr.country || "India",
          });
        } catch (err) {
          console.warn("Location fetch failed");
        }
      },
      () => {
        console.warn("User denied location access");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [currentUser.addresses.length]);

  const formatAddress = (addr) => ({
    id: addr._id,
    label: addr.label,
    firstName: addr.firstName,
    lastName: addr.lastName,
    phone: addr.phone,
    street: addr.address,
    city: addr.city,
    state: addr.state,
    zipCode: addr.postalCode,
    addressLine2: addr.addressLine2,
  });

  const handleAddressChange = (e) => {
    const val = e.target.value;
    if (val === "addNew") {
      setShowAddressModal(true);
      setShowAddAddressForm(true);
    } else {
      const found = currentUser.addresses.find((addr) => addr._id === val);
      if (found) setSelectedAddress(formatAddress(found));
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) return alert("Please enter delivery address.");
    if (!selectedPaymentMethod) return alert("Select a payment method.");

    setIsProcessing(true);

    try {
      if (saveInfo) {
        const newAddress = {
          label: "home",
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          phone: selectedAddress.phone,
          address: selectedAddress.street,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.zipCode,
          country: "India",
        };

        try {
          await addAddress(newAddress);
        } catch (err) {
          console.log("Address save failed... continuing with payment.");
        }
      }
      const itemsPrice = totalPrice;
      const taxPrice = itemsPrice * 1;
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const finalTotal = itemsPrice;

      const orderPayload = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.coverImage?.url || "",
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          color: item.color || item.selectedColor,
          size: Number(item.size || item.selectedSize),
        })),
        shippingAddress: {
          address: selectedAddress.street,
          city: selectedAddress.city,
          postalCode: selectedAddress.zipCode,
          state: selectedAddress.state,
          phone: selectedAddress.phone,
          country: "India",
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice: finalTotal,
      };

      // Cash on Delivery Flow
      if (selectedPaymentMethod === "cod") {
        const orderRes = await createOrder({
          ...orderPayload,
          paymentMethod: "cod",
        });
        console.log(orderRes);
        if (orderRes.success) {
          setShowModal(true); // ✅ UI reacts immediately

          // fire-and-forget (do NOT block UI)
          clearCart().catch((err) => console.error("Clear cart failed:", err));
        }
        return;
      }

      // Razorpay Payment Flow
      const rzResponse = await api.post("/orders/razorpay", {
        amount: finalTotal,
      });

      const { key, order: rzOrder } = rzResponse.data;

      const options = {
        key,
        amount: rzOrder.amount,
        currency: "INR",
        name: "HERITAGE SPARROW",
        description: "HERITAGE SPARROW",
        image: "/login.png",
        order_id: rzOrder.id,
        prefill: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          contact: "91" + selectedAddress.phone.replace(/\D/g, "").slice(-10),
        },
        theme: { color: BRAND_COLOR },

        handler: async function (response) {
          try {
            const captureRes = await api.post("/orders/capture", {
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              ...orderPayload,
            });

            if (captureRes.data.success) {
              await clearCart();
              setShowModal(true);
            } else {
              alert("Payment succeeded but order not confirmed.");
            }
          } catch (err) {
            alert(
              "Order confirmation failed. Contact support with Payment ID: " +
                response.razorpay_payment_id
            );
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  const onAddAddress = async (data) => {
    try {
      const newAddress = {
        label: data.label,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.street,
        city: data.city,
        postalCode: data.zipCode,
        country: "India",
        state: data.state,
        addressLine2: data.addressLine2,
      };

      const res = await addAddress(newAddress);

      if (res.success) {
        setSelectedAddress(
          formatAddress({ ...newAddress, _id: res.address._id })
        );
        setShowAddressModal(false);
        reset();
      }
    } catch (error) {
      alert("Failed to add address");
    }
  };

  return (
    <div
      style={{ backgroundColor: BG_COLOR, fontFamily: "'D-DIN', sans-serif" }}
      className="min-h-screen py-12 px-4 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className="flex items-start flex-col justify-start  font-semibold
                       border-l-[5px] border-solid px-3  text-[var(--color-bg)]
                       text-lg sm:text-2xl tracking-wide mb-4"
        >
          Complete the Experience
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="bg-white  border border-[#e5e4da] shadow-sm">
              <div className="p-6 border-b border-[#e5e4da]">
                <h2 className="text-lg font-light tracking-[0.15em] text-[#737144] uppercase">
                  Contact
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <input
                  type="email"
                  value={currentUser.email}
                  readOnly
                  className="w-full px-4 py-3 border border-[#d6d4c2] rounded-md bg-white text-[#555]
                  focus:ring-2 focus:ring-[#737144]/30 focus:border-[#737144]"
                />

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNews}
                    onChange={(e) => setEmailNews(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#737144]"
                  />
                  <span className="text-sm text-[#555]">
                    Email me with news and offers
                  </span>
                </label>
              </div>
            </div>

            {/* DELIVERY SECTION */}
            <div className="bg-white  border border-[#e5e4da] shadow-sm">
              <div className="p-6 border-b border-[#e5e4da]">
                <h2 className="text-lg font-light tracking-[0.15em] text-[#737144] uppercase">
                  Delivery
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Country */}
                <div>
                  <label className="block text-sm text-[#777] mb-1">
                    Country/Region
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-[#d6d4c2]  bg-white text-[#555]
                     focus:ring-2 focus:ring-[#737144]/30 focus:border-[#737144]"
                    defaultValue="India"
                    disabled
                  >
                    <option>India</option>
                  </select>
                </div>

                {/* Editable Address Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={selectedAddress?.firstName || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        firstName: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da] rounded-md"
                    placeholder="First Name"
                  />

                  <input
                    type="text"
                    value={selectedAddress?.lastName || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        lastName: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da] rounded-md"
                    placeholder="Last Name"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={selectedAddress?.street || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        street: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da] "
                    placeholder="Street Address"
                  />

                  <input
                    type="text"
                    value={selectedAddress?.addressLine2 || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        addressLine2: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da]"
                    placeholder="Address Line 2 (Optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={selectedAddress?.city || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        city: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da]"
                    placeholder="City"
                  />

                  <input
                    type="text"
                    value={selectedAddress?.state || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        state: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da]"
                    placeholder="State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    value={selectedAddress?.phone || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        phone: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da] "
                    placeholder="Phone Number"
                  />

                  <input
                    type="text"
                    value={selectedAddress?.zipCode || ""}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        zipCode: e.target.value,
                      })
                    }
                    className="luxInput p-2 border border-[#e5e4da] "
                    placeholder="Postal Code"
                  />
                </div>

                {/* Save for Next Time checkbox */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-4 h-4 text-[#737144]"
                  />
                  <span className="text-sm text-[#555]">
                    Save this address for next time
                  </span>
                </label>
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="bg-white  border border-[#e5e4da] shadow-sm">
              <div className="p-6 border-b border-[#e5e4da]">
                <h2 className="text-lg font-light tracking-[0.15em] text-[#737144] uppercase">
                  Payment
                </h2>
                <p className="text-sm text-[#777] mt-1">
                  All transactions are secure and encrypted.
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* PAYMENT METHODS */}
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="border border-[#d6d4c2] rounded-xl bg-white hover:shadow-md transition-all"
                  >
                    <div
                      className={`p-4 flex items-center justify-between cursor-pointer
                      ${
                        selectedPaymentMethod === pm.id
                          ? "bg-[#f4f3ed]"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedPaymentMethod(pm.id)}
                    >
                      {/* Radio */}
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all
                          ${
                            selectedPaymentMethod === pm.id
                              ? "border-[#737144] bg-[#737144]"
                              : "border-[#b8b7a8]"
                          }`}
                        >
                          {selectedPaymentMethod === pm.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>

                        <span className="text-sm font-medium text-[#555]">
                          {pm.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BILLING ADDRESS */}
            <div className="bg-white  border border-[#e5e4da] shadow-sm">
              <div className="p-6 border-b border-[#e5e4da]">
                <h2 className="text-lg font-light tracking-[0.15em] text-[#737144] uppercase">
                  Billing Address
                </h2>
              </div>

              <div className="p-6 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all
                    ${
                      sameAsBilling
                        ? "border-[#737144] bg-[#737144]"
                        : "border-[#b8b7a8]"
                    }`}
                    onClick={() => setSameAsBilling(true)}
                  >
                    {sameAsBilling && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-[#555]">
                    Same as shipping address
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all
                    ${
                      !sameAsBilling
                        ? "border-[#737144] bg-[#737144]"
                        : "border-[#b8b7a8]"
                    }`}
                    onClick={() => setSameAsBilling(false)}
                  >
                    {!sameAsBilling && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-[#555]">
                    Use a different billing address
                  </span>
                </label>
              </div>
            </div>

            {/* PAY NOW BUTTON */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 px-6 text-sm tracking-[0.2em] uppercase font-light
              transition-all duration-300 
              ${
                isProcessing
                  ? "bg-[#737144]/30 text-gray-400 cursor-not-allowed"
                  : "bg-[#737144] text-white hover:bg-[#5f5d3d] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
              }`}
            >
              {isProcessing ? "Processing..." : "Complete Your Experience"}
            </button>
          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white  border border-[#e5e4da] p-8 shadow-sm">
              <h2 className="text-lg font-light tracking-[0.15em] text-[#737144] uppercase mb-6">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative">
                      <img
                        src={
                          item.product.coverImage?.url ||
                          "/api/placeholder/80/80"
                        }
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border border-[#d6d4c2]"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#737144] text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {item.quantity}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-[#737144] uppercase tracking-wide">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#777] mt-1">
                        {item.size || item.selectedSize} /{" "}
                        {item.color || item.selectedColor}
                      </p>
                    </div>

                    <div className="font-medium text-[#555]">
                      ₹
                      {(
                        (item.product.discountPrice || item.product.price) *
                        item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* DISCOUNT CODE */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code or gift card"
                    className="flex-1 px-4 py-3 border border-[#d6d4c2] rounded-md focus:ring-2 focus:ring-[#737144]/30 text-sm bg-white text-[#555]"
                  />
                  <button className="px-6 py-3 bg-[#f4f3ed] text-[#737144] rounded-md text-sm font-medium hover:bg-[#e8e5d6] transition-all">
                    Apply
                  </button>
                </div>
              </div>

              {/* TOTALS */}
              <div className="space-y-3 pt-4 border-t border-[#e5e4da]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#777]">
                    Subtotal · {items.length} items
                  </span>
                  <span className="font-medium text-[#555]">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-[#777]">Shipping</span>
                    <Info
                      className="w-4 h-4 text-[#b8b7a8]"
                      onClick={() => setShowShippingInfo(true)}
                    />
                  </div>
                  <span className="text-[#777] text-xs">00.0</span>
                </div>

                <div className="flex justify-between text-lg font-medium pt-3 border-t border-[#e5e4da]">
                  <span className="text-[#555]">
                    Total
                    <p className="text-xs text-[#777] font-normal">
                      Inclusive of all taxes
                    </p>
                  </span>
                  <div className="text-right">
                    <div className="text-[#555]">₹{totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
              <Check className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-light tracking-[0.15em] text-[#737144] uppercase mb-2">
              Order Placed Successfully
            </h2>
            <p className="text-[#555] mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            <button
              onClick={() => (window.location.href = "/orders")}
              className="w-full py-3 bg-[#737144] text-white rounded-md uppercase tracking-[0.15em] font-light
                hover:bg-[#5f5d3d] hover:shadow-md transition-all"
            >
              View Order Details
            </button>
          </div>
        </div>
      )}

      {/* ADDRESS FORM MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-light tracking-[0.1em] text-[#737144] uppercase">
                Add Address
              </h2>
              <X
                className="cursor-pointer hover:text-red-500"
                onClick={() => setShowAddressModal(false)}
              />
            </div>

            <form onSubmit={handleSubmit(onAddAddress)} className="space-y-4">
              <input
                {...register("label")}
                placeholder="Label (e.g., Home)"
                className="luxInput"
              />
              <input
                {...register("firstName")}
                placeholder="First Name"
                className="luxInput"
              />
              <input
                {...register("lastName")}
                placeholder="Last Name"
                className="luxInput"
              />
              <input
                {...register("phone")}
                placeholder="Phone"
                className="luxInput"
              />
              <input
                {...register("street")}
                placeholder="Street Address"
                className="luxInput"
              />
              <input
                {...register("addressLine2")}
                placeholder="Address Line 2"
                className="luxInput"
              />
              <input
                {...register("city")}
                placeholder="City"
                className="luxInput"
              />
              <input
                {...register("state")}
                placeholder="State"
                className="luxInput"
              />
              <input
                {...register("zipCode")}
                placeholder="Zip Code"
                className="luxInput"
              />

              <button
                className="w-full py-3 bg-[#737144] text-white rounded-md font-light uppercase tracking-[0.15em]
                hover:bg-[#5f5d3d] transition-all"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {showShippingInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e4da]">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#737144] font-light">
                Shipping Information
              </h3>
              <button
                onClick={() => setShowShippingInfo(false)}
                className="text-[#777] hover:text-black transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-5 text-sm text-[#555] leading-relaxed">
              <p>
                We work closely with skilled artisans to craft each piece with
                care. Orders are prepared and dispatched with attention to
                detail to ensure they reach you in perfect condition.
              </p>

              <div>
                <p className="text-[#737144] font-medium mb-1">
                  Delivery Timeline
                </p>
                <p>
                  Orders are typically delivered within{" "}
                  <span className="font-medium text-[#737144]">
                    8-10 working days
                  </span>{" "}
                  from the date of dispatch, depending on your location.
                </p>
              </div>

              <div>
                <p className="text-[#737144] font-medium mb-1">
                  Shipping Charges
                </p>
                <p>
                  We currently offer{" "}
                  <span className="font-medium text-[#737144]">
                    complimentary shipping across India
                  </span>
                  .
                </p>
              </div>

              <div className="pt-4 border-t border-[#e5e4da]">
                <p className="text-[#737144] font-medium mb-1">
                  Important Note
                </p>
                <p className="text-[#777]">
                  As each order is processed immediately after confirmation,
                  we’re unable to make changes or cancellations once an order
                  has been placed.
                </p>
              </div>

              <p className="text-xs text-[#999] pt-2">
                For any assistance, please reach out to our{" "}
                <a
                  href="mailto:support@heritagesparrow.com"
                  className="text-[#737144] hover:underline"
                >
                  support
                </a>{" "}
                team before completing your purchase.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e5e4da] bg-[#f9f6ef] text-right">
              <button
                onClick={() => setShowShippingInfo(false)}
                className="text-sm uppercase tracking-[0.15em] font-light text-[#737144] hover:text-[#5f5d3d]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const luxInput =
  "w-full px-4 py-3 border border-[#d6d4c2] rounded-md bg-white text-[#555] focus:ring-2 focus:ring-[#737144]/30 focus:border-[#737144]";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContex";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import api, { couponAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Check, Info, X, CreditCard, MapPin, Trash2 } from "lucide-react";
import { cloudinaryOptimize } from "../utils/loudinary";
import NoticeModal from "../shared/NoticeModal";

import { useForm } from "react-hook-form";

// THEME COLORS (same as FeatureProduct)
const BRAND_COLOR = "#737144";
const BG_COLOR = "#f9f6ef";
const EMPTY_ADDRESSES = [];

const COUNTRY_OPTIONS = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function Payment() {
  const { items, totalPrice, clearCart, removeFromCart } = useCart();
  const { user, addAddress, isAuthenticated, isGuest, guest, startGuestSession, clearGuest } =
    useAuth();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [emailNews, setEmailNews] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [automaticDiscount, setAutomaticDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Guest contact — email only (phone is taken in the delivery address)
  const [contactValue, setContactValue] = useState(guest?.email || "");
  const [contactError, setContactError] = useState("");
  // Show inline "Required" messages after the first submit attempt
  const [showErrors, setShowErrors] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paymentError, setPaymentError] = useState(""); // inline, above pay button
  const [addressModalError, setAddressModalError] = useState("");
  const [notice, setNotice] = useState(null); // site-styled popup for critical messages
  const [removingItem, setRemovingItem] = useState(null);
  const [itemErrors, setItemErrors] = useState({}); // inline error per summary item

  const { register, handleSubmit, reset } = useForm();

  const reverseGeocode = async (lat, lon) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    );
    return res.json();
  };

  useEffect(() => {
    if ((!isAuthenticated && !isGuest) || !items.length) {
      setAutomaticDiscount(0);
      return;
    }

    const loadAutomaticDiscount = async () => {
      try {
        const response = await couponAPI.automatic({
          orderItems: items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            size: item.size || item.selectedSize,
            color: item.color || item.selectedColor,
          })),
        });

        setAutomaticDiscount(Number(response.data?.discountPrice || 0));
      } catch {
        setAutomaticDiscount(0);
      }
    };

    loadAutomaticDiscount();
  }, [isAuthenticated, isGuest, items]);

  const currentUser = {
    firstName: user?.firstName || "Guest",
    lastName: user?.lastName || "",
    email: user?.email || contactValue.trim() || guest?.email || "",
    phone: user?.phone || selectedAddress?.phone || guest?.phone || "",
    addresses: user?.addresses ?? EMPTY_ADDRESSES,
  };

  const shippingCountry = String(selectedAddress?.country || "India").trim();
  const shippingPrice = shippingCountry.toLowerCase() === "india" ? 0 : 1500;
  const totalDiscount = automaticDiscount + couponDiscount;
  const grandTotal = Math.max(0, totalPrice - totalDiscount + shippingPrice);

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Secure Online Payment (UPI, Cards, Wallets)",
      description: "",
      icon: CreditCard,
    },
    // {
    //   id: "cod",
    //   name: "Cash on Delivery",
    //   description: "",
    //   icon: Truck,
    // },
  ];

  // Load Razorpay script once (skip if already on the page)
  useEffect(() => {
    if (window.Razorpay || document.getElementById("razorpay-checkout-js")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
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

  // Location is asked only when the user taps "Use my location"
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported on this device.");
      return;
    }
    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await reverseGeocode(latitude, longitude);
          const addr = data.address || {};

          // Fill only location fields — keep what the user already typed
          setSelectedAddress((prev) => ({
            ...(prev || {}),
            city: addr.city || addr.town || addr.village || prev?.city || "",
            state: addr.state || prev?.state || "",
            zipCode: addr.postcode || prev?.zipCode || "",
            country: addr.country || prev?.country || "India",
          }));
        } catch {
          setLocationError("Couldn't fetch your location. Please fill the address manually.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocationError("Location access denied. Please fill the address manually.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const formatAddress = (addr = {}) => ({
    id: addr._id,
    label: addr.label,
    firstName: String(addr.firstName ?? ""),
    lastName: String(addr.lastName ?? ""),
    phone: String(addr.phone ?? ""),
    street: String(addr.address || addr.street || ""),
    city: String(addr.city ?? ""),
    state: String(addr.state ?? ""),
    zipCode: String(addr.postalCode || addr.zipCode || ""),
    addressLine2: String(addr.addressLine2 ?? ""),
    country: addr.country || "India",
  });

  const isAddressValid = (addr) => {
    if (!addr) return false;

    const requiredFields = [
      addr.firstName,
      addr.lastName,
      addr.phone,
      addr.street || addr.address,
      addr.city,
      addr.state,
      addr.zipCode || addr.postalCode,
      addr.country || "India", // select shows India by default
    ];

    return requiredFields.every(
      (field) => String(field ?? "").trim().length > 0,
    );
  };

  const getContactEmailError = () => {
    if (isAuthenticated) return "";
    const value = contactValue.trim();
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
    return "";
  };

  // Logged in → nothing to do. Otherwise create/reuse a guest session from the email.
  const ensureCheckoutSession = async () => {
    if (isAuthenticated) return true;

    const emailError = getContactEmailError();
    if (emailError) {
      setContactError(emailError);
      return false;
    }
    const value = contactValue.trim();

    // Same email as the current guest session → reuse it
    if (isGuest && guest?.email === value) return true;

    const res = await startGuestSession({
      email: value,
      firstName: selectedAddress?.firstName?.trim(),
      lastName: selectedAddress?.lastName?.trim(),
    });
    if (!res.success) {
      setContactError(res.error);
      return false;
    }
    setContactError("");
    return true;
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (!items.length) {
      setCouponError("Your cart is empty.");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    if (!(await ensureCheckoutSession())) {
      setCouponError("Enter your email or phone above to apply a coupon.");
      setCouponLoading(false);
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size || item.selectedSize,
        color: item.color || item.selectedColor,
      }));

      const response = await couponAPI.apply({
        code,
        orderItems,
        shippingAddress: selectedAddress,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Invalid coupon");
      }

      const data = response.data;

      setAppliedCoupon(data.coupon);
      setCouponDiscount(Number(data.pricing?.discountPrice || 0));

      setCouponCode(data.coupon.code);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponDiscount(0);

      setCouponError(
        error.response?.data?.message ||
          error.message ||
          "Unable to apply coupon.",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove an item straight from the order summary
  const handleRemoveItem = async (item) => {
    if (removingItem || isProcessing) return;
    const isLastItem = items.length === 1;
    setRemovingItem(item._id);
    setItemErrors((prev) => ({ ...prev, [item._id]: "" }));
    try {
      const res = await removeFromCart(item.product._id, item.size || item.selectedSize);
      if (!res?.success) {
        setItemErrors((prev) => ({ ...prev, [item._id]: res?.error || "Failed to remove item" }));
        return;
      }
      // Coupon was calculated on the old cart — let the user re-apply it
      if (appliedCoupon) {
        handleRemoveCoupon();
        setCouponError("Cart changed — please apply your coupon again.");
      }
      if (isLastItem) navigate("/checkout"); // shows "Your bag is empty"
    } finally {
      setRemovingItem(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  // Scroll to the first field showing an inline error
  const scrollToFirstError = () => {
    setTimeout(() => {
      document
        .querySelector('[data-invalid="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const handlePayment = async () => {
    setShowErrors(true);
    setPaymentError("");
    const emailError = getContactEmailError();
    setContactError(emailError);

    if (emailError || !isAddressValid(selectedAddress) || !selectedPaymentMethod) {
      scrollToFirstError();
      return;
    }

    setIsProcessing(true);

    if (!(await ensureCheckoutSession())) {
      setIsProcessing(false);
      scrollToFirstError();
      return;
    }

    try {
      if (saveInfo && isAuthenticated) {
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
          country: shippingCountry,
        };

        try {
          await addAddress(newAddress);
        } catch {
          // Address save failed — continue with payment anyway
        }
      }
      const itemsPrice = totalPrice;
      const taxPrice = 0;
      const finalTotal = grandTotal;

      const orderPayload = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.coverImage?.url || "",
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          color: item.color || item.selectedColor,
          size: item.size || item.selectedSize,
        })),
        shippingAddress: {
          address: selectedAddress.street,
          city: selectedAddress.city,
          postalCode: selectedAddress.zipCode,
          state: selectedAddress.state,
          phone: selectedAddress.phone,
          country: shippingCountry,
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
        if (orderRes.success) {
          setShowModal(true); // ✅ UI reacts immediately

          // fire-and-forget (do NOT block UI)
          clearCart().catch((err) => console.error("Clear cart failed:", err));
        }
        setIsProcessing(false);
        return;
      }

      // Razorpay Payment Flow
      const rzResponse = await api.post("/orders/razorpay", {
        orderItems: orderPayload.orderItems,
        shippingAddress: orderPayload.shippingAddress,
        couponCode: couponCode.trim() || null,
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
          email: currentUser.email || "",
          contact: "91" + selectedAddress.phone.replace(/\D/g, "").slice(-10),
        },
        theme: { color: BRAND_COLOR },

        handler: async function (response) {
          setIsConfirmingPayment(true);
          try {
            const captureRes = await api.post("/orders/razorpay/verify", {
              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_order_id: response.razorpay_order_id,

              razorpay_signature: response.razorpay_signature,
            });
            if (captureRes.data.success) {
              window.gtag?.("event", "purchase", {
                transaction_id: rzOrder.id,
                currency: "INR",
                value: finalTotal,
                items: items.map((item) => ({
                  item_id: item.product._id,
                  item_name: item.product.name,
                  price: item.product.discountPrice || item.product.price,
                  quantity: item.quantity,
                  size: item.size,
                })),
              });

              // Guests can't open /orders — keep the order from the verify response
              setPlacedOrder(captureRes.data.order || captureRes.data.data || null);
              setShowModal(true);
              clearCart().catch((err) =>
                console.error("Clear cart failed after confirmed payment:", err),
              );
            } else {
              setNotice({
                type: "error",
                title: "Order Not Confirmed",
                message: `Your payment went through but we couldn't confirm the order. Please contact support with Payment ID: ${response.razorpay_payment_id}`,
              });
            }
          } catch {
            setNotice({
              type: "error",
              title: "Order Confirmation Failed",
              message: `Please contact support with Payment ID: ${response.razorpay_payment_id}`,
            });
          } finally {
            setIsConfirmingPayment(false);
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentError("Payment was cancelled. You can try again whenever you're ready.");
            setIsProcessing(false);
          },
        },
      };

      if (!window.Razorpay) {
        setPaymentError("Payment window is still loading. Please try again in a moment.");
        setIsProcessing(false);
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const status = error.response?.status;
      if (error.response?.data?.code === "GUEST_OR_LOGIN_REQUIRED") {
        // Guest session expired — ask for contact again
        clearGuest();
        setContactError("Your session expired. Please enter your email again.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (status === 503) {
        setPaymentError(error.response?.data?.message || "Online payments are unavailable right now. Please try again later.");
      } else {
        setPaymentError(error.response?.data?.message || "Payment failed. Please try again.");
      }
      setIsProcessing(false);
    }
  };
  const onAddAddress = async (data) => {
    setAddressModalError("");
    try {
      const newAddress = {
        label: data.label,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.street,
        city: data.city,
        postalCode: data.zipCode,
        country: data.country || shippingCountry,
        state: data.state,
        addressLine2: data.addressLine2,
      };

      const res = await addAddress(newAddress);

      if (res.success) {
        const latestAddress =
          Array.isArray(res.addresses) && res.addresses.length > 0
            ? res.addresses[res.addresses.length - 1]
            : null;

        setSelectedAddress(
          latestAddress
            ? formatAddress(latestAddress)
            : formatAddress({ ...newAddress, _id: Date.now().toString() }),
        );
        setShowAddressModal(false);
        reset();
      } else {
        setAddressModalError(res.error || "Failed to add address");
      }
    } catch {
      setAddressModalError("Failed to add address");
    }
  };

  // Plain render function (not a component) so inputs keep focus while typing
  const renderAddressInput = (field, placeholder, { type = "text", optional = false } = {}) => {
    const invalid =
      showErrors && !optional && !String(selectedAddress?.[field] ?? "").trim();
    return (
      <div data-invalid={invalid}>
        <input
          type={type}
          value={selectedAddress?.[field] || ""}
          onChange={(e) =>
            setSelectedAddress((prev) => ({ ...prev, [field]: e.target.value }))
          }
          className={`luxInput w-full p-2 border rounded-md ${
            invalid ? "border-[#9a6b5a]" : "border-[#e5e4da]"
          }`}
          placeholder={placeholder}
        />
        {invalid && <p className="mt-1 text-xs text-[#9a6b5a]">Required</p>}
      </div>
    );
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
                {isAuthenticated ? (
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    readOnly
                    className="w-full px-4 py-3 border border-[#d6d4c2] rounded-md bg-white text-[#555]
                    focus:ring-2 focus:ring-[#737144]/30 focus:border-[#737144]"
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#777]">Email</span>
                      <button
                        type="button"
                        onClick={() => navigate("/login", { state: { from: "/payment" } })}
                        className="text-xs text-[#737144] underline underline-offset-2"
                      >
                        Login / Sign up
                      </button>
                    </div>

                    <div data-invalid={!!contactError}>
                      <input
                        type="email"
                        value={contactValue}
                        onChange={(e) => {
                          setContactValue(e.target.value);
                          setContactError("");
                        }}
                        placeholder="Email address"
                        className={`w-full px-4 py-3 border rounded-md bg-white text-[#555]
                        focus:ring-2 focus:ring-[#737144]/30 focus:border-[#737144] ${
                          contactError ? "border-[#9a6b5a]" : "border-[#d6d4c2]"
                        }`}
                      />
                      {contactError ? (
                        <p className="mt-1 text-xs text-[#9a6b5a]">{contactError}</p>
                      ) : (
                        <p className="mt-1 text-xs text-[#777]">
                          Checking out as guest — we’ll send order updates here.
                        </p>
                      )}
                    </div>
                  </>
                )}

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
                {/* Optional: autofill city/state/postal code */}
                <div>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#737144] hover:text-[#5f5d3d] disabled:opacity-50"
                  >
                    <MapPin size={14} />
                    {locating ? "Getting location..." : "Use my location"}
                  </button>
                  {locationError && (
                    <p className="mt-1 text-xs text-[#9a6b5a]">{locationError}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm text-[#777] mb-1">
                    Country/Region
                  </label>
                  <select
                    value={selectedAddress?.country || "India"}
                    onChange={(e) =>
                      setSelectedAddress((prev) => ({
                        ...(prev || {}),
                        country: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-[#d6d4c2]  bg-white text-[#555]
                     focus:ring-2 focus:ring-[#737144]/30 focus:border-[#737144]"
                  >
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Editable Address Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  {renderAddressInput("firstName", "First Name")}
                  {renderAddressInput("lastName", "Last Name")}
                </div>
                <div className="flex flex-col gap-4">
                  {renderAddressInput("street", "Street Address")}
                  {renderAddressInput("addressLine2", "Address Line 2 (Optional)", { optional: true })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {renderAddressInput("city", "City")}
                  {renderAddressInput("state", "State")}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {renderAddressInput("phone", "Phone Number", { type: "tel" })}
                  {renderAddressInput("zipCode", "Postal Code")}
                </div>

                {/* Save for Next Time checkbox (logged-in users only) */}
                {isAuthenticated && (
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
                )}
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

              <div
                className="p-6 space-y-4"
                data-invalid={showErrors && !selectedPaymentMethod}
              >
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
                {showErrors && !selectedPaymentMethod && (
                  <p className="text-xs text-[#9a6b5a]">Please select a payment method</p>
                )}
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
                  <div
                    key={item._id}
                    className={`transition-opacity ${
                      removingItem === item._id ? "opacity-50" : ""
                    }`}
                  >
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={cloudinaryOptimize(
                          item.product?.coverImage?.url,
                          "card",
                        )}
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
                        {[item.size || item.selectedSize, item.color || item.selectedColor]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="font-medium text-[#555]">
                        ₹
                        {(
                          (item.product.discountPrice || item.product.price) *
                          item.quantity
                        ).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        disabled={!!removingItem || isProcessing}
                        aria-label={`Remove ${item.product.name}`}
                        className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-[#8a6658] hover:text-[#6f5045] disabled:opacity-50 transition-colors"
                      >
                        <Trash2 size={13} />
                        {removingItem === item._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                  {itemErrors[item._id] && (
                    <p className="mt-1 text-xs text-[#9a6b5a] text-right">{itemErrors[item._id]}</p>
                  )}
                  </div>
                ))}
              </div>
              {/* DISCOUNT CODE */}
              <div className="mb-6">
                {!appliedCoupon ? (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Discount code"
                        className="flex-1 px-4 py-3 border border-[#d6d4c2] rounded-md focus:ring-2 focus:ring-[#737144]/30 text-sm bg-white text-[#555] uppercase"
                        disabled={couponLoading}
                      />

                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-6 py-3 bg-[#f4f3ed] text-[#737144] rounded-md text-sm font-medium hover:bg-[#e8e5d6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="mt-2 text-sm text-[#9a6b5a]">
                        {couponError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between border border-[#d6d4c2] rounded-md px-4 py-3 bg-[#f9f6ef]">
                    <div>
                      <p className="text-sm font-medium text-[#737144]">
                        {appliedCoupon.code}
                      </p>

                      <p className="text-xs text-[#737144] mt-1">
                        Coupon applied · You saved ₹{couponDiscount.toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-[#8a6658] hover:text-[#6f5045] uppercase tracking-wide transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
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
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737144]">Discount</span>

                    <span className="font-medium text-[#737144]">
                      -₹{totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-[#777]">Shipping</span>
                    <Info
                      className="w-4 h-4 text-[#b8b7a8]"
                      onClick={() => setShowShippingInfo(true)}
                    />
                  </div>
                  <span className="text-[#777] text-xs">
                    ₹{shippingPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-medium pt-3 border-t border-[#e5e4da]">
                  <span className="text-[#555]">
                    Total
                    <p className="text-xs text-[#777] font-normal">
                      Inclusive of all taxes
                    </p>
                  </span>
                  <div className="text-right">
                    <div className="text-[#555]">₹{grandTotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAY NOW BUTTON — always at the very bottom (below order summary) */}
          <div className="lg:col-span-2">
            {paymentError && (
              <p className="mb-3 text-sm text-center text-[#9a6b5a]" role="alert">
                {paymentError}
              </p>
            )}
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
                {isProcessing ? (
                  <span className="inline-flex items-center justify-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing payment...
                  </span>
                ) : (
                  "Complete Your Experience"
                )}
              </button>
          </div>
        </div>
      </div>

      {isConfirmingPayment && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#737144]/20 border-t-[#737144]" />
            <h2 className="text-lg font-medium text-[#555]">Confirming your payment</h2>
            <p className="mt-2 text-sm text-[#777]">
              We’re creating your order. Please keep this page open.
            </p>
          </div>
        </div>
      )}

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

            {isAuthenticated ? (
              <button
                onClick={() => navigate("/orders")}
                className="w-full py-3 bg-[#737144] text-white rounded-md uppercase tracking-[0.15em] font-light
                  hover:bg-[#5f5d3d] hover:shadow-md transition-all"
              >
                View Order Details
              </button>
            ) : (
              <>
                {placedOrder && (
                  <div className="text-left text-sm text-[#555] border border-[#e5e4da] rounded-md p-4 mb-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#777]">Order</span>
                      <span>#{placedOrder.orderNumber || placedOrder._id}</span>
                    </div>
                    {placedOrder.orderItems?.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>
                          {it.name} × {it.quantity}
                        </span>
                        <span>₹{Number(it.price * it.quantity || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {placedOrder.totalPrice != null && (
                      <div className="flex justify-between pt-2 border-t border-[#e5e4da] font-medium">
                        <span>Total</span>
                        <span>₹{Number(placedOrder.totalPrice).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() =>
                    navigate("/signup", {
                      state: {
                        prefill: {
                          email: currentUser.email,
                          phone: currentUser.phone,
                          firstName: selectedAddress?.firstName,
                          lastName: selectedAddress?.lastName,
                        },
                      },
                    })
                  }
                  className="w-full py-3 bg-[#737144] text-white rounded-md uppercase tracking-[0.15em] font-light text-xs
                    hover:bg-[#5f5d3d] hover:shadow-md transition-all"
                >
                  Create an account with the same email/phone to track your order
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full mt-3 py-3 border border-[#737144]/40 text-[#737144] rounded-md uppercase tracking-[0.15em] font-light text-xs hover:bg-[#737144]/10 transition-all"
                >
                  Continue Shopping
                </button>
              </>
            )}
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
              {addressModalError && (
                <p className="text-sm text-[#9a6b5a]">{addressModalError}</p>
              )}
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
              <select
                {...register("country")}
                defaultValue={shippingCountry}
                className="luxInput"
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
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
                  , and a flat ₹1,500 shipping fee for all other countries.
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
      <NoticeModal notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContex";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import {
  CreditCard,
  Smartphone,
  Truck,
  Check,
  ShoppingBag,
  Shield,
  Lock,
  MapPin,
  Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";

export default function Payment() {
  const { items, totalPrice, clearCart, loading: cartLoading, error: cartError, clearError: clearCartError } = useCart();
  const { user, addAddress } = useAuth();
  const { createOrder, error: orderError, clearOrderError } = useOrder();

  // Define currentUser first
 const currentUser = {
    firstName: user?.firstName || "Guest",
    lastName: user?.lastName || "User",
    email: user?.email || "guest@example.com",
    phone: user?.phone || "",
    addresses: user?.addresses ?? [],
  };

  const [isPaid, setIsPaid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(currentUser.addresses.length === 0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    setShowAddAddressForm(currentUser.addresses.length === 0);
  }, [currentUser.addresses]);

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI Payment",
      description: "Pay instantly with UPI",
      icon: Smartphone,
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
    },
    {
      id: "gpay",
      name: "Google Pay",
      description: "Quick & secure payment",
      icon: CreditCard,
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive",
      icon: Truck,
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "from-orange-600 to-orange-700",
    },
  ];

  const onAddAddress = async (data) => {
    const addressData = {
      label: data.label,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.street,
      city: data.city,
      postalCode: data.zipCode,
      country: "India",
      state: data.state,
      addressLine2: data.addressLine2 || undefined,
      type: "Home",
      isDefault: currentUser.addresses.length === 0,
    };

    try {
      setFormErrors([]);
      const response = await addAddress(addressData);
      if (response.success) {
        setSelectedAddress({
          id: Date.now(),
          label: data.label,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          street: data.street,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          type: "Home",
          isDefault: currentUser.addresses.length === 0,
        });
        setShowAddressModal(false);
        setShowAddAddressForm(false);
        reset();
      } else {
        console.error('Add address error:', response.errors);
        if (response.errors && Array.isArray(response.errors)) {
          setFormErrors(response.errors.map(err => err.msg));
        } else {
          setFormErrors([response.message || "Failed to add address"]);
        }
      }
    } catch (error) {
      console.error('Add address exception:', error);
      setFormErrors([error.message || "Network error"]);
    }
  };

  const handlePayment = async () => {
    if (cartError || orderError) {
      alert(cartError || orderError);
      clearCartError();
      clearOrderError();
      return;
    }
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0]?.url || '',
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize
        })),
        shippingAddress: {
          address: selectedAddress.street,
          city: selectedAddress.city,
          postalCode: selectedAddress.zipCode,
          state: selectedAddress.state,
          country: "India"
        },
        paymentMethod: selectedPaymentMethod,
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.08,
        shippingPrice: totalPrice > 100 ? 0 : 10,
        totalPrice: totalPrice + (totalPrice * 0.08) + (totalPrice > 100 ? 0 : 10)
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        await clearCart();
        setIsPaid(true);
        setShowModal(true);
      } else {
        alert(response.error || "Failed to create order");
      }
    } catch (error) {
      alert("An error occurred while processing your order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loading Payment...
          </h1>
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Error Loading Payment
          </h1>
          <p className="text-red-600 mb-8">{cartError}</p>
          <button
            onClick={() => {
              clearCartError();
              window.location.href = "/";
            }}
            className="bg-green-800 text-white px-8 py-3 rounded-md font-medium hover:bg-green-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Choose your delivery address and payment method
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                Order Summary
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.selectedColor} /{" "}
                        {item.selectedSize} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.product.discountPrice ? (
                        <>
                          <span className="line-through text-sm text-gray-400 mr-1">
                            ₹{(item.product.price * item.quantity).toFixed(1)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            ₹
                            {(
                              item.product.discountPrice * item.quantity
                            ).toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          ₹{(item.product.price * item.quantity).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{totalPrice.toFixed(1)}
                    </span>
                  </div>
                </div>
                {selectedAddress && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center text-blue-800">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">
                        Delivery Address
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedAddress.label}: {selectedAddress.firstName} {selectedAddress.lastName}
                      <br />
                      {selectedAddress.street}
                      {selectedAddress.addressLine2 &&
                        `, ${selectedAddress.addressLine2}`}
                      <br />
                      {selectedAddress.city}, {selectedAddress.state}{" "}
                      {selectedAddress.zipCode}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center text-blue-800">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Your payment is protected with bank-level security
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-green-600" />
                Select Payment Method
              </h2>
              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPaymentMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => selectPaymentMethod(method.id)}
                      className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${method.gradient} mr-4`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {method.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {method.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing || cartLoading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  selectedPaymentMethod && !isProcessing && !cartLoading
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${totalPrice.toFixed(1)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-600" />
              Select Delivery Address
            </h2>

            {formErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 rounded-xl">
                <p className="text-red-600 text-sm">
                  {formErrors.map((error, index) => (
                    <span key={index} className="block">{error}</span>
                  ))}
                </p>
              </div>
            )}

            {currentUser.addresses && currentUser.addresses.length > 0 ? (
              <div className="space-y-4 mb-6">
                {currentUser.addresses.map((address, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedAddress({
                        street: address.address,
                        addressLine2: address.addressLine2,
                        city: address.city,
                        state: address.state,
                        zipCode: address.postalCode,
                        label: address.label,
                        firstName: address.firstName,
                        lastName: address.lastName,
                        phone: address.phone,
                        type: address.type,
                        isDefault: address.isDefault,
                        id: address.id
                      });
                      setShowAddressModal(false);
                      setShowAddAddressForm(false);
                    }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedAddress?.id === address.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h4 className="font-medium text-gray-800">{address.label}</h4>
                    <p className="text-gray-600 mt-1">{address.firstName} {address.lastName}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600">{address.address}</p>
                    {address.addressLine2 && (
                      <p className="text-gray-600">{address.addressLine2}</p>
                    )}
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    {address.isDefault && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Default
                      </span>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setShowAddAddressForm(true);
                    setFormErrors([]);
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center hover:bg-gray-200 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Address
                </button>
                {showAddAddressForm && (
                  <form
                    onSubmit={handleSubmit(onAddAddress)}
                    className="mt-4 space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Address Label
                      </label>
                      <input
                        type="text"
                        {...register("label", {
                          required: "Address label is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="e.g., Home, Office"
                      />
                      {errors.label && (
                        <span className="text-red-500 text-sm">
                          {errors.label.message}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <span className="text-red-500 text-sm">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <span className="text-red-500 text-sm">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Please enter a valid 10-digit phone number",
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <span className="text-red-500 text-sm">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        {...register("street", {
                          required: "Street address is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Enter street address"
                      />
                      {errors.street && (
                        <span className="text-red-500 text-sm">
                          {errors.street.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        {...register("addressLine2")}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          {...register("city", {
                            required: "City is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <span className="text-red-500 text-sm">
                            {errors.city.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          {...register("state", {
                            required: "State is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <span className="text-red-500 text-sm">
                            {errors.state.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        {...register("zipCode", {
                          required: "Zip code is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Enter zip code"
                      />
                      {errors.zipCode && (
                        <span className="text-red-500 text-sm">
                          {errors.zipCode.message}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddressForm(currentUser.addresses.length === 0);
                          setShowAddressModal(false);
                          setFormErrors([]);
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-green-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    No addresses saved
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Add your delivery address to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit(onAddAddress)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Address Label
                      </label>
                      <input
                        type="text"
                        {...register("label", {
                          required: "Address label is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="e.g., Home, Office"
                      />
                      {errors.label && (
                        <span className="text-red-500 text-sm">
                          {errors.label.message}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <span className="text-red-500 text-sm">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <span className="text-red-500 text-sm">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Please enter a valid 10-digit phone number",
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <span className="text-red-500 text-sm">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        {...register("street", {
                          required: "Street address is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Enter street address"
                      />
                      {errors.street && (
                        <span className="text-red-500 text-sm">
                          {errors.street.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        {...register("addressLine2")}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          {...register("city", {
                            required: "City is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <span className="text-red-500 text-sm">
                            {errors.city.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          {...register("state", {
                            required: "State is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <span className="text-red-500 text-sm">
                            {errors.state.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        {...register("zipCode", {
                          required: "Zip code is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        placeholder="Enter zip code"
                      />
                      {errors.zipCode && (
                        <span className="text-red-500 text-sm">
                          {errors.zipCode.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAddressForm(currentUser.addresses.length === 0);
                        setShowAddressModal(false);
                        setFormErrors([]);
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-8">
              Your order has been confirmed. Invoice has been sent to your email.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

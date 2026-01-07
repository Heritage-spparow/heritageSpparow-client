import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getById(orderId);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError("Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "Order Confirmed":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f6ef] flex items-center justify-center">
        <div className="text-gray-500">Loading order…</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f9f6ef] flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6ef] py-12">
      <div className="max-w-5xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-[#555] hover:text-[#737144]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </button>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[var(--color-bg)]">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-bg)] mb-4">
            Items in your order
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border border-gray-100 rounded-md p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-md object-cover border"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-[var(--color-bg)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="font-medium text-[var(--color-bg)]">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-[var(--color-bg)] mb-3">
              Shipping Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-[var(--color-bg)] mb-3">
              Payment Summary
            </h3>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹ {order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-[var(--color-bg)] pt-2 border-t">
                <span>Total</span>
                <span>₹ {order.totalPrice.toFixed(2)}</span>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Payment Method:{" "}
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;

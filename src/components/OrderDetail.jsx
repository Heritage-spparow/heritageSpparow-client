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
      confirmed: "bg-blue-100 text-blue-800",
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
      case "confirmed":
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
    <div className="max-w-5xl mx-auto px-4 space-y-8">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#777] hover:text-[#737144]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </button>

      {/* HEADER */}
      <div className="bg-white rounded-xl border border-[#e5e4da] p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#777]">
              Order
            </p>
            <h1 className="text-2xl font-medium text-[#737144]">
              #{order.orderNumber}
            </h1>
            <p className="text-sm text-[#777] mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#f4f3ed]">
            {getStatusIcon(order.status)}
            <span className="text-sm font-medium capitalize text-[#737144]">
              {order.status.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mt-8 flex items-center justify-between text-sm">
          {["confirmed", "shipped", "delivered"].map((step, idx) => {
            const active =
              ["confirmed", "shipped", "delivered"].indexOf(order.status) >= idx;

            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${active ? "bg-[#737144] text-white" : "bg-[#e5e4da] text-[#999]"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span
                  className={`mt-2 text-xs uppercase tracking-wide
                  ${active ? "text-[#737144]" : "text-[#999]"}`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-xl border border-[#e5e4da] p-8">
        <h2 className="text-lg font-medium text-[#737144] mb-6">
          Items in your order
        </h2>

        <div className="space-y-6">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex gap-5">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover border border-[#e5e4da]"
              />

              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#737144] uppercase tracking-wide">
                  {item.name}
                </h3>
                <p className="text-xs text-[#777] mt-1">
                  Qty {item.quantity}
                </p>
              </div>

              <div className="text-sm font-medium text-[#555]">
                ₹ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* ADDRESS */}
        <div className="bg-white rounded-xl border border-[#e5e4da] p-8">
          <h3 className="text-sm uppercase tracking-[0.2em] text-[#777] mb-4">
            Shipping Address
          </h3>
          <p className="text-sm text-[#555] leading-relaxed">
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}
            <br />
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-xl border border-[#e5e4da] p-8">
          <h3 className="text-sm uppercase tracking-[0.2em] text-[#777] mb-4">
            Payment Summary
          </h3>

          <div className="space-y-3 text-sm text-[#555]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {order.itemsPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹ {order.shippingPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#e5e4da] font-medium text-[#737144]">
              <span>Total</span>
              <span>₹ {order.totalPrice.toFixed(2)}</span>
            </div>

            <p className="text-xs text-[#777] pt-2">
              Paid via {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default OrderDetail;

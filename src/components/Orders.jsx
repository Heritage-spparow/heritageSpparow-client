import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  MessageSquare,
  Star,
} from "lucide-react";

/* ---------------- SKELETON ---------------- */
const SkeletonOrderCard = () => (
  <div className="border border-[#737144]/15 bg-[#f9f6ef] p-8 animate-pulse">
    <div className="flex justify-between mb-6">
      <div className="space-y-2">
        <div className="h-3 w-32 bg-[#737144]/20"></div>
        <div className="h-3 w-24 bg-[#737144]/10"></div>
      </div>
      <div className="h-6 w-24 bg-[#737144]/20"></div>
    </div>
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-16 h-16 bg-[#737144]/10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#737144]/20 w-3/4"></div>
            <div className="h-3 bg-[#737144]/10 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getMyOrders({ page: currentPage, limit: 5 });
      if (res.data.success) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      }
    } catch {
      setError("Unable to load your orders at the moment.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    await orderAPI.cancel(orderId);
    fetchOrders();
  };

  const statusStyle = (status) => {
    const base =
      "inline-flex items-center gap-2 px-4 py-1 text-xs uppercase tracking-[0.15em] border";
    const map = {
      confirmed: "border-[#c2b96b] text-[#737144]",
      shipped: "border-[#737144]/50 text-[#737144]",
      delivered: "border-[#737144] text-[#737144]",
      // cancelled: "border-red-400 text-red-500",
    };
    return `${base} ${map[status] || "border-[#737144]/30 text-[#737144]"}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f9f6ef] flex items-center justify-center">
        <p className="text-sm tracking-[0.25em] uppercase text-[#737144]">
          Please login to view orders
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6ef] py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-lg uppercase tracking-[0.3em] text-[#737144]">
            Order Archives
          </h1>
          <div className="w-24 h-[1px] bg-[#737144]/40 mt-4" />
        </div>

        {error && (
          <p className="mb-8 text-sm text-red-500">{error}</p>
        )}

        {loading ? (
          <div className="space-y-10">
            {[...Array(3)].map((_, i) => (
              <SkeletonOrderCard key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-[#737144]/15 p-16 text-center">
            <Package className="h-10 w-10 mx-auto text-[#737144]/50 mb-6" />
            <p className="text-sm tracking-wide text-[#737144]/70">
              You have not placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-[#737144]/20 bg-[#f9f6ef]"
              >
                {/* HEADER */}
                <div className="px-8 py-6 border-b border-[#737144]/15 grid md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="uppercase tracking-wide text-[#737144]/60 text-xs">
                      Order Placed
                    </p>
                    <p className="text-[#737144]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-[#737144]/60 text-xs">
                      Total
                    </p>
                    <p className="text-[#737144]">
                      ₹ {order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-[#737144]/60 text-xs">
                      Ship To
                    </p>
                    <span className="flex items-center gap-1 text-[#737144]">
                      {user?.fullName}
                      <ChevronDown size={14} />
                    </span>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="uppercase tracking-wide text-[#737144]/60 text-xs">
                      Order #
                    </p>
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="text-[#737144] underline underline-offset-4"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* BODY */}
                <div className="px-8 py-8 flex flex-col md:flex-row gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="uppercase tracking-[0.15em] text-sm text-[#737144]">
                        {order.status}
                      </h3>
                      <span className={statusStyle(order.status)}>
                        {order.status === "delivered" && (
                          <CheckCircle size={14} />
                        )}
                        {order.status === "shipped" && <Truck size={14} />}
                        {order.status === "confirmed" && <Package size={14} />}
                        {order.status}
                      </span>
                    </div>

                    {order.orderItems.map((item, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <div className="w-20 h-20 bg-[#efeada] flex-shrink-0" />
                        <div>
                          <p
                            onClick={() =>
                              navigate(`/feature/${item.product?._id}`)
                            }
                            className="text-sm text-[#737144] cursor-pointer hover:underline"
                          >
                            {item.name}
                          </p>
                          <p className="text-xs text-[#737144]/60 mt-1">
                            Quantity: {item.quantity}
                          </p>
                          <button
                            onClick={() =>
                              navigate(`/feature/${item.product?._id}`)
                            }
                            className="mt-3 text-xs uppercase tracking-[0.15em] border border-[#737144]/40 px-4 py-2 hover:bg-[#737144]/10 transition"
                          >
                            Buy Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="md:w-56 space-y-3">
                    <button className="w-full py-3 text-xs uppercase tracking-[0.15em] border border-[#737144]/40 hover:bg-[#737144]/10 transition flex justify-center gap-2">
                      <Truck size={14} /> Track Package
                    </button>

                    <button className="w-full py-3 text-xs uppercase tracking-[0.15em] border border-[#737144]/40 hover:bg-[#737144]/10 transition flex justify-center gap-2">
                      <MessageSquare size={14} /> Support
                    </button>

                    <button className="w-full py-3 text-xs uppercase tracking-[0.15em] border border-[#737144]/40 hover:bg-[#737144]/10 transition flex justify-center gap-2">
                      <Star size={14} /> Review
                    </button>
{/* 
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="w-full py-3 text-xs uppercase tracking-[0.15em] border border-red-400 text-red-500 hover:bg-red-50 transition flex justify-center gap-2"
                      >
                        <XCircle size={14} /> Cancel Order
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.pages > 1 && (
          <div className="mt-16 flex justify-center gap-3">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-4 py-2 text-xs tracking-[0.15em] border ${
                    currentPage === p
                      ? "border-[#737144] bg-[#737144]/10"
                      : "border-[#737144]/30 hover:bg-[#737144]/10"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

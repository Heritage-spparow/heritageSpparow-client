import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown, 
  MessageSquare,
  Star,
} from "lucide-react";
const SkeletonOrderCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden relative">
    <div className="skeleton-shimmer absolute inset-0"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);


const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getMyOrders({ page: currentPage, limit: 5 }); // Reduced limit for better view
      if (res.data.success) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      // You might want to add a confirmation modal here in a real app
      await orderAPI.cancel(orderId);
      fetchOrders(); // Refetch orders to show the updated status
    } catch (err) {
      setError("Failed to cancel order. Please try again.");
    }
  };
  
  // --- NO CHANGES TO STATUS STYLES & ICONS ---
  const getStatusStyle = (status) => {
    const base = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return `${base} ${styles[status] || "bg-gray-100 text-gray-700"}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <Package className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  // --- NO CHANGES TO ACCESS DENIED VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[var(--color-textbg)] mb-3">
            Access Denied
          </h2>
          <p className="text-[var(--color-text)]">
            Please log in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 relative">
      {/* --- NO CHANGES TO SHIMMER STYLES --- */}
      <style>{`
          .skeleton-shimmer::after { content: ''; position: absolute; inset: 0; background: linear-gradient( 110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100% ); animation: shimmer 1.5s infinite; transform: translateX(-100%); }
          @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- NO CHANGES TO HEADER --- */}
        <div className="mb-10 ">
          <h1 className="text-4xl font-bold text-[#f9f6ef] tracking-wide">Order Archives</h1>
        </div>

        {/* --- NO CHANGES TO ERROR & LOADING STATES --- */}
        {error && <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => <SkeletonOrderCard key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <Package className="h-14 w-14 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">Start shopping to see your orders here.</p>
          </div>
        ) : (
          // ==================================================================
          // START OF REDESIGNED ORDER LIST
          // ==================================================================
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Order Placed</p>
                    <p className="text-gray-800 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Total</p>
                    <p className="text-gray-800 font-medium">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Ship To</p>
                    <a href="#" className="text-green-700 hover:underline font-medium flex items-center">
                      {user?.name || 'Customer'} <ChevronDown className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500 uppercase">Order # {order.orderNumber}</p>
                    <div className="flex items-center gap-2 justify-start md:justify-end">
                      <a href="#" className="text-green-700 hover:underline font-medium">View order details</a>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side: Items List */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                           {order.status === 'delivered' ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : `${order.status}`}
                        </h3>
                        <span className={getStatusStyle(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-white border border-gray-200 rounded-md flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-medium text-green-800 hover:underline cursor-pointer">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Qty: {item.quantity}
                              </p>
                              <div className="mt-2">
                                <button className="px-4 py-1 text-sm bg-[var(--color-bg)] text-[var(--color-text)] rounded-md hover:bg-gray-200">
                                  Buy it again
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex-shrink-0 md:w-56 space-y-3">
                       <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2">
                         <Truck className="h-4 w-4" />
                         Track Package
                       </button>
                       <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2">
                         <MessageSquare className="h-4 w-4" />
                         Get product support
                       </button>
                       <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2">
                         <Star className="h-4 w-4" />
                         Write a product review
                       </button>
                       {order.status === "pending" && (
                         <button
                           onClick={() => cancelOrder(order._id)}
                           className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition duration-200 flex items-center justify-center gap-2"
                         >
                           <XCircle className="h-4 w-4" />
                           Cancel Order
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          // ==================================================================
          // END OF REDESIGNED ORDER LIST
          // ==================================================================
        )}

        {/* --- NO CHANGES TO PAGINATION --- */}
        {pagination.pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    currentPage === page
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, pagination.pages))
              }
              disabled={currentPage === pagination.pages}
              className="px-4 py-2 rounded-md border text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
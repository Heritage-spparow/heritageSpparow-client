import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { orderAPI } from "../services/api";

// Order Context
const OrderContext = createContext();

// Order Actions
const ORDER_ACTIONS = {
  CREATE_ORDER_START: "CREATE_ORDER_START",
  CREATE_ORDER_SUCCESS: "CREATE_ORDER_SUCCESS",
  CREATE_ORDER_FAILURE: "CREATE_ORDER_FAILURE",
  FETCH_ORDERS_START: "FETCH_ORDERS_START",
  FETCH_ORDERS_SUCCESS: "FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "FETCH_ORDERS_FAILURE",
  CLEAR_ORDER_ERROR: "CLEAR_ORDER_ERROR",
  SET_ORDER_LOADING: "SET_ORDER_LOADING",
};

// Order Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.CREATE_ORDER_START:
    case ORDER_ACTIONS.FETCH_ORDERS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ORDER_ACTIONS.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        orders: [...state.orders, action.payload.order],
      };

    case ORDER_ACTIONS.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        orders: action.payload.orders,
        pagination: action.payload.pagination,
      };

    case ORDER_ACTIONS.CREATE_ORDER_FAILURE:
    case ORDER_ACTIONS.FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ORDER_ACTIONS.CLEAR_ORDER_ERROR:
      return {
        ...state,
        error: null,
      };

    case ORDER_ACTIONS.SET_ORDER_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  orders: [],
  pagination: null,
  loading: false,
  error: null,
};

// Order Provider Component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Create order function
  const createOrder = async (orderData) => {
    try {
      dispatch({ type: ORDER_ACTIONS.CREATE_ORDER_START });

      const response = await orderAPI.create(orderData);

      if (response.data.success) {
        dispatch({
          type: ORDER_ACTIONS.CREATE_ORDER_SUCCESS,
          payload: { order: response.data.order },
        });

        return { success: true, order: response.data.order };
      }
    } catch (error) {
      // 🔥 Order may already be created
      if (error.response?.data?.order) {
        return {
          success: true,
          order: error.response.data.order,
          warning: "Order created but client error occurred",
        };
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create order";

      dispatch({
        type: ORDER_ACTIONS.CREATE_ORDER_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Fetch user orders
  const fetchOrders = async (params = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.FETCH_ORDERS_START });

      const response = await orderAPI.getMyOrders(params);

      if (response.data.success) {
        dispatch({
          type: ORDER_ACTIONS.FETCH_ORDERS_SUCCESS,
          payload: {
            orders: response.data.orders,
            pagination: response.data.pagination,
          },
        });

        return {
          success: true,
          orders: response.data.orders,
          pagination: response.data.pagination,
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch orders";
      dispatch({
        type: ORDER_ACTIONS.FETCH_ORDERS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };
  //cancel order function
  const cancleorder = async (orderId) => {
    try {
      dispatch({ type: ORDER_ACTIONS.FETCH_ORDERS_START });
      const response = await orderAPI.cancleOrder(orderId);
      if (response.data.success) {
        dispatch({
          type: ORDER_ACTIONS.FETCH_ORDERS_SUCCESS,
          payload: {
            orders: response.data.orders,
            pagination: response.data.pagination,
          },
        });

        return {
          success: true,
          orders: response.data.orders,
          pagination: response.data.pagination,
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch orders";
      dispatch({
        type: ORDER_ACTIONS.FETCH_ORDERS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearOrderError = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_ORDER_ERROR });
  }, []);

  const value = {
    ...state,
    createOrder,
    fetchOrders,
    clearOrderError,
    cancleorder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Custom Hook to use Order Context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

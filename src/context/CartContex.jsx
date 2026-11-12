import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

// --------------------
// Guest cart helpers
// --------------------
const GUEST_CART_KEY = "guest_cart";

// Guest items have no backend _id — give each a stable one (product + size)
// so quantity updates / keys target only that item
const withGuestId = (item) => ({
  ...item,
  _id: item._id || `guest-${item.product?._id}-${item.size}`,
});

const getGuestCart = () =>
  (JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []).map(withGuestId);

const setGuestCart = (items) =>
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));

// --------------------
// Cart Context
// --------------------
const CartContext = createContext();

// --------------------
// Actions
// --------------------
const CART_ACTIONS = {
  ADD_TO_CART_START: "ADD_TO_CART_START",
  ADD_TO_CART_SUCCESS: "ADD_TO_CART_SUCCESS",
  ADD_TO_CART_FAILURE: "ADD_TO_CART_FAILURE",

  REMOVE_FROM_CART_START: "REMOVE_FROM_CART_START",
  REMOVE_FROM_CART_SUCCESS: "REMOVE_FROM_CART_SUCCESS",
  REMOVE_FROM_CART_FAILURE: "REMOVE_FROM_CART_FAILURE",

  UPDATE_QUANTITY_START: "UPDATE_QUANTITY_START",
  UPDATE_QUANTITY_SUCCESS: "UPDATE_QUANTITY_SUCCESS",
  UPDATE_QUANTITY_FAILURE: "UPDATE_QUANTITY_FAILURE",

  CLEAR_CART_START: "CLEAR_CART_START",
  CLEAR_CART_SUCCESS: "CLEAR_CART_SUCCESS",
  CLEAR_CART_FAILURE: "CLEAR_CART_FAILURE",

  FETCH_CART_START: "FETCH_CART_START",
  FETCH_CART_SUCCESS: "FETCH_CART_SUCCESS",
  FETCH_CART_FAILURE: "FETCH_CART_FAILURE",

  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
};

// --------------------
// Reducer
// --------------------
const cartReducer = (state, action) => {
  switch (action.type) {
    // Full-page loading only for the initial cart fetch
    case CART_ACTIONS.FETCH_CART_START:
      return { ...state, loading: true, error: null };

    // Add / remove / qty / clear → background "updating", page stays visible
    case CART_ACTIONS.ADD_TO_CART_START:
    case CART_ACTIONS.REMOVE_FROM_CART_START:
    case CART_ACTIONS.UPDATE_QUANTITY_START:
    case CART_ACTIONS.CLEAR_CART_START:
      return { ...state, updating: true };

    case CART_ACTIONS.FETCH_CART_SUCCESS:
    case CART_ACTIONS.ADD_TO_CART_SUCCESS:
    case CART_ACTIONS.REMOVE_FROM_CART_SUCCESS:
    case CART_ACTIONS.UPDATE_QUANTITY_SUCCESS:
      return {
        ...state,
        loading: false,
        updating: false,
        error: null,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice,
      };

    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        updating: false,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case CART_ACTIONS.FETCH_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Mutation errors are shown inline by the caller (returned value),
    // so they don't replace the whole cart page
    case CART_ACTIONS.ADD_TO_CART_FAILURE:
    case CART_ACTIONS.REMOVE_FROM_CART_FAILURE:
    case CART_ACTIONS.UPDATE_QUANTITY_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return { ...state, updating: false };

    case CART_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

// --------------------
// Initial State
// --------------------
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: true, // until the first cart load finishes (avoids "bag is empty" flash)
  updating: false,
  error: null,
};

// --------------------
// Provider
// --------------------
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, loading: authLoading, cartMerged } = useAuth();

  // --------------------
  // Fetch backend cart
  // --------------------
  const fetchCart = useCallback(async () => {
    try {
      dispatch({ type: CART_ACTIONS.FETCH_CART_START });
      const response = await cartAPI.get();

      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.FETCH_CART_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.FETCH_CART_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch cart",
      });
    }
  }, []);

  // --------------------
  // Add to cart (Guest + Auth)
  // --------------------
  const addToCart = useCallback(async (product, selectedSize, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART_START });

    const token = localStorage.getItem("token");

    // 🟡 GUEST USER
    if (!token) {
      const guestItems = getGuestCart();

      const existing = guestItems.find(
        (i) => i.product._id === product._id && i.size === selectedSize
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        guestItems.push(
          withGuestId({
            product,
            size: selectedSize,
            quantity,
          })
        );
      }

      setGuestCart(guestItems);

      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
        payload: {
          items: guestItems,
          totalItems: guestItems.reduce((a, c) => a + c.quantity, 0),
          totalPrice: guestItems.reduce(
            (a, c) =>
              a + (c.product.discountPrice || c.product.price) * c.quantity,
            0
          ),
        },
      });

      return { success: true };
    }

    // 🔐 LOGGED IN USER
    try {
      const response = await cartAPI.add({
        productId: product._id,
        size: selectedSize,
        quantity,
      });

      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice,
          },
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart";
      dispatch({ type: CART_ACTIONS.ADD_TO_CART_FAILURE, payload: message });
      return { success: false, message };
    }
  }, []);

  // --------------------
  // Remove from cart
  // --------------------
  const removeFromCart = async (productId, size) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_START });

    const token = localStorage.getItem("token");

    // Guest
    if (!token) {
      const updated = getGuestCart().filter(
        (i) => !(i.product._id === productId && i.size === size)
      );

      setGuestCart(updated);

      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
        payload: {
          items: updated,
          totalItems: updated.reduce((a, c) => a + c.quantity, 0),
          totalPrice: updated.reduce(
            (a, c) =>
              a + (c.product.discountPrice || c.product.price) * c.quantity,
            0
          ),
        },
      });

      return { success: true };
    }

    // Backend
    try {
      const response = await cartAPI.remove({ productId, size });

      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice,
          },
        });
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove item";
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_FAILURE, payload: message });
      return { success: false, error: message };
    }
  };

  // --------------------
  // Update quantity
  // --------------------
  const updateQuantity = useCallback(async (cartId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_START });

    const token = localStorage.getItem("token");

    if (!token) {
      const guestItems = getGuestCart().map((item) =>
        item._id === cartId ? { ...item, quantity } : item
      );

      setGuestCart(guestItems);

      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
        payload: {
          items: guestItems,
          totalItems: guestItems.reduce((a, c) => a + c.quantity, 0),
          totalPrice: guestItems.reduce(
            (a, c) =>
              a + (c.product.discountPrice || c.product.price) * c.quantity,
            0
          ),
        },
      });

      return { success: true };
    }

    try {
      const response = await cartAPI.update(cartId, { quantity });

      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice,
          },
        });
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update quantity";
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_FAILURE, payload: message });
      return { success: false, error: message };
    }
  }, []);

  // --------------------
  // Clear cart (Guest + Auth)
  // --------------------
  const clearCart = useCallback(async () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART_START });

    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem(GUEST_CART_KEY);
      dispatch({ type: CART_ACTIONS.CLEAR_CART_SUCCESS });
      return { success: true };
    }

    try {
      const response = await cartAPI.clear();
      if (response.data.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART_SUCCESS });
        return { success: true };
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: error.response?.data?.message || "Failed to clear cart",
      });
    }
  }, []);

  // --------------------
  // Load cart on mount
  // --------------------
// CartContext.jsx
// CartContext.jsx useEffect
useEffect(() => {
  if (authLoading) return; // Wait for auth check to finish

  if (isAuthenticated) {
    if (cartMerged) {
      fetchCart(); // Fetch from DB
    }
  } else {
    // 🟢 GUEST MODE: This will now run because cartMerged is true
    const guestItems = getGuestCart();
    dispatch({
      type: CART_ACTIONS.FETCH_CART_SUCCESS,
      payload: {
        items: guestItems,
        totalItems: guestItems.reduce((a, c) => a + c.quantity, 0),
        totalPrice: guestItems.reduce((a, c) => a + (c.product.price * c.quantity), 0),
      },
    });
  }
}, [isAuthenticated, authLoading, cartMerged]); // Removed fetchCart to avoid potential loops
  // --------------------
  // Context value
  // --------------------
  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearError: () => dispatch({ type: CART_ACTIONS.CLEAR_ERROR }),
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --------------------
// Hook
// --------------------
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

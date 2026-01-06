import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { authAPI, cartAPI } from "../services/api";
import { useState } from "react";
/* =====================
   CONSTANTS (ADDED)
===================== */
const GUEST_CART_KEY = "guest_cart"; // ✅
const CART_MERGED_KEY = "cart_merged";

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  UPDATE_USER: "UPDATE_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        loading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
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
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: !!localStorage.getItem("token"),
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [cartMerged, setCartMerged] = useState(localStorage.getItem(CART_MERGED_KEY) === "true");

  const mergeGuestCartToUser = async () => {
    const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
    const alreadyMerged = localStorage.getItem(CART_MERGED_KEY) === "true";

    if (guestCart.length > 0 && !alreadyMerged) {
      try {
        // 1. Immediately clear local storage to prevent duplicate triggers
        localStorage.removeItem(GUEST_CART_KEY);
        
        // 2. Loop and add items to backend
        for (const item of guestCart) {
          await cartAPI.add({
            productId: item.product._id,
            size: item.size,
            quantity: item.quantity,
          });
        }
      } catch (err) {
        console.error("Guest cart merge failed:", err);
      }
    }
    
    // 3. Always set these to true to "unlock" the CartContext
    localStorage.setItem(CART_MERGED_KEY, "true");
    setCartMerged(true);
  };

  const getCurrentUser = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.getMe();

      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.data.user, token: localStorage.getItem("token") },
        });
        
        // On refresh, if we have a token, check if we need to merge
        await mergeGuestCartToUser();
      }
    } catch (error) {
      console.error("Auth initialization failed", error);
      setCartMerged(true); // Unlock for guest mode even on error
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };
  // Initialize auth on app load (SAFE, runs once)
  // AuthContext.jsx
 useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser();
    } else {
      setCartMerged(true); // No user? Unlock immediately for guest cart
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);// Empty array so it only runs once on refresh

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const response = await authAPI.login(credentials);

      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // Reset merge flag for the new user session
        localStorage.removeItem(CART_MERGED_KEY);

        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
        
        // Trigger merge after successful login
        await mergeGuestCartToUser();
        
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authAPI.register(userData);

      if (response.data.success) {
        const { user, token } = response.data;

        // Store token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: { user, token },
        });

        return { success: true, user };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function with useCallback
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart_merged"); // 👈 Reset this
    setCartMerged(false);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    window.location.href = "/login";
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);

      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });

        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);

      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password change failed";
      return { success: false, error: errorMessage };
    }
  };

  // Address management functions
  const addAddress = async (addressData) => {
    try {
      const response = await authAPI.addAddress(addressData);

      if (response.data.success) {
        // Update user with new addresses
        const updatedUser = {
          ...state.user,
          addresses: response.data.addresses,
        };
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });

        return { success: true, addresses: response.data.addresses };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add address";
      return { success: false, error: errorMessage };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await authAPI.updateAddress(addressId, addressData);

      if (response.data.success) {
        const updatedUser = {
          ...state.user,
          addresses: response.data.addresses,
        };
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });

        return { success: true, addresses: response.data.addresses };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update address";
      return { success: false, error: errorMessage };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await authAPI.deleteAddress(addressId);

      if (response.data.success) {
        const updatedUser = {
          ...state.user,
          addresses: response.data.addresses,
        };
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });

        return { success: true, addresses: response.data.addresses };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete address";
      return { success: false, error: errorMessage };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await authAPI.setDefaultAddress(addressId);

      if (response.data.success) {
        const updatedUser = {
          ...state.user,
          addresses: response.data.addresses,
        };
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });

        return { success: true, addresses: response.data.addresses };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to set default address";
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function with useCallback
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    cartMerged,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

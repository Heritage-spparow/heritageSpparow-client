import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { cartAPI } from '../services/api';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_TO_CART_START: 'ADD_TO_CART_START',
  ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
  ADD_TO_CART_FAILURE: 'ADD_TO_CART_FAILURE',
  REMOVE_FROM_CART_START: 'REMOVE_FROM_CART_START',
  REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
  REMOVE_FROM_CART_FAILURE: 'REMOVE_FROM_CART_FAILURE',
  UPDATE_QUANTITY_START: 'UPDATE_QUANTITY_START',
  UPDATE_QUANTITY_SUCCESS: 'UPDATE_QUANTITY_SUCCESS',
  UPDATE_QUANTITY_FAILURE: 'UPDATE_QUANTITY_FAILURE',
  CLEAR_CART_START: 'CLEAR_CART_START',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
  FETCH_CART_START: 'FETCH_CART_START',
  FETCH_CART_SUCCESS: 'FETCH_CART_SUCCESS',
  FETCH_CART_FAILURE: 'FETCH_CART_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.FETCH_CART_START:
    case CART_ACTIONS.ADD_TO_CART_START:
    case CART_ACTIONS.REMOVE_FROM_CART_START:
    case CART_ACTIONS.UPDATE_QUANTITY_START:
    case CART_ACTIONS.CLEAR_CART_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CART_ACTIONS.FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice
      };

    case CART_ACTIONS.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice
      };

    case CART_ACTIONS.REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice
      };

    case CART_ACTIONS.UPDATE_QUANTITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice
      };

    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

    case CART_ACTIONS.FETCH_CART_FAILURE:
    case CART_ACTIONS.ADD_TO_CART_FAILURE:
    case CART_ACTIONS.REMOVE_FROM_CART_FAILURE:
    case CART_ACTIONS.UPDATE_QUANTITY_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart on app load
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
            totalPrice: response.data.cart.totalPrice
          }
        });
        return { success: true, cart: response.data.cart };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch cart';
      dispatch({
        type: CART_ACTIONS.FETCH_CART_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Add to cart
  const addToCart = useCallback(async (product, selectedColor, selectedSize, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.ADD_TO_CART_START });
      
      const cartItem = {
        productId: product._id,
        cartId: `${product._id}-${selectedColor}-${selectedSize}-${Date.now()}`,
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        quantity,
        image: product.images?.[0]?.url || '/default-image.jpg'
      };

      const response = await cartAPI.add(cartItem);
      
      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice
          }
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Remove from cart
  const removeFromCart = useCallback(async (cartId) => {
    try {
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_START });
      const response = await cartAPI.remove(cartId);
      
      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice
          }
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove from cart';
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update quantity
  const updateQuantity = useCallback(async (cartId, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_START });
      
      if (quantity <= 0) {
        return await removeFromCart(cartId);
      }
      
      const response = await cartAPI.update(cartId, { quantity });
      
      if (response.data.success) {
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
          payload: {
            items: response.data.cart.items,
            totalItems: response.data.cart.totalItems,
            totalPrice: response.data.cart.totalPrice
          }
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update quantity';
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART_START });
      const response = await cartAPI.clear();
      
      if (response.data.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART_SUCCESS });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  }, []);

  // Load cart on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, [fetchCart]);

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearError,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
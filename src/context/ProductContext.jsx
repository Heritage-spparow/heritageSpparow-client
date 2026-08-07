import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { productAPI ,collectionAPI } from "../services/api";

// Product Context
const ProductContext = createContext();

// Product Actions
const PRODUCT_ACTIONS = {
  FETCH_PRODUCTS_START: "FETCH_PRODUCTS_START",
  FETCH_PRODUCTS_SUCCESS: "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_FAILURE: "FETCH_PRODUCTS_FAILURE",
  FETCH_PRODUCT_START: "FETCH_PRODUCT_START",
  FETCH_PRODUCT_SUCCESS: "FETCH_PRODUCT_SUCCESS",
  FETCH_PRODUCT_FAILURE: "FETCH_PRODUCT_FAILURE",
  FETCH_CATEGORIES_START: "FETCH_CATEGORIES_START",
  FETCH_CATEGORIES_SUCCESS: "FETCH_CATEGORIES_SUCCESS",
  FETCH_CATEGORIES_FAILURE: "FETCH_CATEGORIES_FAILURE",
  FETCH_COLLECTIONS_START: "FETCH_COLLECTIONS_START",
  FETCH_COLLECTIONS_SUCCESS: "FETCH_COLLECTIONS_SUCCESS",
  FETCH_COLLECTIONS_FAILURE: "FETCH_COLLECTIONS_FAILURE",
  FETCH_FEATURED_START: "FETCH_FEATURED_START",
  FETCH_FEATURED_SUCCESS: "FETCH_FEATURED_SUCCESS",
  FETCH_FEATURED_FAILURE: "FETCH_FEATURED_FAILURE",
  SEARCH_PRODUCTS_START: "SEARCH_PRODUCTS_START",
  SEARCH_PRODUCTS_SUCCESS: "SEARCH_PRODUCTS_SUCCESS",
  SEARCH_PRODUCTS_FAILURE: "SEARCH_PRODUCTS_FAILURE",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
};

// Product Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_START:
    case PRODUCT_ACTIONS.FETCH_PRODUCT_START:
    case PRODUCT_ACTIONS.FETCH_CATEGORIES_START:
    case PRODUCT_ACTIONS.FETCH_COLLECTIONS_START:
    case PRODUCT_ACTIONS.FETCH_FEATURED_START:
    case PRODUCT_ACTIONS.SEARCH_PRODUCTS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        products: action.payload,
      };

    case PRODUCT_ACTIONS.FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        currentProduct: action.payload,
      };

    case PRODUCT_ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        categories: action.payload,
      };
    case PRODUCT_ACTIONS.FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        collections: action.payload,
      };
    case PRODUCT_ACTIONS.FETCH_FEATURED_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        featuredProducts: action.payload,
      };

    case PRODUCT_ACTIONS.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        searchResults: action.payload,
      };

    case PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE:
    case PRODUCT_ACTIONS.FETCH_PRODUCT_FAILURE:
    case PRODUCT_ACTIONS.FETCH_CATEGORIES_FAILURE:
    case PRODUCT_ACTIONS.FETCH_COLLECTIONS_FAILURE:
    case PRODUCT_ACTIONS.FETCH_FEATURED_FAILURE:
    case PRODUCT_ACTIONS.SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case PRODUCT_ACTIONS.SET_LOADING:
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
  products: [],
  collections: [],
  currentProduct: null,
  categories: [],
  featuredProducts: [],
  searchResults: [],
  loading: false,
  error: null,
};

// Product Provider Component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch all products
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_START });
      const response = await productAPI.getAll(params);
  
      if (response.data.success) {
        dispatch({
          type: PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS,
          payload: response.data.products,
        });
        return { success: true, products: response.data.products };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch products";
      dispatch({
        type: PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Fetch single product
  const fetchProductById = useCallback(async (id) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCT_START });
      const response = await productAPI.getById(id);

      if (response.data.success) {
        dispatch({
          type: PRODUCT_ACTIONS.FETCH_PRODUCT_SUCCESS,
          payload: response.data.product,
        });
        return { success: true, product: response.data.product };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch product";
      dispatch({
        type: PRODUCT_ACTIONS.FETCH_PRODUCT_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    // ⛔ DO NOT refetch if already loaded
    if (state.categories.length > 0) {
      return { success: true, categories: state.categories };
    }

    try {
      dispatch({ type: PRODUCT_ACTIONS.FETCH_CATEGORIES_START });
      const response = await productAPI.getCategories();

      if (response.data.success) {
        dispatch({
          type: PRODUCT_ACTIONS.FETCH_CATEGORIES_SUCCESS,
          payload: response.data.categories,
        });

        return { success: true, categories: response.data.categories };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch categories";

      dispatch({
        type: PRODUCT_ACTIONS.FETCH_CATEGORIES_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  }, [state.categories]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.FETCH_FEATURED_START });
      const response = await productAPI.getFeatured();

      if (response.data.success) {
        dispatch({
          type: PRODUCT_ACTIONS.FETCH_FEATURED_SUCCESS,
          payload: response.data.products,
        });
        return { success: true, products: response.data.products };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch featured products";
      dispatch({
        type: PRODUCT_ACTIONS.FETCH_FEATURED_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (query) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SEARCH_PRODUCTS_START });
      const response = await productAPI.search(query);

      if (response.data.success) {
        dispatch({
          type: PRODUCT_ACTIONS.SEARCH_PRODUCTS_SUCCESS,
          payload: response.data.products,
        });
        return { success: true, products: response.data.products };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to search products";
      dispatch({
        type: PRODUCT_ACTIONS.SEARCH_PRODUCTS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    // Don't refetch if already loaded
    if (state.collections.length > 0 || state.loading) {
      return {
        success: true,
        collections: state.collections,
      };
    }

    try {
      dispatch({
        type: PRODUCT_ACTIONS.FETCH_COLLECTIONS_START,
      });

      const response = await collectionAPI.getAll();
      
      if (response.data.success) {
        dispatch({
          type: PRODUCT_ACTIONS.FETCH_COLLECTIONS_SUCCESS,
          payload: response.data.collections,
        });

        return {
          success: true,
          collections: response.data.collections,
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch collections";

      dispatch({
        type: PRODUCT_ACTIONS.FETCH_COLLECTIONS_FAILURE,
        payload: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [state.collections]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchCollections,
    fetchFeaturedProducts,
    searchProducts,
    clearError,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

// Custom Hook to use Product Context
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

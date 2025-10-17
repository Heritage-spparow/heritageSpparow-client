import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";

import App from "./App.jsx";
import { CartProvider } from "./context/CartContex.jsx";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";

import ErrorBoundary from "./shared/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);

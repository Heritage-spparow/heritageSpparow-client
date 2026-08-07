import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { productAPI } from "../services/api";
import FeatureProduct from "./FeatureProduct";
import ProductWindow from "./ProductWindow";
import {
  buildCategoryPath,
  buildProductPath,
  getProductSlug,
  matchesCategorySlug,
  slugify, 
} from "../utils/productUrl";

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F4F3ED]">
    <div className="loader"></div>
  </div>
);

export function CategoryRouteResolver() {
  const { categorySlug, collectionSlug, itemSlug } = useParams();
  const location = useLocation();


  const [isLoading, setIsLoading] = useState(true);
  const [resolvedProduct, setResolvedProduct] = useState(null);
  const [resolvedSubcategorySlug, setResolvedSubcategorySlug] = useState("");

  // 🔥 MAIN RESOLVER
useEffect(() => {
  let active = true;

  const resolveRoute = async () => {
    setResolvedProduct(null);
    setResolvedSubcategorySlug("");
    setIsLoading(true);

    // Category page only
    if (!itemSlug) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await productAPI.getBySlug(
        categorySlug,
        collectionSlug,
        itemSlug
      );

      if (!active) return;

      if (res.data.success) {
        setResolvedProduct(res.data.product);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (active) {
        setIsLoading(false);
      }
    }
  };

  resolveRoute();

  return () => {
    active = false;
  };
}, [categorySlug, collectionSlug, itemSlug]);

  // ✅ CANONICAL PATH
  const canonicalProductPath = useMemo(() => {
    if (!resolvedProduct) return null;
    return buildProductPath(resolvedProduct);
  }, [resolvedProduct]);

  // ✅ LOADING
  if (isLoading) {
    return <LoadingState />;
  }

  // ✅ PRODUCT VIEW
  if (resolvedProduct) {
    const currentSlug = slugify(itemSlug);
    const productSlug = slugify(getProductSlug(resolvedProduct));

    // 🔥 Prevent wrong product flash
    if (currentSlug !== productSlug) {
      return <LoadingState />;
    }

    // 🔥 Safe canonical redirect
    if (
      canonicalProductPath &&
      location.pathname.toLowerCase() !== canonicalProductPath.toLowerCase()
    ) {
      return <Navigate replace to={canonicalProductPath} />;
    }

    return <FeatureProduct resolvedProduct={resolvedProduct} />;
  }

  // ✅ SUBCATEGORY VIEW
  if (resolvedSubcategorySlug) {
    return (
      <ProductWindow
        categorySlug={categorySlug}
        subcategorySlug={resolvedSubcategorySlug}
      />
    );
  }

  // ✅ FALLBACK → CATEGORY
  if (itemSlug) {
    return <Navigate replace to={buildCategoryPath(categorySlug)} />;
  }

  return <ProductWindow categorySlug={categorySlug} />;
}

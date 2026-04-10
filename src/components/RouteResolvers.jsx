import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
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
  const { categorySlug, itemSlug } = useParams();
  const location = useLocation();
  const { fetchProducts } = useProduct();

  const [isLoading, setIsLoading] = useState(true);
  const [resolvedProduct, setResolvedProduct] = useState(null);
  const [resolvedSubcategorySlug, setResolvedSubcategorySlug] = useState("");

  // 🔥 MAIN RESOLVER
  useEffect(() => {
    let active = true;

    const resolveRoute = async () => {
      // ✅ RESET STATE (prevents stale product bug)
      setResolvedProduct(null);
      setResolvedSubcategorySlug("");
      setIsLoading(true);

      const response = await fetchProducts({ inStock: true });
      if (!active) return;

      const sourceProducts = response?.products || [];

      const categoryProducts = sourceProducts.filter((product) =>
        matchesCategorySlug(product, categorySlug),
      );

      // 👉 If no itemSlug → category page
      if (!itemSlug) {
        setIsLoading(false);
        return;
      }

      const normalizedItemSlug = slugify(itemSlug);

      // ✅ PRODUCT MATCH
      const productMatch = categoryProducts.find(
        (product) => slugify(getProductSlug(product)) === normalizedItemSlug,
      );

      if (productMatch) {
        setResolvedProduct(productMatch);
        setIsLoading(false);
        return;
      }

      // ✅ SUBCATEGORY MATCH
      const subcategoryMatch = categoryProducts.some((product) => {
        const productSubcategory = slugify(
          product?.subCategory ||
            product?.subcategory ||
            product?.subCategoryName ||
            product?.subcategoryName ||
            "",
        );
        return productSubcategory === normalizedItemSlug;
      });

      if (subcategoryMatch) {
        setResolvedSubcategorySlug(normalizedItemSlug);
        setIsLoading(false);
        return;
      }

      // ❌ NOTHING FOUND → fallback to category
      setIsLoading(false);
    };

    resolveRoute();

    return () => {
      active = false;
    };
  }, [categorySlug, itemSlug, location.pathname, fetchProducts]);

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

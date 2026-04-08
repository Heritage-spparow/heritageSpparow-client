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
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F3ED]">
    <div className="loader"></div>
    <p className="mt-4 text-[#737144] uppercase tracking-[0.25em] text-sm font-light"></p>
  </div>
);

export function LegacyCategoryRedirect() {
  const { name } = useParams();
  return <Navigate replace to={buildCategoryPath(name)} />;
}

export function LegacyProductRedirect() {
  const { id } = useParams();
  const { fetchProductById } = useProduct();
  const [targetPath, setTargetPath] = useState(null);

  useEffect(() => {
    let active = true;

    const resolve = async () => {
      const response = await fetchProductById(id);
      if (!active) return;

      if (response?.success && response?.product) {
        setTargetPath(buildProductPath(response.product));
        return;
      }

      setTargetPath("/search");
    };

    resolve();

    return () => {
      active = false;
    };
  }, [fetchProductById, id]);

  if (!targetPath) {
    return <LoadingState />;
  }

  return <Navigate replace to={targetPath} />;
}

export function CategoryRouteResolver() {
  const { categorySlug, itemSlug } = useParams();
  const location = useLocation();
  const { fetchProducts } = useProduct();
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedProduct, setResolvedProduct] = useState(null);
  const [resolvedSubcategorySlug, setResolvedSubcategorySlug] = useState("");

  useEffect(() => {
    let active = true;

    const resolveRoute = async () => {
      setIsLoading(true);

      const response = await fetchProducts({ inStock: true });
      if (!active) return;
      const sourceProducts = response?.products || [];

      if (!active) return;

      const categoryProducts = sourceProducts.filter((product) =>
        matchesCategorySlug(product, categorySlug)
      );

      if (!itemSlug) {
        setResolvedProduct(null);
        setResolvedSubcategorySlug("");
        setIsLoading(false);
        return;
      }

      const normalizedItemSlug = slugify(itemSlug);

      const productMatch = categoryProducts.find(
        (product) => getProductSlug(product) === normalizedItemSlug
      );

      if (productMatch) {
        setResolvedProduct(productMatch);
        setResolvedSubcategorySlug("");
        setIsLoading(false);
        return;
      }

      const subcategoryMatch = categoryProducts.some((product) => {
        const productSubcategory = slugify(
          product?.subCategory ||
            product?.subcategory ||
            product?.subCategoryName ||
            product?.subcategoryName ||
            ""
        );
        return productSubcategory === normalizedItemSlug;
      });

      if (subcategoryMatch) {
        setResolvedProduct(null);
        setResolvedSubcategorySlug(normalizedItemSlug);
        setIsLoading(false);
        return;
      }

      setResolvedProduct(null);
      setResolvedSubcategorySlug("");
      setIsLoading(false);
    };

    resolveRoute();

    return () => {
      active = false;
    };
  }, [categorySlug, fetchProducts, itemSlug]);

  const canonicalProductPath = useMemo(() => {
    if (!resolvedProduct) return null;
    return buildProductPath(resolvedProduct);
  }, [resolvedProduct]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (resolvedProduct) {
    if (canonicalProductPath && canonicalProductPath !== location.pathname) {
      return <Navigate replace to={canonicalProductPath} />;
    }

    return <FeatureProduct resolvedProduct={resolvedProduct} />;
  }

  if (resolvedSubcategorySlug) {
    return (
      <ProductWindow
        categorySlug={categorySlug}
        subcategorySlug={resolvedSubcategorySlug}
      />
    );
  }

  if (itemSlug) {
    return <Navigate replace to={buildCategoryPath(categorySlug)} />;
  }

  return <ProductWindow categorySlug={categorySlug} />;
}

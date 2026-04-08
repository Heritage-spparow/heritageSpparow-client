const CATEGORY_SUFFIX = "jutti";

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyProductName(name = "") {
  return slugify(name);
}

export function slugifyCategoryName(name = "") {
  const base = slugify(name);
  if (!base) return "";

  if (base.endsWith(`-${CATEGORY_SUFFIX}`) || base === CATEGORY_SUFFIX) {
    return base;
  }

  return `${base}-${CATEGORY_SUFFIX}`;
}

export function humanizeSlug(slug = "") {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function humanizeCategorySlug(slug = "") {
  const normalized = slugify(slug);
  if (!normalized) return "";

  if (normalized.endsWith(`-${CATEGORY_SUFFIX}`)) {
    const base = normalized.slice(0, -(CATEGORY_SUFFIX.length + 1));
    return `${humanizeSlug(base)} Jutti`.trim();
  }

  return humanizeSlug(normalized);
}

export function getProductId(product) {
  return product?._id || product?.id || "";
}

export function getProductName(product) {
  return product?.name || product?.title || product?.label || "";
}

export function getProductCategoryName(product) {
  return (
    product?.category ||
    product?.categoryName ||
    product?.mainCategory ||
    product?.collection ||
    ""
  );
}

export function getProductSubcategoryName(product) {
  return (
    product?.subCategory ||
    product?.subcategory ||
    product?.subCategoryName ||
    product?.subcategoryName ||
    ""
  );
}

export function getProductSlug(product) {
  return slugifyProductName(getProductName(product));
}

export function getCategorySlug(category) {
  if (!category) return "";

  if (typeof category === "object") {
    return slugifyCategoryName(getProductCategoryName(category));
  }

  return slugifyCategoryName(category);
}

export function getSubcategorySlug(product) {
  return slugify(getProductSubcategoryName(product));
}

export function buildCategoryPath(category) {
  const slug = getCategorySlug(category);
  if (!slug) return "/search";
  return `/${slug}`;
}

export function buildSubcategoryPath(category, subcategory) {
  const categorySlug = getCategorySlug(category);
  const subcategorySlug = slugify(subcategory);

  if (!categorySlug || !subcategorySlug) {
    return buildCategoryPath(category);
  }

  return `/${categorySlug}/${subcategorySlug}`;
}

export function buildProductPath(product) {
  const categorySlug = getCategorySlug(product);
  const productSlug = getProductSlug(product);

  if (!productSlug) return "/search";

  if (categorySlug) {
    return `/${categorySlug}/${productSlug}`;
  }

  const id = getProductId(product);
  if (id) {
    return `/products/${productSlug}/${id}`;
  }

  return "/search";
}

export function matchesCategorySlug(product, categorySlug) {
  return getCategorySlug(product) === slugify(categorySlug);
}

export function matchesSubcategorySlug(product, subcategorySlug) {
  const normalized = slugify(subcategorySlug);
  if (!normalized) return false;

  return (
    getSubcategorySlug(product) === normalized ||
    getProductSlug(product) === normalized
  );
}

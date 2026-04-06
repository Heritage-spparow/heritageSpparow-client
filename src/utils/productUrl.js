export function slugifyProductName(name = "") {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getProductId(product) {
  return product?._id || product?.id || "";
}

export function buildProductPath(product) {
  const id = getProductId(product);
  if (!id) return "/search";
  const slug = slugifyProductName(product?.name || "product");
  return `/products/${slug}/${id}`;
}

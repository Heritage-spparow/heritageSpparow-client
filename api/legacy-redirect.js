/* eslint-env node */

import {
  buildCategoryPath,
  buildProductPath,
} from "../src/utils/productUrl.js";

const API_BASE_URL = (
  globalThis.process?.env?.VITE_API_BASE_URL ||
  globalThis.process?.env?.API_BASE_URL ||
  "http://localhost:3000/api"
).replace(/\/$/, "");

function redirect(res, location, status = 301) {
  res.writeHead(status, { Location: location });
  res.end();
}

async function fetchProductById(id) {
  const response = await fetch(
    `${API_BASE_URL}/products-enhanced/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.product || data?.data?.product || null;
}

export default async function handler(req, res) {
  const { type, name, id } = req.query || {};

  if (type === "category" && name) {
    return redirect(res, buildCategoryPath(decodeURIComponent(name)));
  }

  if (type === "product" && id) {
    try {
      const product = await fetchProductById(id);
      if (product) {
        return redirect(res, buildProductPath(product));
      }
    } catch (error) {
      console.error("Legacy redirect failed:", error);
    }
  }

  return redirect(res, "/search", 302);
}

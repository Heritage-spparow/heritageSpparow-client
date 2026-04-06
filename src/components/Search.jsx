import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { buildProductPath } from "../utils/productUrl";
import { cloudinaryOptimize } from "../utils/loudinary";
import SEO from "./SEO";

/* ---------------- THEME ---------------- */
const BRAND_COLOR = "#737144";
const BG_COLOR = "#f9f6ef";
const DIN_STYLE = {
  fontFamily:
    "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  fontWeight: 400,
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { searchProducts } = useProduct();

  const shouldLift = focused || query.length > 0;

  /* ---------------- SEARCH LOGIC ---------------- */
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await searchProducts(query);

        if (response.success) {
          const filtered = response.products
            .filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase())
            )
            .sort((a, b) => {
              const aStart = a.name.toLowerCase().startsWith(query.toLowerCase());
              const bStart = b.name.toLowerCase().startsWith(query.toLowerCase());
              if (aStart && !bStart) return -1;
              if (!aStart && bStart) return 1;
              return a.name.localeCompare(b.name);
            });

          setSearchResults(filtered);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [query, searchProducts]);

  /* ---------------- NAVIGATION ---------------- */
  return (
    <div
      style={{ ...DIN_STYLE, backgroundColor: BG_COLOR }}
      className="min-h-screen flex items-center justify-center px-4 transition-all duration-500"
    >
      <SEO
        title="Search Products | HERITAGE SPARROW"
        description="Search handcrafted Heritage Sparrow products and buy directly."
        canonicalPath="/search"
      />
      <div
        className={classNames(
          "w-full max-w-6xl transition-all duration-500",
          {
            "-translate-y-24": shouldLift,
            "translate-y-0": !shouldLift,
          }
        )}
      >
        {/* ---------------- SEARCH FIELD ---------------- */}
        <div className="relative mb-10">
          <input
            type="text"
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full
              bg-transparent
              border-b border-[#737144]
              px-1 py-3
              text-lg
              text-[#555]
              focus:outline-none
            "
          />

          {/* Floating Label */}
          <label
            className={classNames(
              "absolute left-1 text-xs uppercase tracking-[0.35em] text-[#737144] transition-all duration-200",
              {
                "-top-4 text-[10px]": shouldLift,
                "top-3": !shouldLift,
              }
            )}
          >
            Search
          </label>

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-0 top-3 text-xs tracking-widest text-[#737144] hover:opacity-70"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* ---------------- RESULTS ---------------- */}
        {query && (
          <div className="space-y-6">
            {loading ? (
              <p className="text-xs text-[#777]">Searching…</p>
            ) : (
              <>
                <h2 className="text-sm tracking-[0.3em] uppercase text-[#777]">
                  {searchResults.length} Results in Products
                </h2>

                {searchResults.length > 0 ? (
                  <div
                    className="
                      flex gap-6 overflow-x-auto pb-6
                      scrollbar-thin
                      scrollbar-thumb-[#737144]/40
                      scrollbar-track-transparent
                    "
                  >
                    {searchResults.map((item) => (
                      <Link
                        key={item._id}
                        to={buildProductPath(item)}
                        aria-label={`Buy ${item.name}`}
                        className="
                          block
                          w-[160px] sm:w-[180px] md:w-[200px]
                          flex-shrink-0
                          cursor-pointer
                          group
                        "
                      >
                        {/* IMAGE */}
                        <div className="aspect-[3/4] bg-[#f4f3ed] mb-4 overflow-hidden">
                          <img
                            src={cloudinaryOptimize(
                              item.coverImage?.url ||
                                item.galleryImages?.[0]?.url ||
                                "/placeholder.jpg",
                              "card"
                            )}
                            alt={item.name}
                            className="
                              w-full h-full object-cover
                              transition-transform duration-500
                              group-hover:scale-[1.05]
                            "
                          />
                        </div>

                        {/* NAME */}
                        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[#737144] font-light">
                          {item.name}
                        </p>
                        <p className="mt-1 text-center text-[11px] text-[#737144]/80">
                          INR {Number(item.price || 0).toLocaleString()}
                        </p>
                        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#737144] border border-[#737144]/40 py-1">
                          Buy Now
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#777]">No products found.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

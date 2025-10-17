import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { searchProducts } = useProduct();

  const shouldLift = focused || query.length > 0;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await searchProducts(query);

        if (response.success) {
          const filtered = response.products
            .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => {
              const startsWithA = a.name.toLowerCase().startsWith(query.toLowerCase());
              const startsWithB = b.name.toLowerCase().startsWith(query.toLowerCase());
              if (startsWithA && !startsWithB) return -1;
              if (!startsWithA && startsWithB) return 1;
              return a.name.localeCompare(b.name);
            });
          setSearchResults(filtered);
          console.log("Search results:", filtered);
        } else {
          console.error("Failed to fetch search results:", response.error);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid excessive API calls
    const debounceTimeout = setTimeout(fetchSearchResults, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, searchProducts]);

  const handleProductClick = (product) => {
    navigate(`/product/${encodeURIComponent(product.category)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-[var-(--color-bg)]  px-4 transition-all duration-500">
      <div
        className={classNames(
          'w-full max-w-2xl transform transition-all duration-500',
          {
            'translate-y-[-100px]': shouldLift,
            'translate-y-0': !shouldLift,
          }
        )}
      >
        {/* Search Field */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b border-[#a68038] focus:outline-none focus:border-[#a68038] text-lg px-1 py-2 placeholder-transparent"
            placeholder="Search"
          />

          {/* Animated Label */}
          <label
            className={classNames(
              'absolute left-1 text-sm text-[var-(--color-bg)] transition-all duration-200',
              {
                'top-[-20px] text-xs text-[var-(--color-bg)]': shouldLift,
                'top-2': !shouldLift,
              }
            )}
          >
            SEARCH
          </label>

          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-1 top-2 text-sm text-[var-(--color-bg)] hover:text-[var-(--color-bg)] cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>

        {query && (
          <div className="mt-4 space-y-2 flex gap-2 text-black bg-white overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-gray-500 text-sm px-1">Loading...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm px-1">No results found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
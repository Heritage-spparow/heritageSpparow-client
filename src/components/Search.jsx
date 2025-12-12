import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import img from '../assets/demo3.jpg';



const BRAND_COLOR = "#737144";
const BG_COLOR = "#f9f6ef";
const LIGHT_ACCENT = "#F4F3ED";
const DIN_STYLE = {
    fontFamily:
      "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 400,
};

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
    // Navigating to the product feature page using the product ID.
    navigate(`/feature/${product._id}`);
  };

  return (
    <div 
      style={{ ...DIN_STYLE, backgroundColor: BG_COLOR }} 
      className="flex items-center justify-center min-h-screen text-gray-800 px-4 transition-all duration-500"
    >
      <div
        className={classNames(
          'w-[80%] transform transition-all duration-500',
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
            // Updated border and text colors to brand style
            className="w-full border-b border-[#737144] focus:outline-none focus:border-[#737144] text-lg px-1 py-2 placeholder-transparent bg-transparent text-gray-800"
            placeholder="Search"
          />

          {/* Animated Label */}
          <label
            className={classNames(
              'absolute left-1 text-sm text-[#737144] transition-all duration-200 uppercase tracking-wider font-light',
              {
                'top-[-20px] text-xs': shouldLift,
                'top-2': !shouldLift,
              }
            )}
          >
            SEARCH
          </label>

          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-1 top-2 text-sm text-[#737144] hover:text-[#5f5d3d] cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {query && (
          <div className="mt-8 space-y-4 text-black overflow-y-auto max-h-[80vh]">
            {loading ? (
              <div className="text-gray-500 text-sm px-1">Loading...</div>
            ) : (
              <>
            
                <h2 className="text-base sm:text-lg font-normal tracking-wider text-gray-800">
                  {searchResults.length} RESULTS IN PRODUCTS
                </h2>
                
                {searchResults.length > 0 ? (
        
                  <div className="flex overflow-x-auto space-x-6 pt-4 pb-4 
                                  scrollbar-thin scrollbar-thumb-[#a68038]/50 scrollbar-track-transparent">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleProductClick(item)}
                        className=" flex flex-col items-center justify-center cursor-pointer group"
                      >
                        <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                         
                          <img
                            src={img}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                        {/* Product Name */}
                        <div className="text-center text-sm text-gray-800 tracking-wide font-medium">
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm px-1 pt-4">No results found.</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
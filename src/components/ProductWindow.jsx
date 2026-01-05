import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import img from "../assets/pro.jpg";
import img2 from "../assets/pro1.jpg";
import banner from "../assets/DSC_5888.jpg";
import { motion } from "framer-motion";
import { useProduct } from "../context/ProductContext";

export default function ProductWindow() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchProducts } = useProduct();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterInputs, setFilterInputs] = useState({
    price: { min: "", max: "" },
    color: "",
    size: "",
    stock: "all",
    type: "",
    sortBy: "featured",
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    sortBy: true,
    color: false,
    size: false,
    textile: false,
    price: false,
  });
  const [availableFilters, setAvailableFilters] = useState({
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 0 },
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const decodedName = decodeURIComponent(name);
        const response = await fetchProducts({
          category: decodedName,
          inStock: true,
        });
        console.log(response);

        if (response.success) {
          const products = response.products;
          setMatchingProducts(products);
          console.log(products);
          setFilteredProducts(products);

          const colors = [
            ...new Set(
              products
                .flatMap((product) =>
                  Array.isArray(product.colors) ? product.colors : []
                )
                .filter((c) => typeof c === "string" && c.trim() !== "")
                .map((c) => c.toLowerCase())
            ),
          ];

          const sizes = [
            ...new Set(
              products
                .flatMap((product) =>
                  Array.isArray(product.sizes) ? product.sizes : []
                )
                .filter((s) => typeof s === "string" && s.trim() !== "")
                .map((s) => s.toLowerCase())
            ),
          ];

          const prices = products
            .map((p) => (typeof p.price === "number" ? p.price : null))
            .filter((p) => p !== null);
          const priceRange = {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 0,
          };

          setAvailableFilters({ colors, sizes, priceRange });
        } else {
          setMatchingProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error(err);
        setMatchingProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name, fetchProducts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "priceMin" || name === "priceMax") {
      setFilterInputs((prev) => ({
        ...prev,
        price: { ...prev.price, [name === "priceMin" ? "min" : "max"]: value },
      }));
    } else {
      setFilterInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const decodedName = decodeURIComponent(name);
      const queryParams = {
        category: decodedName,
        inStock: filterInputs.stock === "inStock" ? true : undefined,
      };

      if (filterInputs.price.min !== "")
        queryParams.minPrice = parseFloat(filterInputs.price.min);
      if (filterInputs.price.max !== "")
        queryParams.maxPrice = parseFloat(filterInputs.price.max);
      if (filterInputs.color) queryParams.search = filterInputs.color;
      if (filterInputs.size) queryParams.search = filterInputs.size;
      if (filterInputs.type) queryParams.search = filterInputs.type;

      if (filterInputs.sortBy !== "featured") {
        queryParams.sortBy =
          filterInputs.sortBy === "price-low-high"
            ? "price-asc"
            : filterInputs.sortBy === "price-high-low"
            ? "price-desc"
            : filterInputs.sortBy;
      }

      const response = await fetchProducts(queryParams);
      if (response.success) {
        setFilteredProducts(response.products);
        setActiveFilters({
          priceMin: filterInputs.price.min !== "",
          priceMax: filterInputs.price.max !== "",
          color: !!filterInputs.color,
          size: !!filterInputs.size,
          type: !!filterInputs.type,
        });
      } else {
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error(err);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
      setIsFilterOpen(false);
    }
  };

  const clearFilters = () => {
    setFilterInputs({
      price: { min: "", max: "" },
      color: "",
      size: "",
      stock: "all",
      type: "",
      sortBy: "featured",
    });
    setActiveFilters({});
    setFilteredProducts(matchingProducts);
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const activeFilterCount = Object.keys(activeFilters).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F3ED]">
        <div className="loader"></div>
        <p className="mt-4 text-[#737144] uppercase tracking-[0.25em] text-sm font-light"></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6ef] text-[#737144]">
      {/* collection banner*/}
      <div className="relative w-full h-[60vh] sm:h-[50vh] md:h-[70vh] lg:h-[100vh]">
        <img
          src={banner}
          alt={decodeURIComponent(name)}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute  inset-0 flex flex-col items-center justify-center  bg-opacity-40">
          <h1 className="text-3xl sm:text-5xl  max-[767px]:mt-[36%]
    max-[472px]:mt-[36%] md:mt-[40%] mt-[77%] font-light text-white uppercase tracking-[0.2em]">
            {decodeURIComponent(name)}
          </h1>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-[#f9f6ef] border-b border-gray-200 flex items-center justify-between px-6 py-4">
        <h2 className="text-sm sm:text-base font-light text-[#737144] uppercase tracking-wide">
          {filteredProducts.length} Products
        </h2>
        <button
          onClick={toggleFilter}
          className="flex items-center space-x-2 text-[#737144] hover:text-black font-medium transition-all"
        >
          <span>Sort & Filter</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#737144] text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-lg text-[#737144]">No products found.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/feature/${product._id}`)}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
               <div className="relative overflow-hidden mb-3 bg-gray-50 bg-transparent aspect-square">
  {/* Default Image */}
  <img
    src={product.coverImage?.url}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-contain
               transition-opacity duration-800 ease-in-out
               opacity-100 group-hover:opacity-0 scale-110"
  />

  {/* Hover Image */}
  <img
    src={product.galleryImages?.[0]?.url || product.coverImage?.url}
    alt={`${product.name} hover`}
    className="absolute inset-0 w-full h-full object-contain
               transition-opacity duration-800 ease-in-out
               opacity-0 group-hover:opacity-100
               scale-110"
  />
</div>

                <div>
                  <h3 className="text-sm font-medium text-[#737144] uppercase tracking-wide mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#737144] mb-1">
                    INR {product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#737144] uppercase tracking-wide">
                    Ready to Ship
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Filter Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[36%] bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100 transform transition-transform duration-300 ease-in-out ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-lg font-light uppercase tracking-widest text-[#737144]">
              Sort & Filter
            </h2>
            <button
              onClick={toggleFilter}
              className="text-gray-500 hover:text-black transition"
            >
              ✕
            </button>
          </div>

          {/* Section Helper */}
          {[
            { key: "sortBy", title: "Sort By" },
            { key: "price", title: "Price" },
            { key: "color", title: "Color" },
            { key: "size", title: "Size" },
            { key: "textile", title: "Textile" },
          ].map((section) => (
            <div
              key={section.key}
              className="border-b border-gray-100 pb-6 mb-6"
            >
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="text-sm font-medium uppercase tracking-wide text-[#737144]">
                  {section.title}
                </h3>
                <span className="text-xl text-gray-500 font-light">
                  {expandedSections[section.key] ? "−" : "+"}
                </span>
              </button>

              {/* Individual Section Content */}
              {section.key === "sortBy" && expandedSections.sortBy && (
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Featured", value: "featured" },
                    { label: "Price, Low to High", value: "price-low-high" },
                    { label: "Price, High to Low", value: "price-high-low" },
                    { label: "Highest Rated", value: "rating" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="block text-sm cursor-pointer text-gray-700 hover:text-[#737144]"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={opt.value}
                        checked={filterInputs.sortBy === opt.value}
                        onChange={handleFilterChange}
                        className="mr-2"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}

              {section.key === "price" && expandedSections.price && (
                <div className="mt-4 flex space-x-3">
                  <input
                    type="number"
                    name="priceMin"
                    value={filterInputs.price.min}
                    onChange={handleFilterChange}
                    placeholder={`Min ₹${availableFilters.priceRange.min}`}
                    className="w-1/2 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#737144]"
                  />
                  <input
                    type="number"
                    name="priceMax"
                    value={filterInputs.price.max}
                    onChange={handleFilterChange}
                    placeholder={`Max ₹${availableFilters.priceRange.max}`}
                    className="w-1/2 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#737144]"
                  />
                </div>
              )}

              {section.key === "color" && expandedSections.color && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {availableFilters.colors.map((color) => (
                    <label
                      key={color}
                      className="text-sm cursor-pointer hover:text-[#737144]"
                    >
                      <input
                        type="checkbox"
                        name="color"
                        value={color}
                        checked={filterInputs.color === color}
                        onChange={(e) =>
                          setFilterInputs((prev) => ({
                            ...prev,
                            color: e.target.checked ? color : "",
                          }))
                        }
                        className="mr-2"
                      />
                      {color}
                    </label>
                  ))}
                </div>
              )}

              {section.key === "size" && expandedSections.size && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {availableFilters.sizes.map((size) => (
                    <label
                      key={size}
                      className="text-sm cursor-pointer hover:text-[#737144]"
                    >
                      <input
                        type="checkbox"
                        name="size"
                        value={size}
                        checked={filterInputs.size === size}
                        onChange={(e) =>
                          setFilterInputs((prev) => ({
                            ...prev,
                            size: e.target.checked ? size : "",
                          }))
                        }
                        className="mr-2"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              )}

              {section.key === "textile" && expandedSections.textile && (
                <div className="mt-4 space-y-2">
                  {["COTTON", "SILK", "LINEN", "WOOL", "SYNTHETIC"].map(
                    (textile) => (
                      <label
                        key={textile}
                        className="block text-sm cursor-pointer hover:text-[#737144]"
                      >
                        <input
                          type="checkbox"
                          name="type"
                          value={textile.toLowerCase()}
                          checked={filterInputs.type === textile.toLowerCase()}
                          onChange={(e) =>
                            setFilterInputs((prev) => ({
                              ...prev,
                              type: e.target.checked
                                ? textile.toLowerCase()
                                : "",
                            }))
                          }
                          className="mr-2"
                        />
                        {textile}
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="mt-10 space-y-3">
            <button
              onClick={clearFilters}
              className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 uppercase tracking-wide text-sm transition"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="w-full py-3 bg-[#737144] text-white hover:bg-[#5e5d39] uppercase tracking-wide text-sm transition"
            >
              Apply {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

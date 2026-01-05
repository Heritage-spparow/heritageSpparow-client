import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import sample from "../assets/sample.jpeg";
import creative1 from "../assets/LandingPage/01-Basant.jpg";
import creative2 from "../assets/LandingPage/01-Milap.jpg";
import creative3 from "../assets/LandingPage/01-RoopDiRani.jpg";
import creative4 from "../assets/LandingPage/01-Shagan.jpg";
import creative5 from "../assets/LandingPage/DSC_5793.jpg";

export default function FashionLanding() {
  const { fetchCategories } = useProduct();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories(true);
        if (result.success) {
          setCategories(result.categories || []);
        } else {
          console.error("Failed to load categories:", result.error);
        }
      } catch (err) {
        console.error("Unexpected error in loadCategories:", err);
      }
    };
    loadCategories();
  }, [fetchCategories]);

const collectionsData = [
  {
    id: 1,
    type: "static",
    image: sample,
    cta: {
      label: "Explore Collection",
      action: () =>
        navigate(`/product/${encodeURIComponent(categories[0] || "")}`),
      position: "center",
    },
  },

  {
    id: 2,
    type: "carousel",
    images: [
      { src: creative1, category: "Basant" },
      { src: creative2, category: "Milaap" },
      { src: creative3, category: "Roop Di Rani" },
      { src: creative4, category: "Shagun" },
    ],
    cta: {
      label: "Shop Now",
      // action: () =>
      //   navigate(
      //     `/feature/${encodeURIComponent(
      //       collectionsData[1].images[currentSlide].category
      //     )}`
      //   ),
      action: () =>
        navigate(`/product/${encodeURIComponent(categories[0] || "")}`),
      position: "left",
    },
  },

  {
    id: 3,
    type: "static",
    image: creative5,
    cta: {
      label: "Explore Campaign",
      action: () => navigate("/campaign"),
      position: "center",
    },
  },
];

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    const carousel = collectionsData.find((i) => i.type === "carousel");
    if (!carousel) return;

    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % carousel.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black">
      {collectionsData.map((item) => (
        <section
          key={item.id}
          className="relative w-full overflow-hidden bg-[#0e0e0e]"
          style={{ aspectRatio: "1 / 1" }}
        >
          {/* IMAGE */}
          <div className="absolute inset-0">
            {item.type === "static" && (
              <img
                src={item.image}
                alt="campaign"
                className="w-full h-full object-contain"
              />
            )}

            {item.type === "carousel" && (
              <div
                className="flex h-full transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {item.images.map((imgObj, i) => (
                  <img
                    key={i}
                    src={imgObj.src}
                    alt={imgObj.category}
                    className="w-full h-full flex-shrink-0 object-contain"
                  />
                ))}
              </div>
            )}

            <div className="absolute inset-0 bg-black/15" />
          </div>

          {/* CTA OVERLAY */}
          <div
            className={`relative z-10 w-full h-full flex items-center
              ${
                item.cta.position === "left"
                  ? "justify-start px-8 md:px-24"
                  : "justify-center"
              }`}
          >
            <button
              onClick={item.cta.action}
              className="
                border border-white/80
                px-10 py-4
                text-xs md:text-sm
                tracking-[0.35em]
                uppercase
                font-light
                text-white
                backdrop-blur-sm
                hover:bg-white
                hover:text-black
                transition-all duration-300
              "
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {item.cta.label}
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

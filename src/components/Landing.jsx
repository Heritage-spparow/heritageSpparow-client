import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

// Import your images
import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

export default function FashionLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const collectionsData = [
    {
      id: 1,
      title: "BALSAM",
      description:
        "Ethereal flowing designs that dance with light and movement, creating poetry in fabric.",
      image: sample1,
      layout: "content-left",
    },
    {
      id: 2,
      title: "KURTAS",
      description:
        "Contemporary elegance meets traditional craft in timeless silhouettes that honor heritage.",
      image: sample2,
      layout: "content-right",
    },
    {
      id: 3,
      title: "SAREES",
      description:
        "Timeless drapes that tell stories of tradition woven with threads of modernity and grace.",
      image: sample3,
      layout: "content-left",
    },
  ];

  const handleShopNow = (collection) => {
    console.log(`Shopping for ${collection}`);
  };

  return (
    <div className="w-full text-[var(--color-surface)]">
      {collectionsData.map((collection) => (
        <section
          key={collection.id}
          className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <img
            src={collection.image}
            alt={collection.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content */}
          <div
            className={`relative z-10 text-white px-6 sm:px-12 md:px-24 ${
              collection.layout === "content-right"
                ? "text-right ml-auto"
                : "text-left mr-auto"
            } max-w-3xl`}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-wide mb-6">
              {collection.title}
            </h1>
            <p className="text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-lg">
              {collection.description}
            </p>

            <button
              onClick={() => handleShopNow(collection.title)}
              className="group inline-flex items-center space-x-3 backdrop-blur-md bg-white/20 border border-white/30 text-white px-8 py-4 text-sm tracking-widest font-medium shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 transform hover:scale-105 hover:bg-white/30 hover:border-white/50"
            >
              <span className="drop-shadow-lg">SHOP NOW</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

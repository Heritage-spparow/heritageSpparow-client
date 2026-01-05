import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import sample from "../assets/sample.jpeg";
import sample3 from "../assets/sample3.jpg";

import creative1 from "../assets/LandingPage/01-Basant.jpg";
import creative2 from "../assets/LandingPage/01-Milap.jpg";
import creative3 from "../assets/LandingPage/01-RoopDiRani.jpg";
import creative4 from "../assets/LandingPage/01-Shagan.jpg";
import creative5 from "../assets/LandingPage/DSC_5793.jpg";

export default function FashionLanding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const collectionsData = [
    {
      id: 1,
      title: "",
      description:
        "",
      image: sample,
      align: "left",
      type: "static",
    },
    {
      id: 2,
      images: [creative1, creative2, creative3, creative4],
      align: "right",
      type: "carousel",
    },
    {
      id: 3,
      // title: "SAREES",
      // description:
      //   "Timeless drapes that tell stories of tradition woven with modern grace.",
      image: creative5,
      align: "left",
      type: "static",
    },
  ];

  /* ---------------- CAROUSEL AUTO SLIDE ---------------- */
  useEffect(() => {
    const carouselSection = collectionsData.find(
      (item) => item.type === "carousel"
    );

    if (!carouselSection) return;

    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % carouselSection.images.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white">
      {collectionsData.map((item) => (
        <section
          key={item.id}
          className="relative w-full overflow-hidden bg-[#0e0e0e]"
          style={{ aspectRatio: "1 / 1" }} // 👈 CAMPAIGN STYLE
        >
          {/* ================= IMAGE AREA ================= */}
          <div className="absolute inset-0">
            {/* STATIC IMAGE */}
            {item.type === "static" && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            )}

            {/* CAROUSEL */}
            {item.type === "carousel" && (
              <div
                className="flex h-full transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {item.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`slide-${index}`}
                    className="w-full h-full flex-shrink-0 object-contain brightness-90"
                  />
                ))}
              </div>
            )}

            {/* SUBTLE OVERLAY */}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* ================= TEXT AREA ================= */}
          <div
            className={`relative z-10 w-full h-full px-6 sm:px-12 md:px-24 flex items-center ${
              item.align === "right"
                ? "justify-end text-right"
                : "justify-start text-left"
            }`}
          >
            <div className="max-w-xl text-white">
              {item.title && (
                <h1
                  className="font-light tracking-wide mb-6"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4rem)",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {item.title}
                </h1>
              )}

              {item.description && (
                <p className="text-base sm:text-lg font-light leading-relaxed mb-8 opacity-95">
                  {item.description}
                </p>
              )}

              {item.title && (
                <button
                  onClick={() => navigate("/collection")}
                  className="border border-white/80 px-8 py-3 text-xs tracking-widest font-light transition-all duration-300 hover:bg-white hover:text-black"
                >
                  EXPLORE
                </button>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

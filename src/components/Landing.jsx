import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import sample from "../assets/sample.jpeg";
import creative1 from "../assets/LandingPage/01-Basant.jpg";
import creative2 from "../assets/LandingPage/01-Milap.jpg";
import creative3 from "../assets/LandingPage/01-RoopDiRani.jpg";
import creative4 from "../assets/LandingPage/01-Shagan.jpg";
import creative5 from "../assets/LandingPage/DSC_5793.jpg";
import heritageSpparow from "../assets/heitageSparrow.png"

export default function FashionLanding() {
  const { fetchCategories, categories } = useProduct();
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [currentSlide, setCurrentSlide] = useState(1); // 👈 start from 1
  const [enableTransition, setEnableTransition] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  /* ---------------- TOUCH HANDLERS ---------------- */
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const swipeThreshold = 50;

    setEnableTransition(true);

    if (distance > swipeThreshold) {
      // swipe left → next
      setCurrentSlide((prev) => prev + 1);
    } else if (distance < -swipeThreshold) {
      // swipe right → previous
      setCurrentSlide((prev) => prev - 1);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  /* ---------------- DATA ---------------- */
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
        { src: creative1, category: "Basant", id: "695b423c8442a5230d2898c4" },
        { src: creative2, category: "Milaap", id: "695bc02ec26b080cff59fc0e" },
        {
          src: creative3,
          category: "Roop Di Rani",
          id: "695b4c99277be9ec74c67e38",
        },
        { src: creative4, category: "Shagun", id: "695b5d6d2fb216f0b1c8396f" },
      ],
      cta: {
        label: "Shop Now",
        action: () => {
          const item = collectionsData[1].images[currentSlide - 1];
          if (item?.id) navigate(`/feature/${item.id}`);
        },
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

  /* ---------------- CAROUSEL LOGIC ---------------- */
  const originalImages = collectionsData[1].images;

  const carouselImages = [
    originalImages[originalImages.length - 1], // clone last
    ...originalImages,
    originalImages[0], // clone first
  ];

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setEnableTransition(true);
      setCurrentSlide((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- LOOP RESET ---------------- */
  useEffect(() => {
    const total = originalImages.length;

    // fake last → real first
    if (currentSlide === total + 1) {
      setTimeout(() => {
        setEnableTransition(false);
        setCurrentSlide(1);
      }, 1000);
    }

    // fake first → real last
    if (currentSlide === 0) {
      setTimeout(() => {
        setEnableTransition(false);
        setCurrentSlide(total);
      }, 1000);
    }
  }, [currentSlide, originalImages.length]);

  /* ---------------- RENDER ---------------- */
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
                className="flex h-full"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: enableTransition
                    ? "transform 1s ease-in-out"
                    : "none",
                }}
              >
                {carouselImages.map((imgObj, i) => (
                  <img
                    key={i}
                    src={imgObj.src}
                    alt={imgObj.category}
                    className="w-full h-full flex-shrink-0 object-contain"
                  />
                ))}
              </div>
            )}
            {/* 
            <div className="absolute inset-0 bg-black/15" /> */}
          </div>

          {/* CTA OVERLAY */}
          <div
            className={`relative z-10 w-full h-full flex items-center ${
              item.cta.position === "left"
                ? "justify-start px-8 md:px-24"
                : "justify-center"
            }`}
          >
            <button
              onClick={item.cta.action}
              className="
                campaign-cta
                border border-white/80
                px-10 py-4
                text-xs md:text-sm
                tracking-[0.10em]
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
      <section className="relative bg-[#f9f6ef] px-6 md:px-20 lg:px-32 py-15">
        <div className="max-w-4xl mx-auto text-center">

          <div className="w-24 h-[1px] bg-[#737144]/40 mx-auto mb-10" />

          <h2
            className="text-3xl md:text-4xl text-[#737144] tracking-[0.18em] uppercase font-light mb-8"
            // style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
        Crafted for You, Celebrated with You
          </h2>

          <p className="text-sm md:text-base text-[#737144]/80 leading-relaxed font-light">
            Every jutti tells a story  of celebration, tradition, and
            individuality.
            <br className="hidden md:block" />
            We offer{" "}
            <span className="text-[#737144]">tailored craftsmanship</span>,
            thoughtfully crafted to reflect your ceremony or festive palette
          </p>
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#737144] mt-14 font-light">
            <a href="mailto:support@heritagesparrow.com" className="font-bold"> Custom orders shaped by ceremonial traditions · Connect with us to begin</a>
          </p>

          {/* Decorative Divider */}
          <div className="w-24 h-[1px] bg-[#737144]/40 mx-auto mt-10" />
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { landingAPI } from "../services/api";
import { cloudinaryOptimize } from "../utils/loudinary";

export default function FashionLanding() {
  const { fetchCategories, loading } = useProduct();
  const navigate = useNavigate();

  const [landing, setLanding] = useState(null);

  // ✅ PER SECTION IMAGE LOAD STATE
  const [loaded, setLoaded] = useState({});

  const [currentSlide, setCurrentSlide] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  /* ---------------- TOUCH ---------------- */
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

    if (distance > swipeThreshold) setCurrentSlide((p) => p + 1);
    if (distance < -swipeThreshold) setCurrentSlide((p) => p - 1);

    setTouchStartX(null);
    setTouchEndX(null);
  };

  /* ---------------- FETCH LANDING ---------------- */
  useEffect(() => {
    landingAPI.get().then((res) => {
      setLanding(res.data.landing || null);
    });
  }, []);

  /* ---------------- SAFE FALLBACKS ---------------- */
  const sectionOne = landing?.sectionOne;
  const sectionTwo = landing?.sectionTwo;
  const sectionThree = landing?.sectionThree;

  /* ---------------- DATA (UNCHANGED STRUCTURE) ---------------- */
  const collectionsData = [
    {
      id: 1,
      type: "static",
      image: sectionOne?.image?.url,
      cta: {
        label: sectionOne?.ctaLabel || "Explore Collection",
        action: () =>
          navigate(
            `/product/${encodeURIComponent(sectionOne?.category || "")}`
          ),
        position: "center",
      },
    },
    {
      id: 2,
      type: "carousel",
      images:
        sectionTwo?.items?.map((i) => ({
          src: i.image?.url,
          category: i.label,
          id: typeof i.productId === "object" ? i.productId._id : i.productId,
        })) || [],
      cta: {
        label: sectionTwo?.ctaLabel || "Shop Now",
        action: () => {
          const item = sectionTwo?.items?.[currentSlide - 1];

          const productId =
            typeof item?.productId === "object"
              ? item.productId._id
              : item?.productId;

          if (productId) navigate(`/feature/${productId}`);
        },
        position: "left",
      },
    },
    {
      id: 3,
      type: "static",
      image: sectionThree?.image?.url,
      cta: {
        label: sectionThree?.ctaLabel || "Explore Campaign",
        action: () => navigate(sectionThree?.link || "/campaign"),
        position: "center",
      },
    },
  ];

  /* ---------------- CAROUSEL LOGIC (UNCHANGED) ---------------- */
  const originalImages = collectionsData[1].images;

  const carouselImages =
    originalImages.length > 0
      ? [
          originalImages[originalImages.length - 1],
          ...originalImages,
          originalImages[0],
        ]
      : [];

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    if (!originalImages.length) return;

    const interval = setInterval(() => {
      setEnableTransition(true);
      setCurrentSlide((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [originalImages.length]);

  /* ---------------- LOOP RESET ---------------- */
  useEffect(() => {
    const total = originalImages.length;
    if (!total) return;

    if (currentSlide === total + 1) {
      setTimeout(() => {
        setEnableTransition(false);
        setCurrentSlide(1);
      }, 1000);
    }

    if (currentSlide === 0) {
      setTimeout(() => {
        setEnableTransition(false);
        setCurrentSlide(total);
      }, 1000);
    }
  }, [currentSlide, originalImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F3ED]">
        <div className="loader"></div>
        <p className="mt-4 text-[#737144] uppercase tracking-[0.25em] text-sm font-light"></p>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="w-full bg-[#f9f6ef]">
      {/* LCP PRELOAD (UNCHANGED DESIGN) */}
      {collectionsData[0]?.image && (
        <link
          rel="preload"
          as="image"
          href={cloudinaryOptimize(collectionsData[0].image, "hero")}
        />
      )}

      {collectionsData.map((item) => (
        <section
          key={item.id}
          className="relative w-full overflow-hidden bg-[#f9f6ef]"
          style={{ aspectRatio: "1 / 1" }}
        >
          {/* IMAGE */}
          <div className="absolute inset-0">
            <div
              className={` absolute inset-0 bg-gradient-to-br from-[#f9f6ef] to-[#f4f3ed] transition-opacity duration-300 ${
                loaded[item.id] ? "opacity-0" : "opacity-100"
              }`}
            />
            {item.type === "static" && item.image && (
              <img
                src={cloudinaryOptimize(
                  item.image.url,
                  "q_auto,f_auto,w_100,e_blur:150"
                )}
                alt=""
                className="absolute inset-0 w-full h-full object-contain blur-sm"
                aria-hidden="true"
              />
            )}
            {item.type === "static" && (
              <img
                src={cloudinaryOptimize(item.image, "hero")}
                alt="campaign"
                loading={item.id === 1 ? "eager" : "lazy"}
                fetchpriority={item.id === 1 ? "high" : "auto"}
                decoding="async"
                onLoad={() => setLoaded((p) => ({ ...p, [item.id]: true }))}
                className={`
                  w-full h-full object-contain
                  transition-opacity duration-300
                  ${loaded[item.id] ? "opacity-100" : "opacity-0"}
                `}
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
                    src={cloudinaryOptimize(imgObj.src, "hero")}
                    alt={imgObj.category}
                    loading={i === 1 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full flex-shrink-0 object-contain"
                  />
                ))}
              </div>
            )}
          </div>

          {/* CTA OVERLAY (UNCHANGED) */}
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

      {/* TEXT SECTION (UNCHANGED) */}
      <section className="relative bg-[#f9f6ef] px-6 md:px-20 lg:px-32 py-15">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-[1px] bg-[#737144]/40 mx-auto mb-10" />

          <h2 className="text-3xl md:text-4xl text-[#737144] tracking-[0.18em] uppercase font-light mb-8">
            Crafted for You, Celebrated with You
          </h2>

          <p className="text-sm md:text-base text-[#737144]/80 leading-relaxed font-light">
            Every jutti tells a story of celebration, tradition, and
            individuality.
            <br className="hidden md:block" />
            We offer{" "}
            <span className="text-[#737144]">tailored craftsmanship</span>,
            thoughtfully crafted to reflect your ceremony or festive palette
          </p>

          <a
            href="https://wa.me/917973926474"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              mt-14 px-6 py-3
              text-xs md:text-sm uppercase tracking-[0.25em]
              font-medium text-[#737144]
              border border-[#737144]/60
              transition-all duration-300 ease-out
              hover:bg-[#737144]
              hover:text-[#F7F6F2]
              hover:shadow-[0_6px_18px_rgba(115,113,68,0.25)]
            "
          >
            Click to Customize Your Order
          </a>

          <div className="w-24 h-[1px] bg-[#737144]/40 mx-auto mt-10" />
        </div>
      </section>
    </div>
  );
}

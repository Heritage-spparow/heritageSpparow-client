import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { landingAPI } from "../services/api";
import { useProduct } from "../context/ProductContext";
import { cloudinaryOptimize } from "../utils/loudinary";
import { buildCollectionPath, buildProductPath } from "../utils/productUrl";
import SEO from "./SEO";

const HERITAGE_ROUTES = {
  home: "/",
  about: "/about",
  campaign: "/campaign",
  search: "/search",
  guldasta: "/women/collections/guldasta",
  shringar: "/women/collections/shringar",
};

const COLLECTION_META = {
  guldasta: {
    label: "Guldasta",
    title: "The Guldasta Collection",
    description: "Floral craftsmanship made for everyday elegance.",
    fallbackUrl: HERITAGE_ROUTES.guldasta,
  },
  shringar: {
    label: "Shringar",
    title: "The Shringar Collection",
    description: "Detailed juttis made for celebrations and special moments.",
    fallbackUrl: HERITAGE_ROUTES.shringar,
  },
};

const getId = (item) =>
  item?._id ||
  item?.id ||
  item?.slug ||
  item?.handle ||
  item?.productId?._id ||
  item?.productId?.id ||
  "";

const getImage = (item) =>
  item?.image?.url ||
  item?.coverImage?.url ||
  item?.images?.[0]?.url ||
  item?.thumbnail?.url ||
  item?.image?.secure_url ||
  item?.image ||
  "";

const getName = (item, fallback = "Heritage Sparrow Jutti") =>
  item?.name || item?.title || item?.productName || fallback;

const getSlug = (item) =>
  String(
    item?.slug ||
      item?.handle ||
      item?.collectionSlug ||
      item?.collection?.slug ||
      "",
  )
    .trim()
    .toLowerCase();

const getCollectionObject = (product) => {
  if (!product) return null;

  if (product.collection && typeof product.collection === "object") {
    return product.collection;
  }

  if (product.collectionId && typeof product.collectionId === "object") {
    return product.collectionId;
  }

  return null;
};

const getCollectionSlugFromProduct = (product) => {
  const collection = getCollectionObject(product);

  if (collection) {
    return getSlug(collection);
  }

  return String(
    product?.collectionSlug ||
      product?.collectionName ||
      product?.collection ||
      "",
  )
    .trim()
    .toLowerCase();
};

const getPrice = (product) =>
  product?.salePrice ??
  product?.discountedPrice ??
  product?.sellingPrice ??
  product?.price ??
  null;

const getOriginalPrice = (product) =>
  product?.compareAtPrice ??
  product?.mrp ??
  product?.originalPrice ??
  product?.regularPrice ??
  null;

const getDiscount = (product) => {
  const current = Number(getPrice(product));
  const original = Number(getOriginalPrice(product));

  if (!current || !original || original <= current) return null;

  return Math.round(((original - current) / original) * 100);
};

const getCollectionKey = (collection) => {
  const slug = getSlug(collection);

  if (slug.includes("guldasta")) return "guldasta";
  if (slug.includes("shringar")) return "shringar";

  const name = String(
    collection?.name || collection?.title || "",
  ).toLowerCase();

  if (name.includes("guldasta")) return "guldasta";
  if (name.includes("shringar")) return "shringar";

  return null;
};

export default function FashionLanding() {
  const {
    products = [],
    collections = [],
    featuredProducts = [],
    fetchProducts,
    fetchCollections,
    fetchFeaturedProducts,
  } = useProduct();

  const [landing, setLanding] = useState(null);
  const [landingLoading, setLandingLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Landing API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadLanding = async () => {
      try {
        setLandingLoading(true);

        const response = await landingAPI.get();

        if (!mounted) return;

        setLanding(response?.data?.landing || null);
      } catch (error) {
        console.error("Landing fetch failed:", error);
      } finally {
        if (mounted) {
          setLandingLoading(false);
        }
      }
    };

    loadLanding();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Catalog API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadCatalog = async () => {
      try {
        if (!products.length && fetchProducts) {
          await fetchProducts({ limit: 12 });
        }

        if (mounted && !collections.length && fetchCollections) {
          await fetchCollections();
        }

        if (mounted && !featuredProducts.length && fetchFeaturedProducts) {
          await fetchFeaturedProducts();
        }
      } catch (error) {
        console.error("Homepage catalog fetch failed:", error);
      }
    };

    loadCatalog();

    return () => {
      mounted = false;
    };
  }, [
    products.length,
    collections.length,
    featuredProducts.length,
    fetchProducts,
    fetchCollections,
    fetchFeaturedProducts,
  ]);

  const sectionOne = landing?.sectionOne;
  const sectionTwo = landing?.sectionTwo;
  const sectionThree = landing?.sectionThree;

  /*
  |--------------------------------------------------------------------------
  | Hero images
  |--------------------------------------------------------------------------
  |
  | Slide 0 is ALWAYS the first image already configured for the website.
  | This is the image the user specifically wants to keep.
  |
  | Additional slides come from the existing landing carousel items.
  | If those are unavailable, product/collection images already returned
  | by the API are used. No external image URL is invented.
  |
  */
const heroSlides = useMemo(() => {
  const slides = [];
  const usedImages = new Set();

  const addSlide = (image, data = {}) => {
    if (!image || usedImages.has(image)) return;

    usedImages.add(image);

    slides.push({
      id: data.id || `hero-${slides.length}`,
      image,
      href: data.href || HERITAGE_ROUTES.search,
      cta: data.cta || "Shop the Sale",
      alt: data.alt || "Heritage Sparrow handcrafted juttis",
    });
  };

  /*
   * =========================================================
   * HERO SOURCE — LANDING PAGE CMS ONLY
   *
   * 1. Section 1 = Featured Collection Banner
   * 2. Section 2 = Featured Product Images
   *
   * NOTHING ELSE IS ALLOWED INTO THE HERO.
   * =========================================================
   */

  // ---------------------------------------------------------
  // SLIDE 1 — FEATURED COLLECTION BANNER
  // ---------------------------------------------------------

  const featuredCollectionImage =
    sectionOne?.coverImage?.url ||
    sectionOne?.image?.url ||
    sectionOne?.coverImage ||
    sectionOne?.image ||
    "";

  if (featuredCollectionImage) {
    addSlide(featuredCollectionImage, {
      id: "hero-featured-collection",
      href: sectionOne?.collection
        ? buildCollectionPath(sectionOne.collection)
        : HERITAGE_ROUTES.guldasta,
      cta: sectionOne?.ctaLabel || "Shop the Sale",
      alt:
        sectionOne?.collection
          ? `${sectionOne.collection} Collection`
          : "Heritage Sparrow featured collection",
    });
  }

  // ---------------------------------------------------------
  // SLIDES 2+ — SECTION 2 FEATURED PRODUCTS
  // ---------------------------------------------------------

  const featuredItems = Array.isArray(sectionTwo?.items)
    ? sectionTwo.items
    : [];

  featuredItems.forEach((item, index) => {
    /*
     * The image MUST come from the Landing Page CMS.
     * Do not fall back to products/featuredProducts.
     */

    const image = getImage(item);

    if (!image) return;

    const product =
      typeof item?.productId === "object"
        ? item.productId
        : null;

    let href = HERITAGE_ROUTES.search;

    if (product) {
      try {
        href = buildProductPath(product);
      } catch {
        href = HERITAGE_ROUTES.search;
      }
    }

    addSlide(image, {
      id: `hero-featured-product-${getId(item) || index}`,
      href,
      cta: item?.ctaLabel || "Shop Now",
      alt: getName(product, "Heritage Sparrow handcrafted jutti"),
    });
  });

  /*
   * IMPORTANT:
   *
   * There is intentionally NO:
   *
   * - sectionThree image
   * - featuredProducts fallback
   * - products fallback
   * - random product image
   *
   * The hero is controlled exclusively by Landing Page CMS.
   */

  return slides;
}, [sectionOne, sectionTwo]);

  /*
  |--------------------------------------------------------------------------
  | Hero carousel controls
  |--------------------------------------------------------------------------
  */

  const goToSlide = useCallback(
    (index) => {
      if (!heroSlides.length) return;

      const safeIndex =
        ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;

      setCurrentSlide(safeIndex);
    },
    [heroSlides.length],
  );

  const goNext = useCallback(() => {
    if (!heroSlides.length) return;

    setCurrentSlide((previous) =>
      previous === heroSlides.length - 1 ? 0 : previous + 1,
    );
  }, [heroSlides.length]);

  const goPrevious = useCallback(() => {
    if (!heroSlides.length) return;

    setCurrentSlide((previous) =>
      previous === 0 ? heroSlides.length - 1 : previous - 1,
    );
  }, [heroSlides.length]);

  /*
  |--------------------------------------------------------------------------
  | Automatic hero carousel
  |--------------------------------------------------------------------------
  |
  | 5 seconds per slide.
  | Pauses while the user is touching/hovering the hero.
  |
  */

  useEffect(() => {
    if (heroSlides.length <= 1 || isPaused) return undefined;

    const interval = window.setInterval(() => {
      setCurrentSlide((previous) =>
        previous === heroSlides.length - 1 ? 0 : previous + 1,
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length, isPaused]);

  /*
  |--------------------------------------------------------------------------
  | Keyboard controls
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goPrevious();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goPrevious, goNext]);

  /*
  |--------------------------------------------------------------------------
  | Touch / mobile swipe
  |--------------------------------------------------------------------------
  */

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
    setTouchEndX(null);
    setIsPaused(true);
  };

  const handleTouchMove = (event) => {
    setTouchEndX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const threshold = 50;

      if (Math.abs(distance) >= threshold) {
        if (distance > 0) {
          goNext();
        } else {
          goPrevious();
        }
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Two real collections
  |--------------------------------------------------------------------------
  */

  const homepageCollections = useMemo(() => {
    const result = {
      guldasta: null,
      shringar: null,
    };

    collections.forEach((collection) => {
      const key = getCollectionKey(collection);

      if (key && !result[key]) {
        result[key] = collection;
      }
    });

    return Object.entries(result).map(([key, collection]) => {
      const meta = COLLECTION_META[key];

      const matchingProduct =
        featuredProducts.find((product) =>
          getCollectionSlugFromProduct(product).includes(key),
        ) ||
        products.find((product) =>
          getCollectionSlugFromProduct(product).includes(key),
        );

      const image = getImage(collection) || getImage(matchingProduct) || "";

      let href = meta.fallbackUrl;

      if (collection) {
        try {
          href = buildCollectionPath(
            collection.slug || collection.name || collection.title,
          );
        } catch {
          href = meta.fallbackUrl;
        }
      }

      return {
        key,
        collection,
        image,
        href,
        label: meta.label,
        title: collection?.name || collection?.title || meta.title,
        description: collection?.description || meta.description,
      };
    });
  }, [collections, products, featuredProducts]);

  /*
  |--------------------------------------------------------------------------
  | Product grid
  |--------------------------------------------------------------------------
  */

  const homepageProducts = useMemo(() => {
    const source = featuredProducts.length > 0 ? featuredProducts : products;

    const unique = [];
    const seen = new Set();

    source.forEach((product) => {
      const id = getId(product);

      if (!id || seen.has(id) || !getImage(product)) return;

      seen.add(id);
      unique.push(product);
    });

    return unique.slice(0, 4);
  }, [featuredProducts, products]);

  /*
  |--------------------------------------------------------------------------
  | Product image for secondary campaign section
  |--------------------------------------------------------------------------
  */

  const saleImage =
    getImage(sectionTwo?.items?.[1]) ||
    getImage(homepageProducts[1]) ||
    getImage(homepageProducts[0]) ||
    getImage(sectionOne) ||
    "";

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (landingLoading && !landing && !heroSlides.length) {
    return (
      <main className="min-h-screen bg-[#f9f6ef] flex items-center justify-center">
        <div className="text-center text-[#737144]">
          <div className="loader" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.28em]">
            Heritage Sparrow
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="w-full overflow-x-hidden bg-[#f9f6ef]"
      aria-labelledby="landing-heading"
    >
      <SEO
        title="Heritage Sparrow | Handcrafted Indian Juttis"
        description="Discover Heritage Sparrow's handcrafted Guldasta and Shringar jutti collections."
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Heritage Sparrow Collections",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Guldasta Collection",
              url: "https://www.heritagesparrow.com/women/collections/guldasta",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Shringar Collection",
              url: "https://www.heritagesparrow.com/women/collections/shringar",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "About Heritage Sparrow",
              url: "https://www.heritagesparrow.com/about",
            },
          ],
        }} 
      />

      {/* =========================================================
          HERO — FULL AUTO CAROUSEL
          ========================================================= */}

      <section
        aria-label="Heritage Sparrow featured carousel"
        className="
          relative
          w-full
          overflow-hidden
          bg-[#37351f]
          h-[calc(100svh-32px)]
          min-h-[580px]
          max-h-[920px]
          select-none
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* PRELOAD FIRST HERO IMAGE */}
        {heroSlides[0]?.image && (
          <link
            rel="preload"
            as="image"
            href={cloudinaryOptimize(heroSlides[0].image, "detail")}
          />
        )}

        {/* SLIDES */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => {
            const active = index === currentSlide;

            return (
              <div
                key={slide.id}
                aria-hidden={!active}
                className={`
                  absolute inset-0
                  transition-opacity
                  duration-1000
                  ease-in-out
                  ${
                    active
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0 pointer-events-none"
                  }
                `}
              >
                <img
                  src={cloudinaryOptimize(slide.image, "detail")}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  onLoad={() => {
                    if (index === 0) setHeroLoaded(true);
                  }}
                  className={`
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-[6500ms]
                    ease-out
                    ${active ? "scale-[1.035]" : "scale-100"}
                  `}
                />

                {/* Cinematic overlays */}
                <div className="absolute inset-0 bg-black/10" />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-black/65
                    via-black/30
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-48
                    bg-gradient-to-t
                    from-black/40
                    to-transparent
                  "
                />
              </div>
            );
          })}
        </div>

        {/* HERO COPY */}
        <div
          className="
            relative
            z-20
            h-full
            w-full
            flex
            items-center
            px-6
            sm:px-10
            md:px-16
            lg:px-24
            pointer-events-none
          "
        >
          <div className="max-w-[700px] text-white">
            <p
              className="
                mb-4
                text-[9px]
                sm:text-[10px]
                md:text-xs
                uppercase
                tracking-[0.34em]
                font-light
              "
            >
              The Heritage Sale
            </p>

            <h1
              id="landing-heading"
              className="
                text-[50px]
                leading-[0.91]
                sm:text-[58px]
                md:text-[72px]
                lg:text-[84px]
                font-light
                tracking-[-0.025em]
              "
              style={{
                fontFamily: "' D-DIN', serif",
              }}
            >
              Handcrafted
              <br />
              Juttis for
              <br />
              Brighter Days.
            </h1>

            <p className="mt-6 text-2xl md:text-3xl font-light">
              UP TO 50% OFF
            </p>

            <p className="mt-1 text-sm md:text-base text-white/85">
              On our curated jutti collections
            </p>

            {heroSlides[currentSlide] && (
              <Link
                to={heroSlides[currentSlide].href}
                className="
                  pointer-events-auto
                  mt-7
                  inline-flex
                  items-center
                  border
                  border-white/80
                  px-7
                  py-3.5
                  text-[9px]
                  md:text-xs
                  uppercase
                  tracking-[0.2em]
                  font-light
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-[#35321f]
                "
              >
                {heroSlides[currentSlide].cta}
                <span className="ml-5 text-base">→</span>
              </Link>
            )}
          </div>
        </div>
        {/* PROGRESS */}
        {heroSlides.length > 1 && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/20 overflow-hidden">
            <div
              key={currentSlide}
              className="h-full bg-white animate-heritage-progress"
            />
          </div>
        )}

        {!heroLoaded && heroSlides[0]?.image && (
          <div className="absolute inset-0 z-40 bg-[#37351f] pointer-events-none" />
        )}
      </section>

      {/* =========================================================
          COLLECTIONS
          ========================================================= */}

      <section
        aria-labelledby="collections-heading"
        className="relative overflow-hidden "
          style={{
              backgroundImage: "url('./sparrow.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "lighten",
            }}
        
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.13] text-[#737144]">
          <div className="absolute left-[-20px] top-10 text-[170px] leading-none">
            ❧
          </div>
          <div className="absolute right-[-20px] top-10 text-[170px] leading-none scale-x-[-1]">
            ❧
          </div>
        </div>

        <div className="relative px-5 sm:px-8 md:px-12 lg:px-16 py-10 md:py-14">
          <div className="text-center">
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.36em] text-[#737144]">
              Our Collections
            </p>

            <h2
              id="collections-heading"
              className="mt-2 text-4xl md:text-5xl font-light text-[#35321f]"
              style={{
                fontFamily: "' D-DIN', serif",
              }}
            >
              Two Stories. One Heritage.
            </h2>
          </div>

          <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
            {homepageCollections.map((collection) => (
              <Link
                key={collection.key}
                to={collection.href}
                className="
                  group
                  relative
                  min-h-[310px]
                  md:min-h-[430px]
                  overflow-hidden
                  bg-[#5d5936]
                "
              >
                {collection.image ? (
                  <img
                    src={cloudinaryOptimize(collection.image, "detail")}
                    alt={collection.title}
                    loading="lazy"
                    decoding="async"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-[1.035]
                    "
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#5d5936]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

                <div className="relative z-10 min-h-[310px] md:min-h-[430px] p-7 md:p-10 lg:p-12 flex items-end">
                  <div className="max-w-sm text-white">
                    <p className="text-[9px] uppercase tracking-[0.28em]">
                      {collection.label}
                    </p>

                    <h3
                      className="mt-3 text-3xl md:text-4xl leading-none font-light"
                      style={{
                        fontFamily: "' D-DIN', serif",
                      }}
                    >
                      {collection.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      {collection.description}
                    </p>

                    <span className="mt-6 inline-flex border-b border-white/80 pb-1 text-[9px] uppercase tracking-[0.22em]">
                      Shop Collection
                      <span className="ml-4">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SALE BANNER
          ========================================================= */}

      <section
        aria-label="Heritage Sparrow sale"
        className="
          relative
          min-h-[330px]
          md:min-h-[420px]
          overflow-hidden
        "
      >
        {saleImage ? (
          <img
            src={cloudinaryOptimize(saleImage, "detail")}
            alt="Heritage Sparrow handcrafted juttis"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#3b3b22]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#252817]/90 via-[#35351f]/65 to-transparent" />

        <div className="relative z-10 min-h-[330px] md:min-h-[420px] flex items-center px-7 sm:px-10 md:px-16 lg:px-24">
          <div className="max-w-xl text-white">
            <p className="text-[9px] uppercase tracking-[0.34em]">
              The Heritage Sale
            </p>

            <h2
              className="mt-3 text-5xl md:text-7xl leading-none font-light"
              style={{
                fontFamily: "' D-DIN', serif",
              }}
            >
              UP TO 50% OFF
            </h2>

            <p className="mt-4 text-sm md:text-base text-white/85">
              Handcrafted juttis, made to be worn,
              <br className="hidden sm:block" />
              remembered and celebrated.
            </p>

            <Link
              to={HERITAGE_ROUTES.shringar}
              className="
                mt-7
                inline-flex
                border
                border-white/80
                px-7
                py-3
                text-[9px]
                uppercase
                tracking-[0.2em]
                transition
                hover:bg-white
                hover:text-[#35321f]
              "
            >
              Shop the Sale
              <span className="ml-5">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          CRAFT STORY
          ========================================================= */}

      <section className=" px-5 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16"
       style={{
              backgroundImage: "url('./sparrow.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "lighten",
            }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="overflow-hidden">
              <img
                src="/Campaign/DSC_5618.jpg"
                alt="Heritage Sparrow craftsmanship"
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover"
              />
          </div>

          <div className="lg:pr-10">
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#737144]">
              The Craft
            </p>

            <h2
              className="mt-3 text-4xl md:text-5xl leading-[0.95] font-light text-[#35321f]"
              style={{
                fontFamily: "' D-DIN', serif",
              }}
            >
              More Than a Jutti.
              <br />A Piece of Heritage.
            </h2>

            <p className="mt-5 max-w-xl text-sm md:text-base leading-7 text-[#737144]/80">
              Each pair is thoughtfully handcrafted by skilled artisans,
              carrying forward traditions, techniques and stories that have
              lived for generations.
            </p>

            <Link
              to={HERITAGE_ROUTES.about}
              className="
                mt-6
                inline-flex
                border
                border-[#737144]/60
                px-6
                py-3
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-[#737144]
                transition
                hover:bg-[#737144]
                hover:text-white
              "
            >
              Our Story
              <span className="ml-5">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT GRID
          ========================================================= */}

      <section
        aria-labelledby="products-heading"
        className=" px-5 sm:px-8 md:px-12 lg:px-16 pb-12 md:pb-16"
         style={{
              backgroundImage: "url('./sparrow.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "lighten",
            }}
      >
        <div className="text-center mb-7 md:mb-10">
          <p className="text-[9px] uppercase tracking-[0.34em] text-[#737144]">
            Handpicked for You
          </p>

          <h2
            id="products-heading"
            className="mt-2 text-4xl md:text-5xl font-light text-[#35321f]"
            style={{
              fontFamily: "' D-DIN', serif",
            }}
          >
            Shop the Collection
          </h2>
        </div>

        {homepageProducts.length > 0 ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
          
          >
            {homepageProducts.map((product, index) => {
              const currentPrice = getPrice(product);
              const originalPrice = getOriginalPrice(product);
              const discount = getDiscount(product);

              return (
                <Link
                  key={getId(product) || index}
                  to={buildProductPath(product)}
                  className="group min-w-0"
                >
                  <div className="relative overflow-hidden bg-[#eae5d8] aspect-[0.86]">
                    <img
                      src={cloudinaryOptimize(getImage(product), "detail")}
                      alt={getName(product)}
                      loading="lazy"
                      decoding="async"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.035]
                      "
                    />

                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        right-3
                        top-3
                        text-xl
                        text-white
                        drop-shadow
                      "
                    >
                      ♡
                    </span>
                  </div>

                  <div className="pt-3">
                    <h3 className="text-xs md:text-sm text-[#35321f] truncate">
                      {getName(product)}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] md:text-xs">
                      {currentPrice != null && (
                        <span className="font-medium text-[#35321f]">
                          ₹{Number(currentPrice).toLocaleString("en-IN")}
                        </span>
                      )}

                      {originalPrice != null &&
                        Number(originalPrice) > Number(currentPrice) && (
                          <span className="text-[#737144]/60 line-through">
                            ₹{Number(originalPrice).toLocaleString("en-IN")}
                          </span>
                        )}

                      {discount && (
                        <span className="text-[#9b493b]">{discount}% OFF</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-[#737144]">
            Discover our handcrafted collections.
          </div>
        )}
      </section>

      {/* =========================================================
          TRUST STRIP
          ========================================================= */}

      <section className="bg-[#737144] text-white "  style={{
              backgroundImage: "url('/olivegreenBackground.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "lighten",
            }}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4"
        >
          {[
            ["♧", "Free Shipping", "On eligible orders"],
            ["◇", "Easy Returns", "Hassle-free returns"],
            ["♡", "Secure Payments", "UPI, Cards & Net Banking"],
            ["✿", "Support Artisans", "Authentic handcrafted pieces"],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="
                border-r
                last:border-r-0
                border-white/15
                px-2
                py-5
                md:px-5
                md:py-7
                text-center
              "
            >
              <div className="text-lg md:text-xl">{icon}</div>

              <p className="mt-2 text-[8px] md:text-[9px] uppercase tracking-[0.12em]">
                {title}
              </p>

              <p className="mt-1 text-[8px] md:text-[9px] text-white/65">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative  px-6 md:px-20 lg:px-32 py-15"
       style={{
              backgroundImage: "url('./sparrow.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "lighten",
            }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-[1px] bg-[#737144]/40 mx-auto mb-10" />

          <h1
            id="landing-heading"
            className="text-3xl md:text-4xl text-[#737144] tracking-[0.18em] uppercase font-light mb-8"
          >
            Crafted for You, Celebrated with You
          </h1>

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
              focus:outline-none focus:ring-2 focus:ring-[#737144]/40
            "
          >
            Click to Customize Your Order
          </a>

          <div className="w-24 h-[1px] bg-[#737144]/40 mx-auto mt-10" />
        </div>
      </section>
    </main>
  );
}

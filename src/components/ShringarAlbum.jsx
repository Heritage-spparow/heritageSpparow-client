import React from "react";

const images = [
  "/Campaign/DSC_5618.jpg",
  "/Campaign/DSC_5871.jpg",
  "/Campaign/DSC_5793.jpg",
  "/Campaign/DSC_5670.jpg",
  "/Campaign/DSC_5975.jpg",
  "/Campaign/DSC_5657.jpg",
  "/Campaign/DSC_5888.jpg",
  "/Campaign/DSC_5859.jpg",
  "/Campaign/DSC_6175.jpg",
  "/Campaign/DSC_6209.jpg",
  "/Campaign/Untitled-1.jpg",
];

export default function ShringarAlbum() {
  return (
    <main className="bg-[#f9f6ef] text-[#6f6d45]">
      {/* INTRO */}
      <section className="px-6 md:px-16 lg:px-24 pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.18em]">
          Shringar
        </h1>

        <p className="mt-6 max-w-xl text-sm md:text-base leading-7 opacity-80">
          Shringar is not an act — it is a moment shared. Between mirrors,
          laughter, and quiet rituals.
        </p>
      </section>

      {/* IMAGE GRID */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-24 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-2">
          {images.map((src, i) => (
            <div
              key={i}
              className={`
          overflow-hidden
          ${
            /* Desktop editorial spans only */
            i % 5 === 0 ? "md:col-span-2 md:aspect-[3/2]" : "aspect-[4/5]"
          }
          aspect-[4/5] md:aspect-auto
        `}
            >
              <img
                src={src}
                alt="Shringar Moment"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FOOT NOTE */}
      <section className="px-6 md:px-16 lg:px-24 pb-24 text-center">
        <p className="text-xs tracking-[0.35em] uppercase opacity-60">
          Heritage Sparrow · Shringar Campaign
        </p>
      </section>
    </main>
  );
}

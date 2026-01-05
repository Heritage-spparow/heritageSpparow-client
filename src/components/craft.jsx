import React from "react";
import videoSketch from "../assets/craft/IMG_6233.mp4";
import videoTrace from "../assets/craft/IMG_6242.mov";
import videoEmbroider from "../assets/craft/IMG_6249.jpg";

import artisan1 from "../assets/logo.png";
import artisan2 from "../assets/images.jpeg";
import artisan3 from "../assets/sari.png";

const steps = [
  {
    title: "Sketching the Story",
    text: "Every design begins as a memory on paper — sparrows, phulkaris, vintage windows and borders from Nani’s dupatta.",
    type: "video",
    src: videoSketch,
  },
  {
    title: "Tracing on Fabric",
    text: "Designs are traced by hand on casement or soft leather — no lasers, just a wooden table and quiet focus.",
    type: "video",
    src: videoTrace,
  },
  {
    title: "Embroidery & Detailing",
    text: "Needles move in rhythm as artisans add tilla, resham and tiny motifs one by one — hours turn into days.",
    type: "video",
    src: videoEmbroider,
  },
];

const artisans = [
  {
    name: "Rafiq ji · Lucknow",
    role: "Embroidery Master",
    text: "20+ years on the adda. When he saw our design, he smiled — “ਕਾਮ ਭਾਰੀ ਹੈ… ਪਰ ਹੋ ਜਾਏਗਾ.”",
    img: artisan1,
  },
  {
    name: "Vijay ji · Amritsar",
    role: "Jutti Karigar",
    text: "His family has shaped leather soles since before independence — a lineage stitched through time.",
    img: artisan2,
  },
  {
    name: "Manoj ji & Abdesh · Bihar",
    role: "Brothers in Craft",
    text: "One traces, one embroiders. Both learnt sitting beside elders, copying every stitch until hands remembered.",
    img: artisan3,
  },
];

export default function CraftPage() {
  return (
    <main
      className="min-h-screen bg-[#f9f6ef] text-[#737144]"
      style={{ fontFamily: "'D-DIN', sans-serif" }}
    >
      {/* Hero */}
      <section className="px-6 py-16 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#737144]/70">
            Voyage to Artisanship
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl lg:text-[2.6rem] tracking-[0.18em] uppercase font-light">
            The Craft of Heritage Sparrow
          </h1>

          <p className="mt-5 text-sm md:text-[15px] leading-7 text-[#737144]/80">
            Slowmade, soulful and rooted in memory — here’s how every piece makes
            its journey from adda to you.
          </p>
        </div>
      </section>

      {/* Craft Feed */}
      <section className="px-6 py-10 md:px-16 lg:px-24">
        <div className="grid gap-10 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.title}
              className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square w-full bg-[#efeada] overflow-hidden">
                <video
                  src={step.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>

              <div className="p-5">
                <h3 className="uppercase tracking-[0.18em] text-xs font-medium text-[#737144]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm text-[#737144]/85 leading-6">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Punjabi Verse */}
      <section className="px-6 py-14 md:px-16 lg:px-24 bg-[#efeada]">
        <p className="text-center text-sm md:text-base italic leading-relaxed text-[#737144]">
          “ਮਿੱਟੀ ਦੀ ਖੁਸ਼ਬੂ, ਸੂਈ ਧਾਗੇ ਦੀ ਰੀਤ, <br />
          ਸਾਡਾ ਵਿਰਸਾ, ਸਾਡਾ ਪਿਆਰ, ਹਰ ਜੁੱਤੀ ਵਿੱਚ ਦੀਤ।”
        </p>
      </section>

      {/* Artisans */}
      <section className="px-6 py-16 md:px-16 lg:px-24">
        <div className="max-w-3xl mb-10">
          <h2 className="text-sm md:text-base tracking-[0.22em] uppercase font-light">
            Meet the Hands Behind Our Craft
          </h2>
          <p className="mt-3 text-sm md:text-[15px] leading-7 text-[#737144]/80">
            The artisans whose hands carry decades of memory, tradition and quiet mastery.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {artisans.map((a) => (
            <article
              key={a.name}
              className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square bg-[#efeada]">
                <img
                  src={a.img}
                  alt={a.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-5">
                <h3 className="uppercase tracking-[0.2em] text-xs font-medium">
                  {a.name}
                </h3>
                <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[#737144]/70">
                  {a.role}
                </p>
                <p className="mt-3 text-xs md:text-sm text-[#737144]/85 leading-6">
                  {a.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="px-6 py-16 md:px-16 lg:px-24 bg-[#efeada]">
        <div className="max-w-3xl">
          <h2 className="text-sm md:text-base tracking-[0.24em] uppercase text-[#737144]">
            Slowmade, Not Seasonal
          </h2>
          <p className="mt-4 text-sm md:text-[15px] leading-7 text-[#555]">
            Small batches, patient hands, and respect for every artisan — this is not fast fashion.
          </p>
          <p className="mt-5 text-[10px] tracking-[0.3em] uppercase text-[#737144]/70">
            Heritage Sparrow · crafted by hand, carried by heart
          </p>
        </div>
      </section>
    </main>
  );
}

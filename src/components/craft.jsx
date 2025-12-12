import React from "react";

const steps = [
  {
    title: "Sketching the Story",
    text: "Every design begins as a memory on paper — sparrows, phulkaris, vintage windows and borders from Nani’s dupatta.",
    img: "/craft1.jpg" // replace with your images
  },
  {
    title: "Tracing on Fabric",
    text: "Designs are traced by hand on casement or soft leather — no lasers, just a wooden table and quiet focus.",
    img: "/craft2.jpg"
  },
  {
    title: "Embroidery & Detailing",
    text: "Needles move in rhythm as artisans add tilla, resham and tiny motifs one by one — hours turn into days.",
    img: "/craft3.jpg"
  },
  {
    title: "Cutting & Shaping",
    text: "Embroidered fabric is cut, lined and shaped over a leather base. Another artisan prepares soles and cushioning.",
    img: "/craft4.jpg"
  },
  {
    title: "Stitching It Together",
    text: "Upper, lining and sole are stitched by hand — the same way it has been done for generations.",
    img: "/craft5.jpg"
  },
  {
    title: "Finishing & Blessing",
    text: "Edges are polished and threads are checked before every pair is held with care — becoming a Heritage Sparrow piece.",
    img: "/craft6.jpg"
  }
];

const artisans = [
  {
    name: "Rafiq ji · Lucknow",
    role: "Embroidery Master",
    text: "20+ years on the adda. When he saw our design, he smiled — “ਕਾਮ ਭਾਰੀ ਹੈ… ਪਰ ਹੋ ਜਾਏਗਾ.”",
    img: "/artisan1.jpg"
  },
  {
    name: "Vijay ji · Amritsar",
    role: "Jutti Karigar",
    text: "His family has shaped leather soles since before independence — a lineage stitched through time.",
    img: "/artisan2.jpg"
  },
  {
    name: "Manoj ji & Abdesh · Bihar",
    role: "Brothers in Craft",
    text: "One traces, one embroiders. Both learnt sitting beside elders, copying every stitch until hands remembered.",
    img: "/artisan3.jpg"
  }
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
            Slowmade, soulful and rooted in memory — here’s how every piece makes its journey from adda to you.
          </p>
        </div>
      </section>

      {/* IG style feed - Steps */}
      <section className="px-6 py-10 md:px-16 lg:px-24">
        <div className="grid gap-10 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Post image */}
              <div className="aspect-square w-full bg-[#efeada]">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
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
        <p className="text-center text-sm md:text-base leading-relaxed italic text-[#737144]">
          “ਮਿੱਟੀ ਦੀ ਖੁਸ਼ਬੂ, ਸੂਈ ਧਾਗੇ ਦੀ ਰੀਤ, <br />
          ਸਾਡਾ ਵਿਰਸਾ, ਸਾਡਾ ਪਿਆਰ, ਹਰ ਜੁੱਤੀ ਵਿੱਚ ਦੀਤ।”
        </p>
      </section>

      {/* IG style feed - Artisans */}
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
              <div className="aspect-square w-full bg-[#efeada]">
                <img
                  src={a.img}
                  alt={a.name}
                  className="w-full h-full object-cover"
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

      {/* Slowmade Footer Section */}
      <section className="px-6 py-16 md:px-16 lg:px-24 bg-[#efeada] text-[#262314]">
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

import React from "react";
import videoSketch from "../assets/craft/IMG_6233.mp4";
import videoTrace from "../assets/craft/IMG_6242.mp4";
import videoEmbroider from "../assets/craft/IMG_6249.jpg";
import heritage from "../assets/craft/DSC_7360.jpg";

const steps = [
  {
    title: "Sketching the Heritage",
    text: "Each design begins as a hand drawn exploration of heritage  inspired by age old motifs, traditional patterns, and stories preserved through generations.",
    src: videoSketch,
  },
  {
    title: "Tracing by Hand",
    text: "The designs are carefully traced by hand onto fabric and soft leather, guided by practiced hands, quiet focus, and respect for traditional methods.",
    src: videoTrace,
  },
];

const artisans = [
  {
    name: "Rafiq ji · Lucknow",
    role: "Embroidery Master",
    text: "20+ years on the adda. When he saw our design, he smiled — “ਕਾਮ ਭਾਰੀ ਹੈ… ਪਰ ਹੋ ਜਾਏਗਾ.”",
    img: "/artisan1.jpg",
  },
  {
    name: "Vijay ji · Amritsar",
    role: "Jutti Karigar",
    text: "His family has shaped leather soles since before independence — a lineage stitched through time.",
    img: "/artisan2.jpg",
  },
];

export default function CraftPage() {
  return (
    <main
      className="bg-[#f9f6ef] text-[#6f6d45]"
      style={{ fontFamily: "'D-DIN', sans-serif" }}
    >
      {/* HERO */}
      <section className="px-6 md:px-16 lg:px-24 pt-28 pb-20">
        <div className="max-w-4xl">
          <p className="text-[11px] tracking-[0.35em] uppercase opacity-70">
            Heritage Process
          </p>

          <h1 className="mt-6 text-4xl md:text-5xl lg:text-[3.2rem] font-light uppercase tracking-[0.18em] leading-tight">
            Craft is <br /> Memory Made Tangible
          </h1>

          <p className="mt-8 max-w-xl text-sm md:text-base leading-7 opacity-80">
            At Heritage Sparrow, craft stands as a legacy, defined by time,
            intention, and human touch.
          </p>
        </div>
      </section>

      {/* FULL WIDTH VISUAL */}
      <section className="w-full h-[70vh]  overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <img
            src={heritage}
            className="   w-full
        h-[60vh] md:h-[70vh]
        object-cover"
          />
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="px-6 md:px-16 lg:px-24 py-28 space-y-28">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`grid gap-12 items-center ${
              index % 2 === 0
                ? "md:grid-cols-[1.2fr_1fr]"
                : "md:grid-cols-[1fr_1.2fr]"
            }`}
          >
            <div className={`${index % 2 !== 0 ? "md:order-2" : ""}`}>
              {/* <p className="text-[10px] tracking-[0.4em] uppercase opacity-60">
                Step {index + 1}
              </p> */}

              <h2 className="mt-4 text-2xl md:text-3xl uppercase tracking-[0.15em] font-light">
                {step.title}
              </h2>

              <p className="mt-6 max-w-md text-sm md:text-base leading-7 opacity-80">
                {step.text}
              </p>
            </div>

            <div className="aspect-[4/5] bg-[#efeada] overflow-hidden">
              <video
                src={step.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </section>

      {/* POETRY */}
      {/* <section className="px-6 md:px-16 lg:px-24 py-24 bg-[#efeada]">
        <p className="text-center max-w-2xl mx-auto text-sm md:text-base italic leading-relaxed">
          “ਮਿੱਟੀ ਦੀ ਖੁਸ਼ਬੂ, ਸੂਈ ਧਾਗੇ ਦੀ ਰੀਤ, <br />
          ਸਾਡਾ ਵਿਰਸਾ, ਸਾਡਾ ਪਿਆਰ, ਹਰ ਜੁੱਤੀ ਵਿੱਚ ਦੀਤ।”
        </p>
      </section> */}

      {/* ARTISANS */}
      {/* <section className="px-6 md:px-16 lg:px-24 py-28">
        <div className="max-w-3xl mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase opacity-70">
            The Hands
          </p>

          <h2 className="mt-4 text-3xl uppercase tracking-[0.18em] font-light">
            The Makers
          </h2>

          <p className="mt-6 text-sm md:text-base leading-7 opacity-80">
            Each artisan carries decades of skill — not taught, but lived.
          </p>
        </div>

        <div className="grid gap-16 md:grid-cols-3">
          {artisans.map((a) => (
            <div key={a.name}>
              <div className="aspect-[3/4] bg-[#efeada] overflow-hidden">
                <img
                  src={a.img}
                  alt={a.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
                />
              </div>

              <h3 className="mt-6 text-xs uppercase tracking-[0.25em]">
                {a.name}
              </h3>

              <p className="mt-1 text-[10px] tracking-[0.3em] uppercase opacity-60">
                {a.role}
              </p>

              <p className="mt-4 text-sm leading-6 opacity-80">{a.text}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* CLOSING */}
      <section className="px-6 md:px-16 lg:px-24 py-28 bg-[#efeada]">
        <div className="max-w-3xl">
          <h2 className="text-sm tracking-[0.35em] uppercase text-[#737144]">
            Slowmade, Always
          </h2>

          <p className="mt-6 text-sm md:text-base leading-7 text-[#737144]/80">
            Crafted with patience and intention, each piece reflects a respect
            for time, tradition, and the quiet rhythm of handwork.
          </p>

          <p className="mt-10 text-[10px] tracking-[0.35em] uppercase text-[#737144]/60">
            Heritage Sparrow · Handcrafted with Intention
          </p>
        </div>
      </section>
    </main>
  );
}

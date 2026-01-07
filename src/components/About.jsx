import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import heritage from "../assets/craft/DSC_7360.jpg";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";

export default function AboutPage() {
  const [activeAccordion, setActiveAccordion] = useState(null);
    const { fetchCategories, categories } = useProduct();
  const navigate = useNavigate();

  const dinStyle = {
    fontFamily:
      "'D-DIN', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 400,
  };

  const values = [
    {
      title: "Craftsmanship",
      description:
        "More than a product, it reflects years of experience and devotion, thoughtfully crafted and offered to you with heartfelt care.",
    },
    {
      title: "Sustainability",
      description:
        "We honor the earth that gives us beauty. Our practices ensure minimal environmental impact while supporting local ecosystems.",
    },
    {
      title: "Heritage",
      description:
       "We work with age old patterns, crafts, and techniques, reinterpreting them through contemporary design. Our purpose goes beyond revival  we strive for acceptance, allowing traditional craft to live naturally in the present.",
    },
    {
      title: "Authenticity",
      description:
        "Every piece is handmade, inherently unique, and shaped through hours of careful craftsmanship.",
    },
  ];

  const timeline = [
    {
      year: "2015",
      event: "Founded in a small village workshop with three master weavers",
    },
    {
      year: "2017",
      event: "Expanded to support 50+ artisan families across rural India",
    },
    { year: "2019", event: "Launched our first sustainable silk collection" },
    {
      year: "2021",
      event: "Recognized for preserving traditional Banarasi techniques",
    },
    {
      year: "2023",
      event: "Grew to a community of 200+ artisans and craftspeople",
    },
    {
      year: "2025",
      event: "Continuing our mission to weave tradition into tomorrow",
    },
  ];

  return (
    <div style={dinStyle} className="min-h-screen bg-[#f9f6ef]">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-[#737144] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#737144]/90 to-[#737144]/60" />
        <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
          <img
            src="/socials-01.png"
            alt="Heritage Sparrow Logo"
            className=" w-[31%] md:w-[22%] m-0"
            loading="lazy"
          />
          <h1 className="text-5xl mt-[-3%] md:text-7xl font-light text-white tracking-[0.2em] mb-6 uppercase">
            Heritage Sparrow
          </h1>
          <p className="text-lg md:text-xl text-white/90 tracking-[0.15em] font-light max-w-2xl">
            VOYAGE TO ARTISANSHIP
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-light text-[#737144] tracking-[0.15em] mb-8 uppercase">
              Our Story
            </h2>
            <div className="space-y-6 text-[#555] leading-relaxed">
              <h2 className="text-[#737144] text-xl font-medium tracking-wide">
                About Us
              </h2>

              <p>
                Heritage Sparrow is born from a love for India’s old stories,
                quiet details, and handmade traditions.
              </p>

              <p>
                We look back to age old craft patterns and bring them forward
                with thoughtful design, keeping their soul intact.
              </p>

              <p>
                Rooted in craft and community, our work is shaped slowly, by
                skilled hands and patient processes.
              </p>

              <p>
                Every piece carries time, care, and memory  made not in haste,
                but with heart.
              </p>

              <h3 className="text-[#737144] text-lg font-medium tracking-wide pt-4">
                Our Vision
              </h3>

              <p className="">
                To revive traditional craft patterns and give them a new voice
                through contemporary design, while staying true to slow-made
                values and honest workmanship.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="aspect-[4/5] bg-[#737144]/10 rounded-sm overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-[#737144]/30 text-sm tracking-wider">
                <img src="/story.png" alt="" srcset="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-light text-[#737144] tracking-[0.15em] mb-4 uppercase text-center">
            Our Values
          </h2>
          <p className="text-center text-[#555] mb-16 max-w-2xl mx-auto">
           
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 border border-[#737144]/20 hover:border-[#737144] transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-xl font-medium text-[#737144] tracking-[0.1em] mb-4 uppercase">
                  {value.title}
                </h3>
                <p className="text-[#555] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      {/* <div className="bg-[#737144] py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-light text-white tracking-[0.15em] mb-8 uppercase">
            Our Mission
          </h2>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            To be the thread that connects heritage with modernity, artisans
            with admirers, and tradition with innovation. We exist to ensure
            that India's textile legacy doesn't just survive—it thrives.
          </p>
          <p className="text-white/80 leading-relaxed">
            Through fair wages, sustainable practices, and unwavering commitment
            to quality, we're weaving a future where ancient crafts flourish and
            artisan communities prosper.
          </p>
        </div>
      </div> */}

      {/* Impact Section */}
      {/* <div className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-light text-[#737144] tracking-[0.15em] mb-16 uppercase text-center">
          Our Impact
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { number: "200+", label: "Artisan Families Supported" },
            { number: "15+", label: "Villages Empowered" },
            { number: "10,000+", label: "Handcrafted Pieces Created" },
            { number: "100%", label: "Fair Trade Certified" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-light text-[#737144] mb-3">
                {stat.number}
              </div>
              <div className="text-sm text-[#555] tracking-[0.1em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Artisan Stories Section */}
      <div className="bg-[#f4f3ed] py-20">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-light text-[#737144] tracking-[0.15em] mb-4 uppercase text-center">
            Meet Our Artisans
          </h2>
          <p className="text-center text-[#555] mb-16 max-w-2xl mx-auto">
            Behind every piece is a person, a story, and a legacy of
            craftsmanship
          </p>

          <div className="grid md:grid-cols-4 gap-8"> 
            {[
              {
                name: "Manoj Paswan",
                craft: "Master Embroiderer",
                experience: "25 years",
                img: "/art1.jpeg",
              },
              {
                name: "Vijay Kumar",
                craft: "Leather Karigar",
                experience: "24 years",
                img: "/vijay.png",
              },
              {
                name: "Jagdish Kumar",
                craft: "Leather Karigar",
                experience: "50 years",
                img: "/chkra.png",
              },
              {
                name: "Rafeeq",
                craft: "Master Embroiderer",
                experience: "28 years",
                img: "/art4.jpeg",
              },
            ].map((artisan, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-sm border border-[#737144]/10"
              >
                <div className="aspect-square bg-[#737144]/10 mb-4 flex items-center justify-center">
                  <span className="text-[#737144]/30 text-sm tracking-wider">
                    <img src={artisan.img} alt="" srcset="" />
                  </span>
                </div>
                <h3 className="text-lg font-medium text-[#737144] tracking-[0.1em] mb-2">
                  {artisan.name}
                </h3>
                <p className="text-sm text-[#555] mb-1">{artisan.craft}</p>
                <p className="text-xs text-[#737144]">
                  {artisan.experience} of experience
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-light text-[#737144] tracking-[0.15em] mb-6 uppercase">
          Join Our Journey
        </h2>
        <p className="text-[#555] leading-relaxed mb-10 max-w-2xl mx-auto">
          Every purchase supports an artisan, preserves a tradition, and weaves
          a better future. Become part of the Heritage Sparrow family today.
        </p>
        <button
          className="bg-[#737144] text-white px-12 py-4 tracking-[0.15em] uppercase text-sm font-light hover:bg-[#5f5d3d] transition-all duration-300 hover:shadow-lg"
          onClick={() => navigate(`/product/${encodeURIComponent(categories[0] || "")}`)}
        >
          Explore Our Collection
        </button>
      </div>
    </div>
  );
}

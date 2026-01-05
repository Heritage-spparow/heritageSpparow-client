import React from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/craft/DSC_7360.jpg";

export default function ShringarCampaign() {
  const navigate = useNavigate();

  return ( 
    <main
      className="bg-[#f9f6ef] p-4 flex  text-[#6f6d45]"
      style={{ fontFamily: "'D-DIN', sans-serif" }}
    >
      {/* HERO */}
      <section className="min-h-screen flex items-center px-6 md:px-16 lg:px-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* TEXT */}
          <div className="flex flex-col md:block items-center md:items-start justify-center md:justify-start">
            <p className="text-[11px] flex md:block items-center md:items-start justify-center md:justify-start tracking-[0.4em] uppercase opacity-60">
              Heritage Sparrow Presents
            </p>

            <h1 className="mt-6 flex md:block items-center md:items-start justify-center md:justify-start text-4xl md:text-5xl lg:text-[3.4rem] font-light uppercase tracking-[0.18em] leading-tight">
              Shringar
            </h1>

            <p className="mt-8 max-w-md flex md:block flex-col items-center md:items-start justify-center md:justify-start text-sm md:text-base leading-7 opacity-80">
              Before the mirror , Before the moment.
              <br />
              <p>~ There is Shringar.</p>
                             
            </p>

            <button
              onClick={() => navigate("/campaigns/shringar-album")}
              className="mt-12 inline-block border flex md:block items-center md:items-start justify-center md:justify-start border-[#6f6d45] px-10 py-4 text-xs tracking-[0.35em] uppercase hover:bg-[#6f6d45] hover:text-[#f9f6ef] transition"
            >
              Enter the Album
            </button>
          </div>

          {/* IMAGE */}
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={hero}
              alt="Shringar Campaign"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heritageSpparow from "../assets/heitageSparrow.png"

export default function Footer() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    setShowModal(true);
    setEmail("");
  };

  return (
    <>
      <footer className="w-full">
        <div className="bg-[var(--color-bg)] text-white flex flex-col w-full">
          {/* Brand */}
          <div className="mb-10 px-6 md:px-16 py-4 flex items-center justify-between">
            <h2 className="text-l md:text-2xl  mt-4 font-light">
              HERITAGE SPARROW
            </h2>
            <h2 className="text-l md:text-2xl  mt-3 font-light tracking-wide">
              हेरिटेज स्पैरो
            </h2>
          </div>

          {/* Newsletter */}
          <div className="bg-[#f9f6ef] w-full px-6 md:px-16 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#737144]">
                Stay up to date
              </p>
              <p className="mt-2 text-sm text-[#737144] max-w-md">
                Be the first to hear about new launches, private previews, and
                moments from our world.
              </p>
            </div>

            <div className="w-full md:w-1/3 flex items-end gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full text-[#737144] bg-transparent border-b border-gray-400 focus:outline-none py-2 text-sm"
              />
              <button
                onClick={handleSubscribe}
                className="text-xs tracking-[0.3em] uppercase text-[#737144] hover:opacity-70 transition"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="border-t border-white/20 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-16 py-14">
            <a
              href="mailto:support@heritagesparrow.com"
              className="flex items-center justify-between md:block cursor-pointer hover:opacity-70 transition"
            >
              <p className="text-xs tracking-widest uppercase">Need Help?</p>
              <span className="text-sm md:hidden">↗</span>
            </a>

            <div
              className="flex items-center justify-between md:block cursor-pointer"
              onClick={() => nav("/policies")}
            >
              <p className="text-xs tracking-widest uppercase">
                Policies & FAQs
              </p>
              <span className="text-sm md:hidden">↗</span>
            </div>

            <div className="flex flex-wrap gap-6 md:justify-end text-xs tracking-widest uppercase">
              <a
                href="https://www.instagram.com/heritagesparrow"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/share/1HzwoKE9vN/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70"
              >
                Facebook
              </a>
              <span className="text-white/60 cursor-default">
                Youtube · Coming Soon
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ELEGANT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-[#f9f6ef] max-w-md w-full p-10 text-center relative">
            <p className="text-xs tracking-[0.35em] uppercase text-[#737144]">
              Welcome
            </p>

            <h3 className="mt-6 text-2xl font-light tracking-wide text-[#6f6d45]">
              Thank you for joining us
            </h3>

            <p className="mt-6 text-sm leading-7 text-[#6f6d45] opacity-80">
              You’re now part of our Family. We’ll share our latest collections,
              quiet launches, and moments crafted with care.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-10 text-xs tracking-[0.35em] uppercase border border-[#6f6d45] px-8 py-3 text-[#6f6d45] hover:bg-[#6f6d45] hover:text-[#f9f6ef] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

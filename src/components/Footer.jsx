import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" border-t bg-[var(--color-bg))] px-6 md:px-16 lg:px-24 py-12 font-light tracking-wide">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* ABOUT */}
        <div>
          <h3 className="uppercase text-xl font-bold mb-4 tracking-widest text-white ">
            About Heritage Sparrow
          </h3>
          <p className="text-sm leading-relaxed text-white">
            <strong>Heritage Sparrow</strong> is a contemporary label whose design
            philosophy blends traditional craftsmanship with modern aesthetics.
            Each collection reflects timeless artistry, sustainability, and
            attention to detail.{" "}
            <Link
              to={'/about'}
              className="underline   transition-colors"
            >
              Read more
            </Link>
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="uppercase text-sm font-bold mb-4 tracking-widest text-white ">
            Shop
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <a href="#" className=" ">
                Women
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Men
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Accessories
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Home & Decor
              </a>
            </li>
          </ul>
        </div>

        {/* HELP CENTER */}
        <div>
          <h3 className="uppercase text-sm font-bold mb-4 tracking-widest text-white ">
            Help Center
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <a href="#" className=" ">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Our Stockists
              </a>
            </li>
            <li>
              <a href="/shipping-returns-refund" className=" ">
                Shipping / Returns / Refund Policy
              </a>
            </li>
          </ul>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="uppercase text-sm font-bold mb-4 tracking-widest text-white ">
            Account
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <a href="#" className=" ">
                Login
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Register
              </a>
            </li>
            <li>
              <a href="#" className=" ">
                Track Orders
              </a>
            </li>
          </ul>
        </div>

        {/* TERMS */}
        <div>
          <h3 className="uppercase text-sm font-bold mb-4 tracking-widest text-white ">
            Terms
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <Link to = "/terms-and-conditions" className=" ">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to = "/privacy-policy" className=" ">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-300 pt-10">
        <div>
          <h3 className="uppercase text-sm font-bold mb-4 tracking-widest text-white ">
            Newsletter
          </h3>
          <p className="text-sm text-white mb-4">
            Join our mailing list to receive updates on new collections,
            artisan stories, and exclusive releases from{" "}
            <strong>Heritage Sparrow</strong>.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="E-mail"
              className="border border-neutral-400 text-[#f9f6ef] focus:bg-[#f9f6ef]  px-4 py-2 text-sm focus:outline-none focus:border-[#737144] transition-colors w-full"
            />
            <button
              type="submit"
              className="bg-white text-[var(--color-bg)] font-bold uppercase text-xs tracking-[0.2em] px-6 py-2 hover:bg-[var(--color-bgt)]  cursor-pointer transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 text-[13px] text-white uppercase tracking-widest">
        © 2025 - Heritage Sparrow
      </div>
    </footer>
  );
}

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
              <a href="" className=" ">
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
              <Link to = "/policies" className=" ">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to = "/policies" className=" ">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
  

      {/* COPYRIGHT */}
      <div className="mt-10 text-[13px] text-white uppercase tracking-widest">
        © 2025 - Heritage Sparrow
      </div>
    </footer>
  );
}

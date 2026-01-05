import { NavLink, Outlet } from "react-router-dom";

const links = [
  {
    label: "Privacy Policy",
    to: "/policies/privacy",
  },
  {
    label: "Terms & Conditions",
    to: "/policies/terms",
  },
  {
    label: "Shipping / Returns / Refund Policy",
    to: "/policies/shipping-returns-refund",
  },
];

export default function PolicyLayout() {
  return (
    <div className="bg-[#f4f0e5] min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="md:flex md:space-x-10">
          {/* Sidebar */}
          <aside className="md:w-1/4 mb-8 md:mb-0">
            <nav className="space-y-3 text-sm tracking-wide">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "block border-l-2 pl-4 py-2 transition-colors duration-150",
                      isActive
                        ? "border-[#7f7b3b] text-[#7f7b3b] font-medium bg-[#f9f6ee]"
                        : "border-transparent text-gray-800 hover:border-[#7f7b3b] hover:text-[#7f7b3b]",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="md:w-3/4">
            <div className="bg-[#fbf8f0] border border-[#ded5c0] shadow-sm px-6 md:px-10 py-8 md:py-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

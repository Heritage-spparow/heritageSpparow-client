import { NavLink, Outlet } from "react-router-dom";

const links = [
  {
    label: "Shipping / Returns / Refund Policy",
    to: "/shipping-returns-refund",
  }, 
  {
    label: "Terms & Conditions",
    to: "/terms-and-conditions",
  },
  {
    label: "Privacy Policy",
    to: "/privacy-policy",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="text-sm leading-relaxed text-gray-800">
      <h1 className="text-xl md:text-2xl tracking-[0.16em] text-[#58552c] mb-6 uppercase">
        Privacy Policy
      </h1>

      <section className="mb-4">
        <p>
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your data when you visit or make a purchase from our website.
        </p>
      </section>

      <section className="mb-4">
        <p>
          The information we collect may include your name, email address,
          contact number, shipping address, billing details, and order history.
          This information is used strictly for processing orders, providing
          customer support, and improving our services.
        </p>
      </section>

      <section className="mb-4">
        <p>
          We do not sell, rent, or trade your personal information. Your data is
          shared only with trusted third-party service providers such as payment
          gateways and logistics partners, solely for the purpose of order
          fulfillment and transaction processing.
        </p>
      </section>

      <section className="mb-4">
        <p>
          All payment transactions are processed through secure and encrypted
          platforms. We do not store your complete payment details on our
          servers.
        </p>
      </section>

      <section className="mb-4">
        <p>
          By using our website, you consent to the collection and use of
          information in accordance with this Privacy Policy. We may update this
          policy from time to time, and any changes will be reflected on this
          page.
        </p>
      </section>

      <section>
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us at our official support email.
        </p>
      </section>
    </section>
  );
}

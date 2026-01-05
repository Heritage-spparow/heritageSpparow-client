export default function ShippingReturnsRefundPage() {
  return (
    <section className="text-sm leading-relaxed text-gray-800">
      <h1 className="text-xl md:text-2xl tracking-[0.16em] text-[#58552c] mb-6 uppercase">
        Shipping / Returns / Refund Policy
      </h1>

      {/* IMPORTANT UPDATE */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Important Update
        </h2>
        <p className="mb-2">
          All orders are shipped <span className="font-semibold">1 week after the order is placed.</span>
        </p>
        <p>
          If you have any specific urgency, please write to us at{" "}
          <a
            href="mailto:support@heritagesparrow.com"
            className="underline hover:text-[#7f7b3b]"
          >
            support@heritagesparrow.com
          </a>{" "}
          or WhatsApp us at{" "}
          <a
            href="https://wa.me/+917973926474"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#7f7b3b]"
          >
            +91 93112 33304
          </a>.
        </p>
      </section>

      {/* DOMESTIC SHIPPING */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Domestic Shipping (Within India)
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Estimated delivery time: <strong>8–12 days</strong> from the date of dispatch.</li>
          <li>Shipping within India is <strong>free</strong>.</li>
          <li>
            If you have an urgent requirement, please reach out to our team and we will
            try our best to accommodate your request.
          </li>
        </ul>
      </section>

      {/* INTERNATIONAL SHIPPING */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          International Shipping
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Standard shipping:</strong> approximately <strong>10–15 days</strong>{" "}
            from the date of dispatch.
          </li>
          <li>
            <strong>Priority shipping:</strong> delivery timelines depend on the destination
            country.
          </li>
          <li>
            Final shipping charges are calculated at checkout based on your delivery address
            and selected service.
          </li>
        </ul>
      </section>

      {/* RETURNS & EXCHANGES */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Returns & Exchanges
        </h2>
        <p className="mb-2">
          We want you to be satisfied with your purchase. If you receive a product that is
          damaged in transit or incorrect, please contact us within{" "}
          <strong>3 days</strong> of delivery with your order number and photographs of the
          issue.
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>Items must be unused, unworn, and in their original packaging.</li>
          <li>
            Once your return is approved, we will guide you through the exchange or credit
            process.
          </li>
          <li>
            We do not accept returns for products that show signs of wear, damage caused by
            the customer, or items purchased on final sale (if marked).
          </li>
        </ul>
        <p>
          For any return or exchange queries, please reach out to us at{" "}
          <a
            href="mailto:hello@gullylabs.com"
            className="underline hover:text-[#7f7b3b]"
          >
            hello@gullylabs.com
          </a>.
        </p>
      </section>

      {/* REFUND POLICY / HANDMADE NATURE */}
      <section>
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Refund Policy & Handmade Nature of Our Pieces
        </h2>
        <p className="mb-2">
          Our pieces often include natural dyes, vintage kantha, hand-done embroidery,
          and other artisanal techniques. Slight variations, subtle discolourations, or
          minor imperfections are <span className="font-semibold">not defects</span> but
          a hallmark of the handmade process and should be embraced as part of the
          garment’s story.
        </p>
        <p className="mb-2">
          Refunds are typically issued only in cases of confirmed manufacturing defects or
          if we are unable to fulfill your order. In other cases, we may offer store
          credit or an exchange, subject to review.
        </p>
        <p>
          Each piece is crafted with care, and we appreciate your understanding of the
          uniqueness inherent in handmade products.
        </p>
      </section>
    </section>
  );
}

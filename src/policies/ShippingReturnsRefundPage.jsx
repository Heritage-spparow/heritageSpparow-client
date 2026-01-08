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
            +91 7973926474
          </a>
          .
        </p>
        <p className=" leading-relaxed font-medium text-[#7f7b3b]">
          Please note: once an order has been placed, it cannot be cancelled.
        </p>
      </section>

      {/* DOMESTIC SHIPPING */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Domestic Shipping (Within India)
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Estimated delivery time: <strong>8–12 working days</strong> from the
            date of dispatch.
          </li>
          <li>
            Shipping within India is <strong>free</strong>.
          </li>
          <li>
            If you have an urgent requirement, please reach out to our team and
            we will try our best to accommodate your request.
          </li>
        </ul>
      </section>

      {/* INTERNATIONAL SHIPPING */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          International Shipping
        </h2>

        <p className="text-sm leading-relaxed">
          At the moment, we do not offer international shipping.
        </p>

        <p className="text-sm mt-2 leading-relaxed">
          If you are located outside India and wish to place an order, please
          get in touch with us at{" "}
          <a
            href="mailto:support@heritagesparrow.com"
            className="underline font-medium"
          >
            support@heritagesparrow.com
          </a>
          . Our team will be happy to assist you with availability and shipping
          options.
        </p>
      </section>

      {/* RETURNS & EXCHANGES */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Returns & Exchanges
        </h2>

        <p className="mb-2 leading-relaxed">
          We want you to be completely satisfied with your purchase. If you
          receive a product that is damaged during transit or if an incorrect
          item is delivered, please contact us within <strong>3 days</strong> of
          delivery. Kindly share your order number along with clear photographs
          of the issue.
        </p>

        <p className="mb-2 leading-relaxed">
          Once we receive your return request, our team will carefully review
          the product after it is returned to us. If the item qualifies under
          our exchange policy or is found to have a genuine manufacturing
          defect, we will proceed with the exchange or resolution. If the
          product does not meet these criteria, we will not be able to take the
          request forward.
        </p>

        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            Items must be unused, unworn, and returned in their original
            packaging.
          </li>
          <li>
            Exchanges or credits are processed only after quality inspection
            approval.
          </li>
          <li>
            We do not accept returns for products showing signs of wear,
            customer-caused damage, or items marked as final sale.
          </li>
        </ul>

        <p>
          For any return or exchange-related queries, please reach out to us at{" "}
          <a
            href="mailto:support@heritagesparrow.com"
            className="underline hover:text-[#7f7b3b]"
          >
            support@heritagesparrow.com
          </a>
          .
        </p>
      </section>

      {/* REFUND POLICY / HANDMADE NATURE */}
      <section>
        <h2 className="font-semibold mb-2 tracking-wide text-[#7f7b3b]">
          Refund Policy & Handmade Nature of Our Pieces
        </h2>
        <p className="mb-2">
          Our juttis are handcrafted using traditional techniques and may
          feature a mix of hand embroidery, pearls, motifs, and artisanal
          threads. Slight variations in colour, texture, or placement are{" "}
          <span className="font-semibold">not flaws</span> but a natural
          hallmark of handmade pieces from Heritage Sparrow, making each pair
          unique.
        </p>

        <p className="mb-2">
          As every pair is made with care and individuality, we do not accept
          returns. Exchanges are offered only in the case of verified
          manufacturing defects or if the order cannot be fulfilled, subject to
          review.
        </p>

        <p>
          We encourage you to embrace these subtle variations as part of the
          story and soul of handcrafted footwear.
        </p>
      </section>
    </section>
  );
}

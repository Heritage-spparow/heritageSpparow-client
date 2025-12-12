export default function TermsConditionsPage() {
  return (
    <section className="text-sm leading-relaxed text-gray-800">
      <h1 className="text-xl md:text-2xl tracking-[0.16em] text-[#58552c] mb-6 uppercase">
        Terms & Conditions
      </h1>

      <section className="mb-4">
        <p>
          These Terms & Conditions govern your use of our website and services.
          By accessing or using this site, you agree to be bound by these terms.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">1. Orders & Payments</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            All orders placed on the website are subject to availability and acceptance.
          </li>
          <li>
            Prices are listed in INR unless stated otherwise and are inclusive of
            applicable taxes, where required.
          </li>
          <li>
            Payment must be completed at checkout using the available payment options.
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">2. Product Information</h2>
        <p className="mb-2">
          We make every effort to display product colours, details, and descriptions
          accurately. However, slight differences may occur due to screen settings, lighting,
          and the handmade nature of our products.
        </p>
        <p>
          Small irregularities, variations in colour, or minor imperfections are expected
          characteristics of artisanal pieces and do not qualify as defects.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">3. Shipping, Returns & Refunds</h2>
        <p>
          Shipping timelines, return eligibility, and refund conditions are detailed in our{" "}
          <a
            href="/shipping-returns-refund"
            className="underline hover:text-[#7f7b3b]"
          >
            Shipping / Returns / Refund Policy
          </a>. By placing an order, you agree to those terms as well.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">4. Intellectual Property</h2>
        <p>
          All content on this website – including images, text, graphics, logos, and
          designs – is owned by or licensed to us and is protected by applicable
          intellectual-property laws. You may not reproduce, distribute, modify, or
          commercially exploit any content without prior written permission.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">5. Use of the Website</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You agree not to misuse the website or interfere with its security.</li>
          <li>
            You are responsible for maintaining the confidentiality of your account
            information and for all activity under your account.
          </li>
          <li>
            We reserve the right to refuse service, cancel orders, or block accounts in
            cases of suspected fraud, abuse, or violation of these terms.
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect,
          incidental, or consequential damages arising from your use of the site or
          purchase of products. Our maximum liability, if any, will be limited to the
          value of the order in question.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">7. Changes to Terms</h2>
        <p>
          We may update these Terms & Conditions from time to time. Any changes will be
          posted on this page, and your continued use of the website constitutes
          acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-2 text-[#7f7b3b]">8. Contact</h2>
        <p>
          For any questions regarding these Terms & Conditions, please contact us at{" "}
          <a
            href="mailto:hello@gullylabs.com"
            className="underline hover:text-[#7f7b3b]"
          >
            hello@gullylabs.com
          </a>.
        </p>
      </section>
    </section>
  );
}

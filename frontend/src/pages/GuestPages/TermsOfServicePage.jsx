import Footer from "../../components/Footer.jsx";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-[#fffefc]">
      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-[#f7e9b8] to-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#860809] mb-6">Terms of Service</h1>
            <p className="text-xl text-[#030105] leading-relaxed">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-sm text-[#82695b] mt-4">Effective Date: September 20, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">1. Agreement to Terms</h2>
              <p className="text-[#030105]">
                By accessing or using our website and services, you agree to be bound by these Terms of Service and our
                Privacy Policy. If you do not agree, please discontinue use of our services.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">2. Accounts & Security</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must notify us immediately of any unauthorized use or breach.</li>
                <li>We may suspend or terminate accounts for violations of these terms.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">3. Orders & Availability</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>All orders are subject to acceptance and availability.</li>
                <li>Prices, promotions, and product information may change without prior notice.</li>
                <li>We reserve the right to limit or cancel quantities at our discretion.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">4. Payments</h2>
              <p className="text-[#030105]">
                You agree to provide accurate billing information. Payments are processed by our third-party provider.
                If a transaction is declined or reversed, we may suspend fulfillment until resolved.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">5. Delivery & Risk of Loss</h2>
              <p className="text-[#030105]">
                Risk of loss transfers upon delivery to the address provided or upon pickup. Please inspect items upon
                receipt and report issues promptly in accordance with our Replacement Policy.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">6. Acceptable Use</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Do not misuse the site or attempt unauthorized access.</li>
                <li>Do not engage in fraud, abusive behavior, or activities that harm others.</li>
                <li>Respect applicable laws and third-party rights at all times.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">7. Intellectual Property</h2>
              <p className="text-[#030105]">
                All content, trademarks, and logos are owned by us or our licensors and are protected by law. You may not
                use these without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">8. Disclaimers & Limitation of Liability</h2>
              <p className="text-[#030105]">
                Services are provided "as is" without warranties of any kind. To the maximum extent permitted by law, we
                are not liable for indirect, incidental, or consequential damages.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">9. Termination</h2>
              <p className="text-[#030105]">
                We may suspend or terminate access to services at any time for any reason, including violations of these
                terms.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">10. Changes to Terms</h2>
              <p className="text-[#030105]">
                We may update these terms from time to time. Continued use after changes constitutes acceptance of the
                updated terms.
              </p>
            </div>

            <div className="bg-[#f8f3ed] p-6 rounded-xl">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">11. Contact</h2>
              <p className="text-[#030105]">
                For questions about these Terms, please contact us via the Contact page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;



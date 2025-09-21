import Footer from "../../components/Footer.jsx";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#fffefc]">
      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-[#f7e9b8] to-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#860809] mb-6">Privacy Policy</h1>
            <p className="text-xl text-[#030105] leading-relaxed">
              We value your privacy. This policy explains what we collect, how we use it, and your choices.
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
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">1. Information We Collect</h2>
              <div className="space-y-2 text-[#030105]">
                <p>We collect information you provide directly and data collected automatically when you use our services.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Account details: name, email, password (hashed), phone, address</li>
                  <li>Order details: products, amounts, delivery preferences</li>
                  <li>Payment details processed by our provider (we do not store card data)</li>
                  <li>Device and usage data: IP, browser, pages viewed</li>
                  <li>Communications: messages to support and chatbot interactions</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Process orders, payments, and deliveries</li>
                <li>Manage your account, authentication, and security</li>
                <li>Provide customer support and service updates</li>
                <li>Improve our website, products, and user experience</li>
                <li>Detect, prevent, and address fraud or abuse</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">3. Cookies & Tracking</h2>
              <p className="text-[#030105]">
                We use cookies to keep you logged in, remember preferences, and measure site performance. You may disable
                cookies in your browser, but some features may not work as intended.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">4. Payments</h2>
              <p className="text-[#030105]">
                Payments are processed securely by our payment partner. We do not store full card details on our servers.
                Transaction metadata may be retained to fulfill orders and for accounting.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">5. Sharing of Information</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Delivery partners for shipping and order fulfillment</li>
                <li>Payment processors for checkout and refunds</li>
                <li>Service providers (e.g., cloud hosting, analytics) under contract</li>
                <li>When required by law or to protect rights and safety</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">6. Data Security & Retention</h2>
              <p className="text-[#030105]">
                We implement technical and organizational measures to protect your data. We keep information only as long
                as necessary for the purposes described or as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">7. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Access, update, or delete your account information</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Object to or restrict certain processing</li>
                <li>Request a copy of your data (where applicable)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">8. Children's Privacy</h2>
              <p className="text-[#030105]">
                Our services are not directed to children under 13. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">9. Updates to This Policy</h2>
              <p className="text-[#030105]">
                We may update this policy from time to time. We will post the latest version here and update the effective date.
              </p>
            </div>

            <div className="bg-[#f8f3ed] p-6 rounded-xl">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">10. Contact Us</h2>
              <p className="text-[#030105]">
                For privacy inquiries or requests, please visit our Contact page or email our support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;



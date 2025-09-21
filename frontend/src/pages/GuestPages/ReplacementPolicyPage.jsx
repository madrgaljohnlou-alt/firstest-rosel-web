import Footer from "../../components/Footer.jsx";

const ReplacementPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#fffefc]">
      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-[#f7e9b8] to-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#860809] mb-6">Product Replacement Policy</h1>
            <p className="text-xl text-[#030105] leading-relaxed">
              Clear guidelines for requesting replacements due to damage, incorrect items, or quality concerns.
            </p>
            <p className="text-sm text-[#82695b] mt-4">Effective Date: September 20, 2025</p>
          </div>
        </div>
      </section>

      {/* Eligibility & Timeframe */}
      <section className="py-16 bg-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-[#f8f3ed] p-6 rounded-xl shadow">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">Eligibility</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Damaged or compromised packaging upon delivery or pickup</li>
                <li>Incorrect item received versus order confirmation</li>
                <li>Missing items from the order</li>
                <li>Quality concerns on first opening (off-odor, unusual color/texture)</li>
              </ul>
            </div>
            <div className="bg-[#f7e9b8] p-6 rounded-xl shadow">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">Timeframe</h2>
              <p className="text-[#030105]">
                Submit a replacement request within 24 hours of receiving your order. Requests beyond this
                window may not be eligible due to the perishable nature of frozen goods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is not covered */}
      <section className="py-16 bg-[#f8f3ed]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#860809] mb-6">Not Covered</h2>
            <ul className="list-disc pl-5 space-y-2 text-[#030105]"><li>Improper handling or storage after delivery (e.g., not kept frozen)</li>
              <li>Normal variations in color, marbling, or size within product specifications</li>
              <li>Change of mind or preference after opening</li>
              <li>Products bought on clearance with disclosed imperfections</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to request a replacement */}
      <section className="py-16 bg-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-[#f8f3ed] p-6 rounded-xl shadow">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">How to Request</h2>
              <ol className="list-decimal pl-5 space-y-2 text-[#030105]">
                <li>Log in to your account and open Track Orders.</li>
                <li>Select the affected order and choose “Replacement Request”.</li>
                <li>Provide details and upload clear photos/videos (packaging, labels, product).</li>
                <li>Submit within 24 hours of receipt for review.</li>
              </ol>
            </div>
            <div className="bg-[#f7e9b8] p-6 rounded-xl shadow">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">Required Proof</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Order number and delivery/pickup date</li>
                <li>Photos of outer packaging and product condition</li>
                <li>Short description of the issue (e.g., wrong item, damaged, missing)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Review & Outcomes */}
      <section className="py-16 bg-[#f8f3ed]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-[#fffefc] p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold text-[#a31f17] mb-2">Review Timeline</h3>
              <p className="text-[#030105]">Most requests are reviewed within 1–2 business days.</p>
            </div>
            <div className="bg-[#fffefc] p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold text-[#a31f17] mb-2">Possible Outcomes</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>Replacement of the affected item(s)</li>
                <li>Partial replacement or store credit when appropriate</li>
                <li>Request for additional information if evidence is unclear</li>
              </ul>
            </div>
            <div className="bg-[#fffefc] p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold text-[#a31f17] mb-2">Final Decisions</h3>
              <p className="text-[#030105]">Quality assessments and eligibility determinations are final once completed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Fees */}
      <section className="py-16 bg-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-[#f8f3ed] p-6 rounded-xl shadow">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">Logistics</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#030105]">
                <li>For delivery issues, we may arrange courier pickup or a re-delivery.</li>
                <li>For pickup orders, replacements are usually claimed at the store.</li>
              </ul>
            </div>
            <div className="bg-[#f7e9b8] p-6 rounded-xl shadow">
              <h2 className="text-3xl font-bold text-[#a31f17] mb-4">Fees</h2>
              <p className="text-[#030105]">
                Eligible replacements are provided at no additional cost. If the request is not eligible, delivery or
                handling fees may apply for return/re-delivery options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-[#f7e9b8]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Frozen Goods",
                text: "Keep products frozen until use. Do not refreeze thawed items.",
              },
              {
                title: "Inspection on Receipt",
                text: "Please inspect items upon receipt and report issues immediately.",
              },
              {
                title: "Contact Support",
                text: "If you cannot submit online, contact us via the Contact page for assistance.",
              },
            ].map((note) => (
              <div key={note.title} className="bg-[#fffefc] p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold text-[#a31f17] mb-2">{note.title}</h3>
                <p className="text-[#030105]">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReplacementPolicyPage;




import Footer from "../../components/Footer.jsx";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#fffefc]">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-[#f7e9b8] to-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#860809] mb-6">
              About Rosel
            </h1>
            <p className="text-xl text-[#030105] leading-relaxed">
              Your trusted partner in premium frozen meat products
            </p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 bg-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-[#a31f17] mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-[#030105] leading-relaxed">
                  <p>
                    Rosel Frozen Meat Products Trading was founded with a simple yet powerful mission: 
                    to provide the highest quality frozen meat products to families and businesses across 
                    the Philippines. Since our establishment, we have been committed to delivering 
                    premium quality meat that meets the highest standards of food safety and freshness.
                  </p>
                  <p>
                    Our journey began with the vision of making premium frozen meat accessible to everyone, 
                    ensuring that every customer receives products that are not only delicious but also 
                    safe, nutritious, and sourced from the most reliable suppliers in the industry.
                  </p>
                  <p>
                    Today, we continue to uphold our founding principles while embracing innovation and 
                    technology to better serve our customers and maintain our position as a trusted leader 
                    in the frozen meat industry.
                  </p>
                </div>
              </div>
              <div className="bg-[#f7e9b8] p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#860809] mb-4">Our Mission</h3>
                <p className="text-[#030105] mb-6">
                  To provide premium quality frozen meat products that exceed customer expectations 
                  while maintaining the highest standards of food safety, quality, and service.
                </p>
                <h3 className="text-2xl font-bold text-[#860809] mb-4">Our Vision</h3>
                <p className="text-[#030105]">
                  To be the leading frozen meat supplier in the Philippines, recognized for our 
                  commitment to quality, innovation, and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-[#f7e9b8]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#860809] text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center bg-[#fffefc] p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-[#fffefc]">✓</span>
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-4">Quality First</h3>
                <p className="text-[#030105]">
                  We never compromise on quality. Every product undergoes rigorous quality checks 
                  to ensure it meets our high standards.
                </p>
              </div>
              <div className="text-center bg-[#fffefc] p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-[#fffefc]">❤</span>
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-4">Customer Trust</h3>
                <p className="text-[#030105]">
                  Building lasting relationships through transparency, reliability, and exceptional 
                  customer service.
                </p>
              </div>
              <div className="text-center bg-[#fffefc] p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-[#fffefc]">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-4">Innovation</h3>
                <p className="text-[#030105]">
                  Continuously improving our processes and services to better meet the evolving 
                  needs of our customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[#fffefc]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#860809] text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="/glasses.png" 
                    alt="Team Member 1" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-2">Sarah Johnson</h3>
                <p className="text-[#030105] font-semibold mb-2">CEO & Founder</p>
                <p className="text-[#030105] text-sm">
                  With over 15 years in the food industry, Sarah leads our company with passion 
                  and dedication to quality.
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="/jackets.jpg" 
                    alt="Team Member 2" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-2">Michael Chen</h3>
                <p className="text-[#030105] font-semibold mb-2">Operations Manager</p>
                <p className="text-[#030105] text-sm">
                  Michael ensures our operations run smoothly and efficiently, maintaining our 
                  high standards of service.
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="/jeans.jpg" 
                    alt="Team Member 3" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-2">Maria Rodriguez</h3>
                <p className="text-[#030105] font-semibold mb-2">Quality Assurance</p>
                <p className="text-[#030105] text-sm">
                  Maria oversees our quality control processes, ensuring every product meets 
                  our rigorous standards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="/shoes.jpg" 
                    alt="Team Member 4" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#a31f17] mb-2">David Kim</h3>
                <p className="text-[#030105] font-semibold mb-2">Customer Relations</p>
                <p className="text-[#030105] text-sm">
                  David leads our customer service team, ensuring every customer receives 
                  exceptional support and care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-[#f7e9b8]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#860809] text-center mb-12">
              Why Choose Rosel?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-[#fffefc]">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-[#a31f17] mb-2">Premium Quality</h3>
                <p className="text-[#030105] text-sm">
                  Only the finest cuts of meat from trusted suppliers
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-[#fffefc]">🚚</span>
                </div>
                <h3 className="text-lg font-bold text-[#a31f17] mb-2">Fast Delivery</h3>
                <p className="text-[#030105] text-sm">
                  Quick and reliable delivery to your doorstep
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-[#fffefc]">🔒</span>
                </div>
                <h3 className="text-lg font-bold text-[#a31f17] mb-2">Food Safety</h3>
                <p className="text-[#030105] text-sm">
                  Strict adherence to food safety standards and regulations
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#860809] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-[#fffefc]">💬</span>
                </div>
                <h3 className="text-lg font-bold text-[#a31f17] mb-2">24/7 Support</h3>
                <p className="text-[#030105] text-sm">
                  Round-the-clock customer support for all your needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
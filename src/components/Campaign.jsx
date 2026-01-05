import React, { useState } from 'react';
import smaple from "../assets/sample.jpeg";
export default function CampaignPage() {
  const [email, setEmail] = useState('');

  const campaignData = {
    hero: {
      image: smaple
    },
    featured: [
      {
        id: 1,
        category: "Juttis",
        title: "Festive romance retold in jewel tones and a contemporary palette.",
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=1000&fit=crop",
        cta: "SHOP NOW"
      },
      {
        id: 2,
        category: "Heels",
        title: "Striking blocks, chic tie-ups and statement wedges for every occasion.",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop",
        cta: "SHOP NOW"
      },
      {
        id: 3,
        category: "Purses",
        title: "New vanity bags, reinvented potlis and carry-alls with indulgent details.",
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=1000&fit=crop",
        cta: "SHOP NOW"
      }
    ],
    newArrivals: [
      {
        id: 1,
        name: "BANO - GOLD (HEEL)",
        price: "₹ 10,990",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop"
      },
      {
        id: 2,
        name: "LAILA - DEEP RED (HEEL)",
        price: "₹ 8,990",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=800&fit=crop"
      },
      {
        id: 3,
        name: "LAILA - MOCHA (HEEL)",
        price: "₹ 8,990",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=800&fit=crop"
      },
      {
        id: 4,
        name: "ZAIBA (HEEL)",
        price: "₹ 8,990",
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=800&fit=crop"
      }
    ]
  };

  const handleEmailSubmit = () => {
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-white overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        <div className="absolute inset-0">
          <img
            src={campaignData.hero.image}
            alt={campaignData.hero.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        <div className="relative z-10 w-full h-full px-6 sm:px-12 md:px-24 flex items-center justify-center text-center">
          <div className="max-w-2xl text-white">
            <h1 
              className="font-light tracking-wider mb-2"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: '300'
              }}
            >
              {campaignData.hero.title}
            </h1>
            <p className="text-xl sm:text-2xl tracking-widest mb-8 font-light">
              {campaignData.hero.subtitle}
            </p>
            <div className="w-16 h-px bg-white mx-auto mb-8" />
            <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-wide mb-10 opacity-95">
              {campaignData.hero.description}
            </p>
            <button className="group relative border border-white/80 px-8 py-3 tracking-widest text-xs sm:text-sm font-light transition-all duration-300 hover:bg-white hover:text-black overflow-hidden">
              <span className="relative z-10">EXPLORE COLLECTION</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Collections Banner */}
      <div className="w-full py-4 bg-gray-50 border-t border-b border-gray-200">
        <p className="text-center text-sm tracking-wide text-gray-700">
          Shop New: Festive Collection
        </p>
      </div>

      {/* Featured Categories - 3 Column Grid */}
      <section className="w-full py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaignData.featured.map((item) => (
              <div key={item.id} className="group relative overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.category}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.category}
                  </h3>
                  <p className="text-sm font-light leading-relaxed mb-4 opacity-90">
                    {item.title}
                  </p>
                  <button className="self-start border border-white/80 px-6 py-2 text-xs tracking-widest font-light transition-all duration-300 hover:bg-white hover:text-black">
                    {item.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New In Section */}
      <section className="w-full py-12 md:py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              New In
            </h2>
            <div className="w-12 h-px bg-gray-400 mx-auto mb-6" />
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The latest edition unfolds as an homage to love, craft, and timeless modernity, rooted in Indian heritage.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {campaignData.newArrivals.map((product) => (
              <div key={product.id} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-white mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-xs md:text-sm tracking-wide text-gray-800 mb-1 font-light">
                  {product.name}
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  {product.price}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="border border-gray-800 px-8 py-3 text-xs tracking-widest font-light transition-all duration-300 hover:bg-gray-800 hover:text-white">
              VIEW ALL
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Join Our Community
          </h3>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Be the first to know about new collections, exclusive offers, and styling tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-gray-800 transition-colors"
            />
            <button
              onClick={handleEmailSubmit}
              className="px-8 py-3 bg-gray-800 text-white text-xs tracking-widest font-light transition-all duration-300 hover:bg-gray-700"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <div className="w-full py-4 bg-gray-800 text-white">
        <p className="text-center text-xs tracking-wide">
          © 2026 Your Brand. Crafted with love and tradition.
        </p>
      </div>
    </div>
  );
}
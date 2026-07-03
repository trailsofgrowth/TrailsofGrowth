import Link from 'next/link'

const DESTINATIONS = [
  { name: 'Langtang Valley', country: 'Nepal', category: 'Trekking', gradient: 'from-teal-800 to-teal-500' },
  { name: 'Pokhara', country: 'Nepal', category: 'Budget', gradient: 'from-blue-800 to-blue-500' },
  { name: 'Bhaktapur', country: 'Nepal', category: 'Culture', gradient: 'from-orange-800 to-orange-500' },
  { name: 'Spiti Valley', country: 'India', category: 'Hidden Gem', gradient: 'from-slate-800 to-slate-500' },
  { name: 'Ella', country: 'Sri Lanka', category: 'Budget', gradient: 'from-indigo-800 to-indigo-500' },
  { name: 'Darjeeling', country: 'India', category: 'Culture', gradient: 'from-amber-800 to-amber-500' },
]

const POSTS = [
  { title: 'The Ultimate Langtang Valley Trek Guide 2026', category: 'Trekking', gradient: 'from-emerald-800 to-emerald-500' },
  { title: 'Eating in Kathmandu for Under $5 a Day', category: 'Food', gradient: 'from-orange-800 to-orange-500' },
  { title: 'Biking Through Mustang: Complete Guide', category: 'Biking', gradient: 'from-blue-800 to-blue-500' },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
<section className="relative py-24 px-6 text-center">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/Manaslu_View.jpg')" }}
  />
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content */}
  <div className="relative z-10 max-w-2xl mx-auto">
    <span className="inline-block bg-white/10 border border-white/20 text-[#F59E0B] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
      🌿 Nepal & South Asia
    </span>
    <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif leading-tight mb-5">
      Discover <span className="text-[#F59E0B]">Hidden Gems</span><br />
      Like Never Before
    </h1>
    <p className="text-white/85 text-lg mb-10 leading-relaxed">
      Authentic travel guides, budget breakdowns, and local experiences
      for explorers who dare to go beyond the tourist trail.
    </p>
    <div className="flex gap-3 justify-center flex-wrap">
      <Link href="/destinations" className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-7 py-3 rounded-lg transition-all">
        🗺️ Explore Destinations
      </Link>
      <Link href="/planner" className="border-2 border-white/50 hover:border-white text-white font-semibold px-7 py-3 rounded-lg transition-all hover:bg-white/10">
        ✈️ Plan Your Route
      </Link>
    </div>
  </div>
</section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif">Featured Destinations</h2>
              <p className="text-gray-500 mt-1">Handpicked hidden gems across Nepal & South Asia</p>
            </div>
            <Link href="/destinations" className="text-[#1B4332] font-semibold border border-[#1B4332] px-4 py-2 rounded-lg hover:bg-[#D8F3DC] transition-all text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESTINATIONS.map((d) => (
              <div key={d.name} className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${d.gradient} flex items-end p-4`}>
                  <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md">
                    🇳🇵 {d.country}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{d.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full">
                      {d.category}
                    </span>
                    <Link href="/blog" className="bg-[#1B4332] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#2D6A4F] transition-all">
                      Read Guide
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WANDERWISE */}
      <section className="bg-[#1B4332] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-white mb-2">Why TrailsofGrowth?</h2>
          <p className="text-white/65 mb-8">We do travel differently</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🗺️', title: 'Hidden Destinations', desc: 'Off-the-beaten-path spots locals love but tourists haven\'t found yet.' },
              { icon: '💰', title: 'Budget Travel', desc: 'Real cost-breakdown guides for students and first-time travellers.' },
              { icon: '🍽️', title: 'Local Food & Culture', desc: 'Authentic food guides written by people who actually live there.' },
              { icon: '🤝', title: 'Community Tips', desc: 'Meetups, shared experiences, and honest reviews from real travellers.' },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 border border-white/15 rounded-xl p-6 hover:bg-white/15 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg font-serif mb-2">{f.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST BLOG POSTS */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif">Latest from the Blog</h2>
              <p className="text-gray-500 mt-1">Fresh guides published this week</p>
            </div>
            <Link href="/blog" className="text-[#1B4332] font-semibold border border-[#1B4332] px-4 py-2 rounded-lg hover:bg-[#D8F3DC] transition-all text-sm">
              All Articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {POSTS.map((post) => (
              <div key={post.title} className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${post.gradient}`}></div>
                <div className="p-4">
                  <h3 className="font-bold text-base leading-snug mb-3">{post.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <Link href="/blog" className="text-[#1B4332] text-sm font-semibold border border-[#1B4332] px-3 py-1.5 rounded-lg hover:bg-[#D8F3DC] transition-all">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#FEF3C7] border-t-4 border-[#F59E0B] py-12 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-bold font-serif mb-2">Get Weekly Travel Guides 📬</h3>
          <p className="text-gray-500 mb-6">Hidden gems, budget tips, and seasonal picks — straight to your inbox.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-3 rounded-lg border border-gray-200 text-sm w-full sm:w-72 outline-none focus:border-[#F59E0B]"
            />
            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm">
              Subscribe Free
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
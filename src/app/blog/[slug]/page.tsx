'use client'
import Link from 'next/link'

const POST = {
  title: 'The Ultimate Langtang Valley Trek Guide 2026',
  author: 'Bhumika',
  date: 'June 1, 2026',
  category: 'Trekking',
  readTime: '8 min read',
  gradient: 'from-emerald-800 to-emerald-500',
}

const RELATED = [
  { title: 'Annapurna Base Camp Trek Guide', category: 'Trekking', gradient: 'from-blue-800 to-blue-500', slug: 'annapurna-base-camp' },
  { title: 'Best Teahouses on Langtang Route', category: 'Budget', gradient: 'from-amber-800 to-amber-500', slug: 'langtang-teahouses' },
  { title: 'Kathmandu to Syabrubesi: All Options', category: 'Transport', gradient: 'from-slate-800 to-slate-500', slug: 'kathmandu-syabrubesi' },
]

export default function BlogPostPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-[#1B4332]">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-[#1B4332]">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-[#1B4332] font-medium">{POST.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT — Article content */}
        <div className="lg:col-span-2">
          {/* Category badge */}
          <span className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full">
            {POST.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl font-bold font-serif leading-tight mt-4 mb-4">
            {POST.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 flex-wrap">
            <span>✍️ <strong className="text-gray-600">{POST.author}</strong></span>
            <span>📅 {POST.date}</span>
            <span>⏱ {POST.readTime}</span>
          </div>

          {/* Featured image */}
          <div className={`h-72 bg-gradient-to-br ${POST.gradient} rounded-xl mb-8 flex items-center justify-content-center`}></div>

          {/* Article body */}
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed mb-5">
              The Langtang Valley Trek is one of Nepal most rewarding and most overlooked adventures.
              While crowds flock to Everest Base Camp and the Annapurna Circuit, Langtang remains
              wonderfully quiet yet offers panoramas that rival anything in the Himalayas.
            </p>

            {/* Tip box */}
            <div className="border-l-4 border-[#1B4332] bg-[#D8F3DC] px-5 py-4 rounded-r-xl my-6 italic text-[#1B4332]">
              💡 Pro tip: Go in October–November for crystal-clear skies, or April–May for
              rhododendron forests in full bloom. Avoid monsoon season (June–August).
            </div>

            <h2 className="text-2xl font-bold font-serif mt-8 mb-4">Getting There</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              From Kathmandu Balaju bus park, take a local bus to Syabrubesi (7–9 hours, ~NPR 500).
              Jeeps are faster at 6 hours and cost around NPR 1,500. The trek officially begins
              at Syabrubesi at 1,550m.
            </p>

            <h2 className="text-2xl font-bold font-serif mt-8 mb-4">Permits You Need</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              You need two permits: the TIMS card (NPR 2,000) and the Langtang National Park
              Entry Permit (NPR 3,000). Both can be obtained in Kathmandu at the Nepal Tourism
              Board office.
            </p>

            <h3 className="text-xl font-bold font-serif mt-6 mb-3">Estimated Daily Budget</h3>
            <p className="text-gray-600 leading-relaxed mb-5">
              Accommodation in teahouses runs NPR 300–600 per night. Dal bhat costs NPR 400–700
              and comes with unlimited refills. Budget NPR 2,500–3,500 per day total.
            </p>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 flex-wrap mt-10 pt-8 border-t border-gray-100">
            <button className="bg-[#1877F2] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              📘 Facebook
            </button>
            <button className="bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              💬 WhatsApp
            </button>
            <button className="bg-gray-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all"
              onClick={() => navigator.clipboard.writeText(window.location.href)}>
              🔗 Copy Link
            </button>
          </div>

          {/* Comment form */}
          <div className="mt-10">
            <h3 className="text-xl font-bold font-serif mb-5">Leave a Comment</h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332]"
              />
              <textarea
                placeholder="Share your experience or ask a question..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none"
              />
              <button className="bg-[#1B4332] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#2D6A4F] transition-all w-fit text-sm">
                Post Comment
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Table of contents */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h4 className="font-bold text-base mb-4 pb-3 border-b-2 border-[#D8F3DC]">
              📋 Table of Contents
            </h4>
            <ul className="flex flex-col gap-3">
              {['Getting There', 'Permits You Need', 'Estimated Daily Budget', 'Day-by-Day Itinerary', 'What to Pack', 'Safety Tips'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#1B4332] hover:underline flex items-center gap-2">
                    <span className="text-gray-300 font-bold">#</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Related posts */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h4 className="font-bold text-base mb-4 pb-3 border-b-2 border-[#D8F3DC]">
              📖 Related Posts
            </h4>
            <div className="flex flex-col gap-4">
              {RELATED.map(post => (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="flex gap-3 items-start hover:opacity-80 transition-all">
                  <div className={`w-14 h-11 rounded-lg bg-gradient-to-br ${post.gradient} flex-shrink-0`}></div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{post.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Author bio */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h4 className="font-bold text-base mb-4 pb-3 border-b-2 border-[#D8F3DC]">
              ✍️ About the Author
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                B
              </div>
              <div>
                <p className="font-semibold text-sm">Bhumika</p>
                <p className="text-xs text-gray-400">Travel writer & trek enthusiast</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Based in Kathmandu. Completed the Langtang Valley trek in April 2026 and lived to eat all the dal bhat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
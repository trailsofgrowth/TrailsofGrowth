'use client'
import { useState } from 'react'
import BlogCard from '@/components/shared/BlogCard'

const CATEGORIES = ['All', 'Trekking', 'Food', 'Budget', 'Hidden Gems', 'Transport', 'Packing']

const POSTS = [
  {
    slug: 'langtang-valley-trek-guide-2026',
    title: 'The Ultimate Langtang Valley Trek Guide 2026',
    author: 'Bhumika',
    date: 'June 1, 2026',
    category: 'Trekking',
    excerpt: 'Everything you need — permits, gear, costs, and the hidden teahouses locals recommend.',
    gradient: 'from-emerald-800 to-emerald-500',
  },
  {
    slug: 'eating-kathmandu-under-5-dollars',
    title: 'Eating in Kathmandu for Under $5 a Day',
    author: 'Riya',
    date: 'June 2, 2026',
    category: 'Food',
    excerpt: 'Street food secrets, local dives, and the best momo spots away from tourist traps.',
    gradient: 'from-orange-800 to-orange-500',
  },
  {
    slug: 'pokhara-annapurna-road-trip-budget',
    title: 'Pokhara to Annapurna: Road Trip on a Budget',
    author: 'Sushant',
    date: 'June 3, 2026',
    category: 'Budget',
    excerpt: 'Complete cost breakdown for Nepal\'s most scenic road trip with budget accommodation tips.',
    gradient: 'from-blue-800 to-blue-500',
  },
  {
    slug: 'hidden-food-spots-bhaktapur',
    title: 'Hidden Food Spots in Bhaktapur You Must Try',
    author: 'Riya',
    date: 'June 4, 2026',
    category: 'Food',
    excerpt: 'Juju Dhau, bara, and the secret restaurant down the alley that locals guard fiercely.',
    gradient: 'from-red-800 to-red-500',
  },
  {
    slug: 'biking-through-mustang-complete-guide',
    title: 'Biking Through Mustang: Complete Guide',
    author: 'Sushant',
    date: 'June 5, 2026',
    category: 'Trekking',
    excerpt: 'Permits, rental costs, best roads, and the hidden monasteries you\'ll stumble upon.',
    gradient: 'from-purple-800 to-purple-500',
  },
  {
    slug: 'best-budget-guesthouses-thamel-2026',
    title: 'Best Budget Guesthouses in Thamel 2026',
    author: 'Bhumika',
    date: 'June 6, 2026',
    category: 'Budget',
    excerpt: '$5–15 per night options that are clean, safe, and close to the good food.',
    gradient: 'from-teal-800 to-teal-500',
  },
  {
    slug: 'spiti-valley-hidden-gem-india',
    title: 'Spiti Valley: India\'s Best Kept Secret',
    author: 'Bhumika',
    date: 'June 7, 2026',
    category: 'Hidden Gems',
    excerpt: 'Remote Himalayan desert with ancient monasteries and almost zero tourists.',
    gradient: 'from-slate-800 to-slate-500',
  },
  {
    slug: 'kathmandu-to-pokhara-transport-guide',
    title: 'Kathmandu to Pokhara: Every Transport Option Explained',
    author: 'Sushant',
    date: 'June 8, 2026',
    category: 'Transport',
    excerpt: 'Bus, tourist bus, flight, or private car — costs, times, and what\'s actually worth it.',
    gradient: 'from-cyan-800 to-cyan-500',
  },
  {
    slug: 'nepal-trekking-packing-list',
    title: 'The Only Nepal Trekking Packing List You Need',
    author: 'Riya',
    date: 'June 9, 2026',
    category: 'Packing',
    excerpt: 'What to bring, what to leave home, and what to buy in Kathmandu instead.',
    gradient: 'from-green-800 to-green-500',
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = POSTS.filter(post => {
    const matchCategory = activeCategory === 'All' || post.category === activeCategory
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] py-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-2">Travel Blog</h1>
          <p className="text-white/70">In-depth guides, budget tips, and hidden discoveries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search bar */}
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-sm">
              ✕ Clear
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-transparent text-gray-500 border-gray-200 hover:border-[#1B4332] hover:text-[#1B4332]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Blog grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 font-medium">No articles found for "{search}"</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="mt-4 text-[#1B4332] font-semibold underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
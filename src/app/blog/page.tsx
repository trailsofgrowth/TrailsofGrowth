'use client'
import { useState, useEffect } from 'react'
import BlogCard from '@/components/shared/BlogCard'
import { createClient } from '@/lib/supabase'

const CATEGORIES = ['All', 'Trekking', 'Food', 'Budget Travel', 'Hidden Gems', 'Transport', 'Packing', 'Culture', 'Biking']

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  created_at: string
  author_id: string
  featured_image?: string
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, created_at, author_id, featured_image')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (!error && data) setArticles(data)
      setLoading(false)
    }
    fetchArticles()
  }, [])

  const filtered = articles.filter(post => {
    const matchCategory = activeCategory === 'All' || post.category === activeCategory
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const gradients = ['from-emerald-800 to-emerald-500', 'from-orange-800 to-orange-500', 'from-blue-800 to-blue-500', 'from-red-800 to-red-500', 'from-purple-800 to-purple-500', 'from-teal-800 to-teal-500']

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] py-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-2">Travel Blog</h1>
          <p className="text-white/70">In-depth guides, budget tips, and hidden discoveries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
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

        <p className="text-sm text-gray-400 mb-6">
          {loading ? 'Loading...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading articles...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                category={post.category}
                excerpt={post.excerpt || 'Read this article to learn more...'}
                author="TrailsofGrowth Team"
                date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                gradient={gradients[i % gradients.length]}
                featured_image={post.featured_image}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 font-medium">No articles found</p>
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
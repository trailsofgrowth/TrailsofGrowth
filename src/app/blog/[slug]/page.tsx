'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface FAQ {
  question: string
  answer: string
}

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  created_at: string
  author_id: string
  seo_title?: string
  meta_description?: string
  img_alt?: string
  featured_image?: string
  faqs?: FAQ[]
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Article | null>(null)
  const [related, setRelated] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error || !data) { setNotFound(true); setLoading(false); return }
      setPost(data)

      const { data: relatedData } = await supabase
        .from('articles')
        .select('id, title, slug, category, featured_image')
        .eq('category', data.category)
        .eq('status', 'published')
        .neq('id', data.id)
        .limit(3)

      if (relatedData) setRelated(relatedData as Article[])
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Loading article...</p>
      </div>
    </div>
  )

  if (notFound || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl mb-4">📄</p>
      <h1 className="text-2xl font-bold font-serif mb-2">Article not found</h1>
      <p className="text-gray-400 mb-6">This article may have been removed or unpublished.</p>
      <Link href="/blog" className="bg-[#1B4332] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm">
        ← Back to Blog
      </Link>
    </div>
  )

  const gradients = ['from-emerald-800 to-emerald-500', 'from-orange-800 to-orange-500', 'from-blue-800 to-blue-500']
  const gradient = gradients[post.title.length % gradients.length]
  const readTime = Math.max(1, Math.round((post.content?.length || 0) / 1000)) + ' min read'
  const faqs: FAQ[] = post.faqs || []

  // Parse content for display — split by ## headings
  function renderContent(text: string) {
    if (!text) return null
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return (
        <h2 key={i} className="text-2xl font-bold font-serif mt-10 mb-4 text-[#1B4332] border-b-2 border-[#D8F3DC] pb-2">
          {line.replace('## ', '')}
        </h2>
      )
      if (line.startsWith('### ')) return (
        <h3 key={i} className="text-xl font-bold font-serif mt-6 mb-3">
          {line.replace('### ', '')}
        </h3>
      )
      if (line.startsWith('- ') || line.startsWith('• ')) return (
        <li key={i} className="ml-5 mb-1 text-gray-700 leading-relaxed list-disc">
          {line.replace(/^[-•]\s/, '')}
        </li>
      )
      if (line.startsWith('💡') || line.startsWith('> ')) return (
        <div key={i} className="border-l-4 border-[#1B4332] bg-[#D8F3DC] px-5 py-4 rounded-r-xl my-6 italic text-[#1B4332] text-sm leading-relaxed">
          {line.replace('> ', '')}
        </div>
      )
      if (line === '') return <br key={i} />
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
          {line}
        </p>
      )
    })
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0]">

      {/* HERO IMAGE — full width magazine style */}
      <div className="w-full h-64 sm:h-80 md:h-[420px] relative overflow-hidden">
        {post.featured_image ? (
          <img src={post.featured_image} alt={post.img_alt || post.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Title overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <span className="bg-[#F59E0B] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wide">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ARTICLE META BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <Link href="/" className="hover:text-[#1B4332]">Home</Link>
              <span>›</span>
              <Link href="/blog" className="hover:text-[#1B4332]">Blog</Link>
              <span>›</span>
              <span className="text-[#1B4332] font-medium truncate max-w-[180px]">{post.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>✍️ TrailsofGrowth Team</span>
            <span>📅 {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>⏱ {readTime}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT — two column magazine layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Article body (2/3 width) */}
          <div className="lg:col-span-2">

            {/* Excerpt / intro */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#F59E0B] pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Article content */}
            <div className="prose-custom">
              {renderContent(post.content)}
            </div>

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold font-serif mb-6 text-[#1B4332] flex items-center gap-2">
                  ❓ Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-3">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-[#F9F6F0] transition-all"
                      >
                        <span className="pr-4 text-sm sm:text-base">{faq.question}</span>
                        <span className={`text-[#1B4332] text-xl font-bold flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                          +
                        </span>
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share buttons */}
            <div className="flex gap-3 flex-wrap mt-12 pt-8 border-t border-gray-200">
              <p className="w-full text-sm font-semibold text-gray-500 mb-1">Share this article:</p>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                className="bg-[#1877F2] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}
                className="bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
              >
                💬 WhatsApp
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }}
                className="bg-gray-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
              >
                🔗 Copy Link
              </button>
            </div>

            {/* Comment form */}
            <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold font-serif mb-5">💬 Leave a Comment</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] transition-all"
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

          {/* RIGHT — Sidebar (1/3 width) */}
          <div className="flex flex-col gap-6">

            {/* Author card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  T
                </div>
                <div>
                  <p className="font-bold text-sm">TrailsofGrowth Team</p>
                  <p className="text-xs text-gray-400">Nepal & South Asia Travel</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sharing real, first-hand travel guides for Nepal & South Asia. No fluff — just honest tips from people who have been there.
              </p>
            </div>

            {/* Quick info card */}
            <div className="bg-[#1B4332] rounded-xl p-5 text-white">
              <h4 className="font-bold text-base mb-3">📋 Article Info</h4>
              <div className="flex flex-col gap-2 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-semibold text-white">{post.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Read time</span>
                  <span className="font-semibold text-white">{readTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Published</span>
                  <span className="font-semibold text-white">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h4 className="font-bold text-base mb-4 pb-3 border-b-2 border-[#D8F3DC]">
                  📖 Related Articles
                </h4>
                <div className="flex flex-col gap-4">
                  {related.map((r, i) => (
                    <Link href={`/blog/${r.slug}`} key={r.id} className="flex gap-3 items-start hover:opacity-80 transition-all group">
                      {r.featured_image ? (
                        <img src={r.featured_image} alt={r.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className={`w-16 h-12 rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex-shrink-0`}></div>
                      )}
                      <div>
                        <p className="text-sm font-semibold leading-snug group-hover:text-[#1B4332] transition-all">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{r.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter signup */}
            <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-xl p-5">
              <h4 className="font-bold text-base mb-2">📬 Get Weekly Guides</h4>
              <p className="text-xs text-gray-500 mb-3">Hidden gems, budget tips, and seasonal picks.</p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F59E0B] mb-2"
              />
              <button className="w-full bg-[#F59E0B] text-white font-semibold py-2.5 rounded-lg hover:bg-[#D97706] transition-all text-sm">
                Subscribe Free
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-10"></div>
    </div>
  )
}
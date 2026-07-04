'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

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
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Article | null>(null)
  const [related, setRelated] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setPost(data)

      // Fetch related articles (same category, excluding current)
      const { data: relatedData } = await supabase
        .from('articles')
        .select('id, title, slug, category')
        .eq('category', data.category)
        .eq('status', 'published')
        .neq('id', data.id)
        .limit(3)

      if (relatedData) setRelated(relatedData as Article[])
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading article...</div>
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl mb-4">📄</p>
        <h1 className="text-2xl font-bold font-serif mb-2">Article not found</h1>
        <p className="text-gray-400 mb-6">This article may have been removed or unpublished.</p>
        <Link href="/blog" className="bg-[#1B4332] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const gradients = ['from-emerald-800 to-emerald-500', 'from-orange-800 to-orange-500', 'from-blue-800 to-blue-500']
  const gradient = gradients[post.title.length % gradients.length]
  const readTime = Math.max(1, Math.round((post.content?.length || 0) / 1000)) + ' min read'

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-[#1B4332]">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-[#1B4332]">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-[#1B4332] font-medium">{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full">
            {post.category}
          </span>

          <h1 className="text-4xl font-bold font-serif leading-tight mt-4 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 flex-wrap">
            <span>✍️ <strong className="text-gray-600">TrailsofGrowth Team</strong></span>
            <span>📅 {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>⏱ {readTime}</span>
          </div>

          {post.featured_image ? (
            <img src={post.featured_image} alt={post.img_alt || post.title} className="w-full h-72 object-cover rounded-xl mb-8" />
          ) : (
            <div className={`h-72 bg-gradient-to-br ${gradient} rounded-xl mb-8`}></div>
          )}

          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
              {post.content || post.excerpt || 'No content available yet.'}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap mt-10 pt-8 border-t border-gray-100">
            <button className="bg-[#1877F2] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              📘 Facebook
            </button>
            <button className="bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              💬 WhatsApp
            </button>
            <button
              className="bg-gray-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              🔗 Copy Link
            </button>
          </div>

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

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h4 className="font-bold text-base mb-4 pb-3 border-b-2 border-[#D8F3DC]">
              📖 Related Posts
            </h4>
            {related.length > 0 ? (
              <div className="flex flex-col gap-4">
                {related.map((r, i) => (
                  <Link href={`/blog/${r.slug}`} key={r.id} className="flex gap-3 items-start hover:opacity-80 transition-all">
                    <div className={`w-14 h-11 rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex-shrink-0`}></div>
                    <div>
                      <p className="text-sm font-semibold leading-snug">{r.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{r.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No related posts yet.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h4 className="font-bold text-base mb-4 pb-3 border-b-2 border-[#D8F3DC]">
              ✍️ About the Author
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                T
              </div>
              <div>
                <p className="font-semibold text-sm">TrailsofGrowth Team</p>
                <p className="text-xs text-gray-400">Travel writer</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sharing real travel guides for Nepal & South Asia.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
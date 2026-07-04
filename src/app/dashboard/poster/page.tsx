'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Article {
  id: string
  title: string
  status: string
  created_at: string
  views: number
  slug: string
}

export default function PosterDashboard() {
  const [user, setUser] = useState<{email?: string, id?: string} | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const supabase = createClient()
  const router = useRouter()

  async function fetchArticles(userId: string) {
    const { data } = await supabase
      .from('articles')
      .select('id, title, status, created_at, views, slug')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
    if (data) setArticles(data)
  }

  async function unpublishArticle(id: string) {
    await supabase.from('articles').update({ status: 'draft' }).eq('id', id)
    setArticles(articles.map(a => a.id === id ? { ...a, status: 'draft' } : a))
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      await fetchArticles(user.id)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  )

  const publishedCount = articles.filter(a => a.status === 'published').length
  const draftCount = articles.filter(a => a.status === 'draft').length
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0)

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xl font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.email}</p>
                  <p className="text-xs text-[#1B4332] font-semibold">Blog Poster</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { id: 'overview', icon: '📊', label: 'Overview' },
                  { id: 'articles', icon: '📝', label: 'My Articles' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                      activeTab === item.id
                        ? 'bg-[#D8F3DC] text-[#1B4332] font-semibold'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
                <Link
                  href="/dashboard/poster/write"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all mt-1"
                >
                  <span>✍️</span> Write Article
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div className="bg-[#D8F3DC] border border-[#1B4332]/20 rounded-xl px-5 py-4 mb-6">
                  <p className="text-[#1B4332] font-semibold">Welcome back! ✍️</p>
                  <p className="text-[#1B4332]/70 text-sm mt-1">{user?.email}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { val: publishedCount, label: 'Published' },
                    { val: totalViews.toLocaleString(), label: 'Total Views' },
                    { val: draftCount, label: 'Drafts' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
                      <div className="text-3xl font-bold text-[#1B4332]">{s.val}</div>
                      <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mb-4">
                  <Link
                    href="/dashboard/poster/write"
                    className="bg-[#1B4332] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm inline-flex items-center gap-2"
                  >
                    ✍️ Write New Article
                  </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">Recent Articles</h3>
                  {articles.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">No articles yet. Write your first one!</p>
                  ) : (
                    articles.slice(0, 5).map(a => (
                      <div key={a.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="font-semibold text-sm">{a.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          a.status === 'published' ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-[#FEF3C7] text-[#92400E]'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ARTICLES TAB */}
            {activeTab === 'articles' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-base">My Articles ({articles.length})</h3>
                  <Link
                    href="/dashboard/poster/write"
                    className="bg-[#1B4332] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#2D6A4F] transition-all text-xs"
                  >
                    ✍️ New Article
                  </Link>
                </div>

                <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-lg px-4 py-3 mb-4 text-sm text-[#92400E]">
                  📌 You can edit or unpublish your own articles. Only Admin can delete articles.
                </div>

                {articles.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-3">✍️</p>
                    <p className="font-medium mb-1">No articles yet</p>
                    <p className="text-sm">Write your first travel guide!</p>
                    <Link
                      href="/dashboard/poster/write"
                      className="mt-4 inline-block bg-[#1B4332] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm"
                    >
                      Write Now
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#1B4332] text-white">
                          <th className="text-left px-4 py-3 rounded-tl-lg">Title</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-left px-4 py-3">Date</th>
                          <th className="text-left px-4 py-3">Views</th>
                          <th className="text-left px-4 py-3 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((a, i) => (
                          <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9F6F0]'}>
                            <td className="px-4 py-3 font-medium max-w-xs">
                              <Link href={`/blog/${a.slug}`} target="_blank" className="hover:text-[#1B4332] hover:underline line-clamp-1">
                                {a.title}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                a.status === 'published'
                                  ? 'bg-[#D8F3DC] text-[#1B4332]'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                              {new Date(a.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {a.views || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Link
                                  href={`/dashboard/poster/edit/${a.id}`}
                                  className="text-xs bg-[#DBEAFE] text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:opacity-80"
                                >
                                  Edit
                                </Link>
                                {a.status === 'published' && (
                                  <button
                                    onClick={() => unpublishArticle(a.id)}
                                    className="text-xs bg-[#FEF3C7] text-[#92400E] px-3 py-1.5 rounded-lg font-semibold hover:opacity-80"
                                  >
                                    Unpublish
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
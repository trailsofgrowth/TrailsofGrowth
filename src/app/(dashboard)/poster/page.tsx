'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PosterDashboard() {
  const [user, setUser] = useState<{email?: string, id?: string} | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  const MY_ARTICLES = [
    { title: 'Pokhara to Annapurna: Road Trip on a Budget', status: 'Published', date: 'Jun 3', views: 342, slug: 'pokhara-annapurna-road-trip-budget' },
    { title: 'Biking Through Mustang: Complete Guide', status: 'Published', date: 'Jun 5', views: 289, slug: 'biking-through-mustang-complete-guide' },
    { title: 'Mustang Upper Circuit: Permit Guide', status: 'Draft', date: 'Jun 6', views: 0, slug: 'mustang-upper-circuit' },
    { title: 'Budget Camping in Langtang', status: 'Draft', date: 'Jun 7', views: 0, slug: 'budget-camping-langtang' },
  ]

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
                  <p className="text-xs text-gray-400">Blog Poster</p>
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

            {activeTab === 'overview' && (
              <div>
                <div className="bg-[#D8F3DC] border border-[#1B4332]/20 rounded-xl px-5 py-4 mb-6">
                  <p className="text-[#1B4332] font-semibold">Welcome back! ✍️</p>
                  <p className="text-[#1B4332]/70 text-sm mt-1">{user?.email}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { val: '7', label: 'Published Articles' },
                    { val: '1,240', label: 'Total Views' },
                    { val: '2', label: 'Drafts' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
                      <div className="text-3xl font-bold text-[#1B4332]">{s.val}</div>
                      <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-right mb-4">
                  <Link href="/dashboard/poster/write" className="bg-[#1B4332] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm inline-flex items-center gap-2">
                    ✍️ Write New Article
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-base">My Articles</h3>
                  <Link href="/dashboard/poster/write" className="bg-[#1B4332] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#2D6A4F] transition-all text-xs">
                    ✍️ New Article
                  </Link>
                </div>
                <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-lg px-4 py-3 mb-4 text-sm text-[#92400E]">
                  📌 You can edit or unpublish your own articles. Only Admin can delete articles.
                </div>
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
                      {MY_ARTICLES.map((article, i) => (
                        <tr key={article.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9F6F0]'}>
                          <td className="px-4 py-3 font-medium max-w-xs truncate">{article.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              article.status === 'Published'
                                ? 'bg-[#D8F3DC] text-[#1B4332]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}>
                              {article.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{article.date}</td>
                          <td className="px-4 py-3 text-gray-400">{article.views || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Link href="/dashboard/poster/write" className="text-xs bg-[#DBEAFE] text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:opacity-80">
                                Edit
                              </Link>
                              {article.status === 'Published' && (
                                <button className="text-xs bg-[#FEF3C7] text-[#92400E] px-3 py-1.5 rounded-lg font-semibold hover:opacity-80">
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
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
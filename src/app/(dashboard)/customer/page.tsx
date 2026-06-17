'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CustomerDashboard() {
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

  const SAVED_ARTICLES = [
    { title: 'The Ultimate Langtang Valley Trek Guide 2026', category: 'Trekking', date: 'June 1, 2026', slug: 'langtang-valley-trek-guide-2026' },
    { title: 'Eating in Kathmandu for Under $5 a Day', category: 'Food', date: 'June 2, 2026', slug: 'eating-kathmandu-under-5-dollars' },
    { title: 'Hidden Food Spots in Bhaktapur', category: 'Food', date: 'June 4, 2026', slug: 'hidden-food-spots-bhaktapur' },
    { title: 'Best Budget Guesthouses in Thamel 2026', category: 'Budget', date: 'June 6, 2026', slug: 'best-budget-guesthouses-thamel-2026' },
  ]

  const SAVED_ROUTES = [
    { origin: 'Kathmandu', destination: 'Pokhara', mode: 'Road Trip', stops: 3, date: 'June 2, 2026' },
    { origin: 'Kathmandu', destination: 'Chitwan', mode: 'Mixed', stops: 2, date: 'June 5, 2026' },
  ]

  const RECENTLY_VIEWED = [
    { name: 'Langtang Valley', gradient: 'from-teal-800 to-teal-500' },
    { name: 'Kathmandu Food Guide', gradient: 'from-orange-800 to-orange-500' },
    { name: 'Bhaktapur', gradient: 'from-red-800 to-red-500' },
    { name: 'Ella Guide', gradient: 'from-indigo-800 to-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5">
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xl font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.email}</p>
                  <p className="text-xs text-gray-400">Customer</p>
                </div>
              </div>

              {/* Nav */}
              <div className="flex flex-col gap-1">
                {[
                  { id: 'overview', icon: '🏠', label: 'Overview' },
                  { id: 'saved', icon: '🔖', label: 'Saved Articles' },
                  { id: 'routes', icon: '🗺️', label: 'My Routes' },
                  { id: 'profile', icon: '👤', label: 'Profile' },
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
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <div className="bg-[#D8F3DC] border border-[#1B4332]/20 rounded-xl px-5 py-4 mb-6">
                  <p className="text-[#1B4332] font-semibold">Welcome back! 👋</p>
                  <p className="text-[#1B4332]/70 text-sm mt-1">{user?.email}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { val: '4', label: 'Saved Articles' },
                    { val: '2', label: 'Planned Routes' },
                    { val: '3', label: 'Countries Explored' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
                      <div className="text-3xl font-bold text-[#1B4332]">{s.val}</div>
                      <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recently viewed */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">Recently Viewed</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {RECENTLY_VIEWED.map(item => (
                      <div key={item.name} className="rounded-lg overflow-hidden hover:opacity-90 transition-all cursor-pointer">
                        <div className={`h-20 bg-gradient-to-br ${item.gradient}`}></div>
                        <p className="text-xs font-semibold mt-2 px-1">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SAVED ARTICLES */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">Saved Articles</h3>
                <div className="flex flex-col gap-3">
                  {SAVED_ARTICLES.map(article => (
                    <div key={article.slug} className="flex items-center justify-between bg-[#F9F6F0] rounded-lg px-4 py-3">
                      <div>
                        <p className="font-semibold text-sm">{article.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{article.category} · Saved {article.date}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="text-xs font-semibold text-[#1B4332] border border-[#1B4332] px-3 py-1.5 rounded-lg hover:bg-[#D8F3DC] transition-all"
                        >
                          Read
                        </Link>
                        <button className="text-xs font-semibold text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MY ROUTES */}
            {activeTab === 'routes' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">My Saved Routes</h3>
                <div className="flex flex-col gap-3">
                  {SAVED_ROUTES.map((route, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F9F6F0] rounded-lg px-4 py-3">
                      <div>
                        <p className="font-semibold text-sm">{route.origin} → {route.destination}</p>
                        <p className="text-xs text-gray-400 mt-1">{route.mode} · {route.stops} stops · Saved {route.date}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href="/planner"
                          className="text-xs font-semibold text-[#1B4332] border border-[#1B4332] px-3 py-1.5 rounded-lg hover:bg-[#D8F3DC] transition-all"
                        >
                          View
                        </Link>
                        <button className="text-xs font-semibold text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">Edit Profile</h3>
                <div className="flex flex-col gap-4 max-w-md">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Bio</label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none"
                    />
                  </div>
                  <button
                    onClick={() => alert('Profile saved!')}
                    className="bg-[#1B4332] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm w-fit"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
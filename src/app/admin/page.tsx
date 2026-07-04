'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Article {
  id: string
  title: string
  slug: string
  category: string
  status: string
  author_id: string
  created_at: string
}

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{email?: string, id?: string} | null>(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [deleteTarget, setDeleteTarget] = useState<{ type: string, id: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function fetchArticles() {
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, category, status, author_id, created_at')
      .order('created_at', { ascending: false })
    if (data) setArticles(data)
  }

  async function fetchUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })
    if (data) setUsers(data)
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        router.push('/')
        return
      }

      setUser(user)
      setRole(profile.role)
      setLoading(false)
      fetchArticles()
      fetchUsers()
    }
    init()
  }, [])

  async function deleteArticle(id: string) {
    await supabase.from('articles').delete().eq('id', id)
    setArticles(articles.filter(a => a.id !== id))
    setDeleteTarget(null)
  }

  async function changeUserRole(id: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading admin panel...</div>
  }

  const publishedCount = articles.filter(a => a.status === 'published').length
  const draftCount = articles.filter(a => a.status === 'draft').length

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-xl font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.email}</p>
                  <p className="text-xs text-red-500 font-semibold">⚙️ Admin</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { id: 'overview', icon: '📊', label: 'Dashboard' },
                  { id: 'articles', icon: '📝', label: 'All Articles' },
                  { id: 'users', icon: '👥', label: 'Users' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                      activeTab === item.id
                        ? 'bg-[#FEE2E2] text-[#DC2626] font-semibold'
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

            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { val: articles.length, label: 'Total Articles' },
                    { val: users.length, label: 'Registered Users' },
                    { val: publishedCount, label: 'Published' },
                    { val: draftCount, label: 'Drafts' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
                      <div className="text-3xl font-bold text-[#1B4332]">{s.val}</div>
                      <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">Recent Articles</h3>
                  <div className="flex flex-col gap-2">
                    {articles.slice(0, 5).map(a => (
                      <div key={a.id} className="flex items-center justify-between bg-[#F9F6F0] rounded-lg px-4 py-3">
                        <div>
                          <p className="font-semibold text-sm">{a.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{a.category} · {new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${a.status === 'published' ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                    {articles.length === 0 && <p className="text-center text-gray-400 py-4">No articles yet.</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">All Articles ({articles.length})</h3>
                <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-lg px-4 py-3 mb-4 text-sm text-[#92400E]">
                  ⚙️ As Admin, you can edit or delete any article from any author.
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1B4332] text-white">
                        <th className="text-left px-4 py-3 rounded-tl-lg">Title</th>
                        <th className="text-left px-4 py-3">Category</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((a, i) => (
                        <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9F6F0]'}>
                          <td className="px-4 py-3 font-medium max-w-xs truncate">{a.title}</td>
                          <td className="px-4 py-3 text-gray-500">{a.category}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'published' ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{new Date(a.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
  <div className="flex gap-2">
    <Link
      href={`/admin/edit/${a.id}`}
      className="text-xs bg-[#DBEAFE] text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:opacity-80"
    >
      Edit
    </Link>
    <button
      onClick={() => setDeleteTarget({ type: 'article', id: a.id })}
      className="text-xs bg-[#FEE2E2] text-[#DC2626] px-3 py-1.5 rounded-lg font-semibold hover:opacity-80"
    >
      Delete
    </button>
  </div>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {articles.length === 0 && <p className="text-center text-gray-400 py-8">No articles yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 pb-3 border-b border-gray-100">User Management ({users.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1B4332] text-white">
                        <th className="text-left px-4 py-3 rounded-tl-lg">Email</th>
                        <th className="text-left px-4 py-3">Name</th>
                        <th className="text-left px-4 py-3">Role</th>
                        <th className="text-left px-4 py-3">Joined</th>
                        <th className="text-left px-4 py-3 rounded-tr-lg">Change Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9F6F0]'}>
                          <td className="px-4 py-3 font-medium">{u.email}</td>
                          <td className="px-4 py-3 text-gray-500">{u.full_name || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              u.role === 'admin' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                              u.role === 'poster' ? 'bg-[#DBEAFE] text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={e => changeUserRole(u.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white"
                            >
                              <option value="customer">Customer</option>
                              <option value="poster">Blog Poster</option>
                              <option value="admin">Admin</option>
                            </select>
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

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">🗑️ Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this article? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteArticle(deleteTarget.id)}
                className="flex-1 bg-[#DC2626] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-all text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
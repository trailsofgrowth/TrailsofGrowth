'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<{email?: string, id?: string} | null>(null)
  const [role, setRole] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function fetchRole(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (profile) setRole(profile.role)
  }

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchRole(user.id)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchRole(session.user.id)
      } else {
        setUser(null)
        setRole('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setRole('')
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  function getDashboardLink() {
    if (role === 'admin') return '/admin'
    if (role === 'poster') return '/dashboard/poster'
    return '/dashboard/customer'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/" className="font-bold text-2xl font-serif">
          <span className="text-[#1B4332]">Trails</span>
          <span className="text-[#F59E0B]">ofGrowth</span>
        </Link>

        <div className="flex items-center gap-1 flex-1">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
            Home
          </Link>
          <Link href="/destinations" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
            Destinations
          </Link>
          <Link href="/blog" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
            Blog
          </Link>
          <Link href="/planner" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
            Route Planner
          </Link>
          {role === 'poster' && (
            <Link href="/dashboard/poster/write" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
              ✍️ Write
            </Link>
          )}
          {role === 'admin' && (
            <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
              ⚙️ Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-gray-600 max-w-[120px] truncate">{user.email}</span>
                <span className="text-gray-400">▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg w-48 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Logged in as</p>
                    <p className="text-xs font-semibold text-[#1B4332] capitalize">{role || 'customer'}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all"
                  >
                    📊 Dashboard
                  </Link>
                  {role === 'poster' && (
                    <Link
                      href="/dashboard/poster/write"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all"
                    >
                      ✍️ Write Article
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg border-2 border-[#1B4332] text-[#1B4332] text-sm font-semibold hover:bg-[#1B4332] hover:text-white transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
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

  useEffect(() => {
    // Get current user on load
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Fetch their role from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single()
        if (profile) setRole(profile.role)
      }
    }
    getUser()

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
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
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl font-serif">
          <span className="text-[#1B4332]">Trails</span>
          <span className="text-[#F59E0B]">ofGrowth</span>
        </Link>

        {/* Nav Links */}
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
          {/* Show Write link for posters */}
          {role === 'poster' && (
            <Link href="/dashboard/poster/write" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
              ✍️ Write
            </Link>
          )}
          {/* Show Admin link for admins */}
          {role === 'admin' && (
            <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
              ⚙️ Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            // Logged in — show avatar + dropdown
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

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg w-48 py-2 z-50">
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
            // Logged out — show Login button
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
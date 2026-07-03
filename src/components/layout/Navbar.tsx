'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<{email?: string, id?: string} | null>(null)
  const [role, setRole] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
      if (user) { setUser(user); await fetchRole(user.id) }
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) { setUser(session.user); await fetchRole(session.user.id) }
      else { setUser(null); setRole('') }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null); setRole(''); setDropdownOpen(false); setMobileOpen(false)
    router.push('/'); router.refresh()
  }

  function getDashboardLink() {
    if (role === 'admin') return '/admin'
    if (role === 'poster') return '/dashboard/poster'
    return '/dashboard/customer'
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/blog', label: 'Blog' },
    { href: '/planner', label: 'Route Planner' },
    ...(role === 'poster' ? [{ href: '/dashboard/poster/write', label: '✍️ Write' }] : []),
    ...(role === 'admin' ? [{ href: '/admin', label: '⚙️ Admin' }] : []),
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl sm:text-2xl font-serif flex-shrink-0">
          <span className="text-[#1B4332]">Trails</span>
          <span className="text-[#F59E0B]">ofGrowth</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 ml-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-gray-600 max-w-[100px] truncate hidden lg:block">{user.email}</span>
                <span className="text-gray-400">▾</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg w-48 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Logged in as</p>
                    <p className="text-xs font-semibold text-[#1B4332] capitalize">{role || 'customer'}</p>
                  </div>
                  <Link href={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
                    📊 Dashboard
                  </Link>
                  {role === 'poster' && (
                    <Link href="/dashboard/poster/write" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
                      ✍️ Write Article
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg border-2 border-[#1B4332] text-[#1B4332] text-sm font-semibold hover:bg-[#1B4332] hover:text-white transition-all">
              Login
            </Link>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all">
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <div className="px-3 py-1">
                <p className="text-xs text-gray-400">Logged in as <span className="font-semibold text-[#1B4332] capitalize">{role || 'customer'}</span></p>
              </div>
              <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-all">
                📊 Dashboard
              </Link>
              <button onClick={handleLogout} className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all text-left">
                🚪 Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1B4332] border border-[#1B4332] text-center hover:bg-[#1B4332] hover:text-white transition-all mt-1">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
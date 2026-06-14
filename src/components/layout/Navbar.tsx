import Link from 'next/link'

export default function Navbar() {
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
        </div>

        {/* Login Button */}
        <Link
  href="/login"
  className="px-5 py-2 rounded-lg border-2 border-[#1B4332] text-[#1B4332] text-sm font-semibold hover:bg-[#1B4332] hover:text-white transition-all"
>
  Login
</Link>
      </div>
    </nav>
  )
}
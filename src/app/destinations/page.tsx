'use client'
import { useState } from 'react'
import Link from 'next/link'

const DESTINATIONS = [
  { name: 'Langtang Valley', country: 'Nepal', category: 'Trekking', season: 'Autumn', gradient: 'from-teal-800 to-teal-500', slug: 'langtang-valley', desc: 'Alpine valley with fewer crowds than Everest. Best in spring and autumn.' },
  { name: 'Pokhara', country: 'Nepal', category: 'Budget', season: 'Spring', gradient: 'from-blue-800 to-blue-500', slug: 'pokhara', desc: 'Lakes, mountains, and the best budget food scene in Nepal.' },
  { name: 'Bhaktapur', country: 'Nepal', category: 'Culture', season: 'Winter', gradient: 'from-orange-800 to-orange-500', slug: 'bhaktapur', desc: 'UNESCO heritage city with stunning Newari architecture.' },
  { name: 'Chitwan National Park', country: 'Nepal', category: 'Wildlife', season: 'Winter', gradient: 'from-green-800 to-green-500', slug: 'chitwan', desc: 'Rhinos, tigers, and jungle safaris just 5 hours from Kathmandu.' },
  { name: 'Spiti Valley', country: 'India', category: 'Hidden Gems', season: 'Summer', gradient: 'from-slate-800 to-slate-500', slug: 'spiti-valley', desc: 'Remote Himalayan desert — monasteries and dramatic landscapes.' },
  { name: 'Ella', country: 'Sri Lanka', category: 'Budget', season: 'Winter', gradient: 'from-indigo-800 to-indigo-500', slug: 'ella', desc: 'Tea country, Nine Arches Bridge, and misty hilltop hikes.' },
  { name: 'Darjeeling', country: 'India', category: 'Culture', season: 'Spring', gradient: 'from-amber-800 to-amber-500', slug: 'darjeeling', desc: 'Hill station, world-famous tea gardens, and Kanchenjunga views.' },
  { name: 'Coorg', country: 'India', category: 'Hidden Gems', season: 'Winter', gradient: 'from-gray-800 to-gray-600', slug: 'coorg', desc: 'Coffee plantations, misty forests, and cascading waterfalls.' },
  { name: 'Annapurna Base Camp', country: 'Nepal', category: 'Trekking', season: 'Autumn', gradient: 'from-emerald-800 to-emerald-500', slug: 'annapurna-base-camp', desc: 'One of the world most iconic treks — surrounded by 8,000m peaks.' },
]

const COUNTRIES = ['All Countries', 'Nepal', 'India', 'Sri Lanka', 'Bhutan']
const CATEGORIES = ['All Categories', 'Trekking', 'Food', 'Budget', 'Hidden Gems', 'Biking', 'Culture', 'Wildlife']
const SEASONS = ['All Seasons', 'Spring', 'Autumn', 'Winter', 'Summer']

export default function DestinationsPage() {
  const [country, setCountry] = useState('All Countries')
  const [category, setCategory] = useState('All Categories')
  const [season, setSeason] = useState('All Seasons')

  const filtered = DESTINATIONS.filter(d => {
    const matchCountry = country === 'All Countries' || d.country === country
    const matchCategory = category === 'All Categories' || d.category === category
    const matchSeason = season === 'All Seasons' || d.season === season
    return matchCountry && matchCategory && matchSeason
  })

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] py-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-2">Destinations</h1>
          <p className="text-white/70">Explore handpicked guides across Nepal & South Asia</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter bar */}
        <div className="bg-white rounded-xl shadow-sm px-5 py-4 mb-8 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-500">Filter by</span>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] bg-gray-50"
          >
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] bg-gray-50"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] bg-gray-50"
          >
            {SEASONS.map(s => <option key={s}>{s}</option>)}
          </select>
          {(country !== 'All Countries' || category !== 'All Categories' || season !== 'All Seasons') && (
            <button
              onClick={() => { setCountry('All Countries'); setCategory('All Categories'); setSeason('All Seasons') }}
              className="text-sm text-red-400 hover:text-red-600 font-medium"
            >
              ✕ Clear filters
            </button>
          )}
          <span className="text-sm text-gray-400 ml-auto">{filtered.length} destinations found</span>
        </div>

        {/* Destinations grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => (
              <div key={d.slug} className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${d.gradient} flex items-end p-4`}>
                  <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md">
                    {d.country}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{d.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{d.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full">
                        {d.category}
                      </span>
                      <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                        {d.season}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${d.slug}`}
                      className="bg-[#1B4332] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#2D6A4F] transition-all"
                    >
                      Read Guide
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🗺️</p>
            <p className="text-gray-500 font-medium">No destinations found for these filters</p>
            <button
              onClick={() => { setCountry('All Countries'); setCategory('All Categories'); setSeason('All Seasons') }}
              className="mt-4 text-[#1B4332] font-semibold underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
import Link from 'next/link'

interface BlogCardProps {
  title: string
  author: string
  date: string
  category: string
  excerpt: string
  slug: string
  gradient: string
}

export default function BlogCard({ title, author, date, category, excerpt, slug, gradient }: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden">
      {/* Image placeholder */}
      <div className={`h-44 bg-gradient-to-br ${gradient}`}></div>

      <div className="p-4">
        {/* Category badge */}
        <span className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug mt-3 mb-2">{title}</h3>

        {/* Author & date */}
        <p className="text-xs text-gray-400 mb-2">✍️ {author} · {date}</p>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{excerpt}</p>

        {/* Read more */}
        <Link
          href={`/blog/${slug}`}
          className="text-[#1B4332] text-sm font-semibold border border-[#1B4332] px-4 py-1.5 rounded-lg hover:bg-[#D8F3DC] transition-all inline-block"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}
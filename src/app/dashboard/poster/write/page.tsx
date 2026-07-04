'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function WriteArticlePage() {
  const [user, setUser] = useState<{email?: string, id?: string} | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Trekking')
  const [seoTitle, setSeoTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')
  const [focusKw, setFocusKw] = useState('')
  const [slug, setSlug] = useState('')
  const [imgAlt, setImgAlt] = useState('')
  const [robotsMeta, setRobotsMeta] = useState('index,follow')
  const [schemaType, setSchemaType] = useState('Article')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDesc, setOgDesc] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

  function handleTitleChange(val: string) {
    setTitle(val)
    setSlug(generateSlug(val))
    if (!seoTitle) setSeoTitle(val)
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = tagInput.trim().replace(',', '')
      if (val && !tags.includes(val)) setTags([...tags, val])
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
  }

  function getSeoScore() {
    let score = 0
    if (seoTitle) score++
    if (metaDesc) score++
    if (focusKw && title.toLowerCase().includes(focusKw.toLowerCase())) score++
    if (imgAlt) score++
    if (content.length > 500) score++
    return score
  }

  async function handleSave(publishStatus: 'draft' | 'published') {
    if (!title) { setMessage('Please add a title first!'); return }
    setSaving(true)
    setMessage('')

    let uploadedImageUrl = imageUrl

    // Upload image if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        setMessage('Image upload failed: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName)

      uploadedImageUrl = urlData.publicUrl
      setImageUrl(uploadedImageUrl)
    }

    const { error } = await supabase.from('articles').insert({
      title,
      slug: slug || generateSlug(title),
      content,
      excerpt,
      category,
      status: publishStatus,
      author_id: user?.id,
      seo_title: seoTitle || title,
      meta_description: metaDesc,
      focus_keyword: focusKw,
      og_title: ogTitle || seoTitle || title,
      og_description: ogDesc || metaDesc,
      img_alt: imgAlt,
      robots_meta: robotsMeta,
      schema_type: schemaType,
      featured_image: uploadedImageUrl || null,
    })

    if (error) {
      setMessage('Error saving article: ' + error.message)
      setSaving(false)
      return
    }

    setMessage(publishStatus === 'published' ? '🎉 Article published successfully!' : '💾 Draft saved!')
    setSaving(false)
    if (publishStatus === 'published') {
      setTimeout(() => router.push('/dashboard/poster'), 1500)
    }
  }

  const seoScore = getSeoScore()
  const seoColor = seoScore >= 4 ? '#1B4332' : seoScore >= 2 ? '#F59E0B' : '#DC2626'
  const seoLabel = seoScore >= 4 ? '✅ Good SEO' : seoScore >= 2 ? '⚠️ Needs Improvement' : '❌ Poor SEO'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] py-6 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif">✍️ Write New Article</h1>
              <p className="text-white/70 text-sm mt-1">Create, optimise, and publish your travel guide</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex-1 sm:flex-none px-4 py-2.5 border-2 border-white/50 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F59E0B] text-white rounded-lg text-sm font-semibold hover:bg-[#D97706] transition-all disabled:opacity-60"
              >
                {saving ? 'Publishing...' : '🌐 Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {message && (
          <div className={`mb-6 px-5 py-3 rounded-lg text-sm font-medium ${
            message.includes('Error') || message.includes('failed')
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-[#D8F3DC] text-[#1B4332] border border-[#1B4332]/20'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Main content */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. The Ultimate Langtang Trek Guide 2026"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base sm:text-lg font-semibold outline-none focus:border-[#1B4332] transition-all"
              />
            </div>

            {/* Category + Tags */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] bg-white"
                  >
                    {['Trekking', 'Food', 'Budget Travel', 'Hidden Gems', 'Transport', 'Packing', 'Culture', 'Biking'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Tags (press Enter)</label>
                  <div
                    className="flex flex-wrap gap-2 px-3 py-2 border border-gray-200 rounded-lg min-h-[46px] cursor-text"
                    onClick={() => document.getElementById('tag-input')?.focus()}
                  >
                    {tags.map(tag => (
                      <span key={tag} className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-[#1B4332] hover:text-red-500 font-bold">×</button>
                      </span>
                    ))}
                    <input
                      id="tag-input"
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder="Add tag..."
                      className="outline-none text-sm bg-transparent min-w-[80px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image Upload */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-3 block">🖼️ Featured Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-52 object-cover rounded-lg"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-all shadow"
                  >
                    ×
                  </button>
                  <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                    <span>✅</span>
                    <span>{imageFile?.name}</span>
                    <span>({imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : 0} MB)</span>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#1B4332] hover:bg-[#F9F6F0] transition-all"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Click to upload featured image</p>
                  <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 5MB</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
              {!imagePreview && (
                <button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="mt-3 w-full py-2 border border-[#1B4332] text-[#1B4332] text-sm font-semibold rounded-lg hover:bg-[#D8F3DC] transition-all"
                >
                  Choose Image
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Excerpt / Summary</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Brief summary shown on blog listing page (2-3 sentences)..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Article Content *</label>
              <div className="flex gap-2 flex-wrap mb-3 p-2 bg-[#F9F6F0] rounded-lg">
                {['Bold', 'Italic', 'H2', 'H3', '• List', '🔗 Link', '🖼 Image', '💡 Tip Box'].map(btn => (
                  <button key={btn} className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-semibold hover:bg-[#D8F3DC] hover:border-[#1B4332] transition-all">
                    {btn}
                  </button>
                ))}
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={"Start writing your article here...\n\n## Introduction\nTell readers what this guide covers...\n\n## Getting There\n..."}
                rows={16}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none leading-relaxed font-mono"
              />
              <p className="text-xs text-gray-400 mt-2">{content.length} characters {content.length > 500 ? '✅' : `(${500 - content.length} more for good SEO)`}</p>
            </div>

            {/* Bottom save buttons */}
            <div className="flex gap-3 pb-8">
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex-1 py-3 border-2 border-[#1B4332] text-[#1B4332] rounded-lg text-sm font-semibold hover:bg-[#D8F3DC] transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex-1 py-3 bg-[#1B4332] text-white rounded-lg text-sm font-semibold hover:bg-[#2D6A4F] transition-all disabled:opacity-60"
              >
                {saving ? 'Publishing...' : '🌐 Publish Article'}
              </button>
            </div>
          </div>

          {/* RIGHT — SEO Sidebar */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-xl shadow-sm p-5 border-2 border-[#1B4332]">
              <h3 className="font-bold text-base text-[#1B4332] mb-4 pb-3 border-b border-[#D8F3DC] flex items-center gap-2">
                🔍 SEO Settings
              </h3>

              {/* SEO Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500">SEO Score</span>
                  <span className="text-xs font-semibold" style={{ color: seoColor }}>{seoLabel}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(seoScore / 5) * 100}%`, background: seoColor }}></div>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {[
                    { label: 'SEO title filled', ok: !!seoTitle },
                    { label: 'Meta description filled', ok: !!metaDesc },
                    { label: 'Focus keyword in title', ok: !!(focusKw && title.toLowerCase().includes(focusKw.toLowerCase())) },
                    { label: 'Image alt text filled', ok: !!imgAlt },
                    { label: 'Article 500+ characters', ok: content.length > 500 },
                  ].map(item => (
                    <div key={item.label} className={`text-xs flex items-center gap-2 ${item.ok ? 'text-[#1B4332]' : 'text-gray-400'}`}>
                      <span>{item.ok ? '✅' : '⬜'}</span> {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Title */}
              <div className="mb-3">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">SEO Title</label>
                  <span className={`text-xs ${seoTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{seoTitle.length}/60</span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder="SEO optimised title..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]"
                />
              </div>

              {/* Meta Description */}
              <div className="mb-3">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Meta Description</label>
                  <span className={`text-xs ${metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{metaDesc.length}/160</span>
                </div>
                <textarea
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  placeholder="Brief description for Google search results..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332] resize-none"
                />
              </div>

              {/* Focus Keyword */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Focus Keyword</label>
                <input
                  type="text"
                  value={focusKw}
                  onChange={e => setFocusKw(e.target.value)}
                  placeholder="e.g. Langtang Valley trek"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]"
                />
                <p className="text-xs text-gray-400 mt-1">Main keyword you want to rank for</p>
              </div>

              {/* Google Preview */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Google Preview</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 mb-1 truncate">trailsofgrowth.com › blog › {slug || 'article-slug'}</p>
                  <p className="text-sm text-blue-700 underline cursor-pointer leading-snug mb-1 line-clamp-2">{seoTitle || title || 'Your SEO Title Appears Here'}</p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{metaDesc || 'Your meta description will appear here. Write something compelling that makes people want to click.'}</p>
                </div>
              </div>

              {/* URL Slug */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]"
                />
              </div>

              {/* OG Title */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Open Graph Title</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={e => setOgTitle(e.target.value)}
                  placeholder="Social share title..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]"
                />
              </div>

              {/* OG Description */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Open Graph Description</label>
                <textarea
                  value={ogDesc}
                  onChange={e => setOgDesc(e.target.value)}
                  placeholder="Description for Facebook/WhatsApp shares..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332] resize-none"
                />
              </div>

              {/* Image Alt */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Image Alt Text</label>
                <input
                  type="text"
                  value={imgAlt}
                  onChange={e => setImgAlt(e.target.value)}
                  placeholder="Describe the featured image..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]"
                />
              </div>

              {/* Robots + Schema */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Robots Meta</label>
                  <select
                    value={robotsMeta}
                    onChange={e => setRobotsMeta(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white"
                  >
                    <option value="index,follow">Index, Follow</option>
                    <option value="noindex">No Index</option>
                    <option value="noindex,nofollow">No Index, No Follow</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Schema Type</label>
                  <select
                    value={schemaType}
                    onChange={e => setSchemaType(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white"
                  >
                    <option>Article</option>
                    <option>BlogPosting</option>
                    <option>TravelGuide</option>
                    <option>FAQPage</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
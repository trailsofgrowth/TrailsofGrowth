'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface FAQ {
  question: string
  answer: string
}

export default function EditArticlePage() {
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Trekking')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [seoTitle, setSeoTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')
  const [focusKw, setFocusKw] = useState('')
  const [slug, setSlug] = useState('')
  const [imgAlt, setImgAlt] = useState('')
  const [robotsMeta, setRobotsMeta] = useState('index,follow')
  const [schemaType, setSchemaType] = useState('Article')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDesc, setOgDesc] = useState('')
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchArticle() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') { router.push('/'); return }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) { router.push('/admin'); return }

      setTitle(data.title || '')
      setContent(data.content || '')
      setExcerpt(data.excerpt || '')
      setCategory(data.category || 'Trekking')
      setStatus(data.status || 'draft')
      setSeoTitle(data.seo_title || '')
      setMetaDesc(data.meta_description || '')
      setFocusKw(data.focus_keyword || '')
      setSlug(data.slug || '')
      setImgAlt(data.img_alt || '')
      setRobotsMeta(data.robots_meta || 'index,follow')
      setSchemaType(data.schema_type || 'Article')
      setOgTitle(data.og_title || '')
      setOgDesc(data.og_description || '')
      setFaqs(data.faqs || [])
      setImageUrl(data.featured_image || '')
      if (data.featured_image) setImagePreview(data.featured_image)
      setLoading(false)
    }
    fetchArticle()
  }, [id])

  function generateSlug(text: string) {
    return text.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  function addFaq() { setFaqs([...faqs, { question: '', answer: '' }]) }
  function updateFaq(i: number, field: 'question' | 'answer', val: string) {
    const updated = [...faqs]; updated[i][field] = val; setFaqs(updated)
  }
  function removeFaq(i: number) { setFaqs(faqs.filter((_, idx) => idx !== i)) }

  async function handleSave(saveStatus: 'draft' | 'published') {
    if (!title) { setMessage('Please add a title!'); return }
    setSaving(true)
    setMessage('')

    let uploadedImageUrl = imageUrl

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `admin/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, imageFile)
      if (uploadError) { setMessage('Image upload failed: ' + uploadError.message); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName)
      uploadedImageUrl = urlData.publicUrl
      setImageUrl(uploadedImageUrl)
    }

    const { error } = await supabase
      .from('articles')
      .update({
        title,
        slug: slug || generateSlug(title),
        content,
        excerpt,
        category,
        status: saveStatus,
        seo_title: seoTitle || title,
        meta_description: metaDesc,
        focus_keyword: focusKw,
        og_title: ogTitle || seoTitle || title,
        og_description: ogDesc || metaDesc,
        img_alt: imgAlt,
        robots_meta: robotsMeta,
        schema_type: schemaType,
        featured_image: uploadedImageUrl || null,
        faqs: faqs.length > 0 ? faqs : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) { setMessage('Error: ' + error.message); setSaving(false); return }

    setMessage(saveStatus === 'published' ? '🎉 Article updated and published!' : '💾 Draft saved!')
    setSaving(false)
    setTimeout(() => router.push('/admin'), 1500)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] py-6 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/admin" className="text-white/70 text-sm hover:text-white mb-1 inline-block">← Back to Admin</Link>
            <h1 className="text-xl sm:text-2xl font-bold font-serif">⚙️ Edit Article</h1>
            <p className="text-white/70 text-sm mt-1">Admin edit — changes apply immediately</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSave('draft')} disabled={saving}
              className="px-4 py-2.5 border-2 border-white/50 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-60">
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button onClick={() => handleSave('published')} disabled={saving}
              className="px-4 py-2.5 bg-white text-[#DC2626] rounded-lg text-sm font-semibold hover:bg-white/90 transition-all disabled:opacity-60">
              {saving ? 'Saving...' : '🌐 Update & Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {message && (
          <div className={`mb-6 px-5 py-3 rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#D8F3DC] text-[#1B4332] border border-[#1B4332]/20'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Article Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg font-semibold outline-none focus:border-[#DC2626] transition-all" />
            </div>

            {/* Category + Status */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DC2626] bg-white">
                    {['Trekking','Food','Budget Travel','Hidden Gems','Transport','Packing','Culture','Biking'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DC2626] bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-3 block">🖼️ Featured Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover rounded-lg" />
                  <button onClick={() => { setImageFile(null); setImagePreview(''); setImageUrl('') }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">×</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#DC2626] transition-all"
                  onClick={() => document.getElementById('image-upload-admin')?.click()}>
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-sm font-semibold text-gray-500">Click to upload image</p>
                  <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 5MB</p>
                </div>
              )}
              <input id="image-upload-admin" type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }} />
              {!imagePreview && (
                <button onClick={() => document.getElementById('image-upload-admin')?.click()}
                  className="mt-3 w-full py-2 border border-[#DC2626] text-[#DC2626] text-sm font-semibold rounded-lg hover:bg-red-50 transition-all">
                  Choose Image
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Excerpt / Summary</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DC2626] resize-none" />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Article Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={16}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DC2626] resize-none leading-relaxed font-mono" />
              <p className="text-xs text-gray-400 mt-2">{content.length} characters</p>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-600">❓ FAQ Section</label>
                <button onClick={addFaq}
                  className="text-xs bg-[#FEE2E2] text-[#DC2626] px-3 py-1.5 rounded-lg font-semibold hover:bg-[#DC2626] hover:text-white transition-all">
                  + Add Question
                </button>
              </div>
              {faqs.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">No FAQs added yet</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-[#F9F6F0] rounded-lg p-4 relative">
                      <button onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                      <div className="mb-3 pr-6">
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Question {i + 1}</label>
                        <input type="text" value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)}
                          placeholder="e.g. Is this trek suitable for beginners?"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DC2626] bg-white" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Answer</label>
                        <textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} rows={3}
                          placeholder="Write a clear, helpful answer..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DC2626] resize-none bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pb-8">
              <button onClick={() => handleSave('draft')} disabled={saving}
                className="flex-1 py-3 border-2 border-[#DC2626] text-[#DC2626] rounded-lg text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-60">
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              <button onClick={() => handleSave('published')} disabled={saving}
                className="flex-1 py-3 bg-[#DC2626] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60">
                {saving ? 'Saving...' : '🌐 Update & Publish'}
              </button>
            </div>
          </div>

          {/* SEO Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-5 border-2 border-[#DC2626] h-fit">
            <h3 className="font-bold text-base text-[#DC2626] mb-4 pb-3 border-b border-red-100">🔍 SEO Settings</h3>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">SEO Title</label>
                  <span className={`text-xs ${seoTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{seoTitle.length}/60</span>
                </div>
                <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#DC2626]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Meta Description</label>
                  <span className={`text-xs ${metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{metaDesc.length}/160</span>
                </div>
                <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#DC2626] resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Focus Keyword</label>
                <input type="text" value={focusKw} onChange={e => setFocusKw(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#DC2626]" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-green-700 mb-1">trailsofgrowth.com › blog › {slug || 'slug'}</p>
                <p className="text-sm text-blue-700 leading-snug mb-1">{seoTitle || title || 'SEO Title'}</p>
                <p className="text-xs text-gray-500">{metaDesc || 'Meta description...'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">URL Slug</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#DC2626]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Image Alt Text</label>
                <input type="text" value={imgAlt} onChange={e => setImgAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#DC2626]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Open Graph Title</label>
                <input type="text" value={ogTitle} onChange={e => setOgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#DC2626]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Robots</label>
                  <select value={robotsMeta} onChange={e => setRobotsMeta(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white">
                    <option value="index,follow">Index, Follow</option>
                    <option value="noindex">No Index</option>
                    <option value="noindex,nofollow">No Index, No Follow</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Schema</label>
                  <select value={schemaType} onChange={e => setSchemaType(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white">
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
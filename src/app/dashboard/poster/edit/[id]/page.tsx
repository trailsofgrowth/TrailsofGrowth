'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface FAQ {
  question: string
  answer: string
}

export default function PosterEditArticlePage() {
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
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
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const supabase = createClient()
  const router = useRouter()

  function generateSlug(text: string) {
    return text.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  function addFaq() { setFaqs([...faqs, { question: '', answer: '' }]) }
  function updateFaq(i: number, field: 'question' | 'answer', val: string) {
    const updated = [...faqs]; updated[i][field] = val; setFaqs(updated)
  }
  function removeFaq(i: number) { setFaqs(faqs.filter((_, idx) => idx !== i)) }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = tagInput.trim().replace(',', '')
      if (val && !tags.includes(val)) setTags([...tags, val])
      setTagInput('')
    }
  }

  function insertFormat(format: string) {
    const textarea = document.getElementById('edit-content') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    let insertion = ''
    switch(format) {
      case 'bold': insertion = `**${selected || 'bold text'}**`; break
      case 'italic': insertion = `*${selected || 'italic text'}*`; break
      case 'h2': insertion = `\n## ${selected || 'Heading 2'}\n`; break
      case 'h3': insertion = `\n### ${selected || 'Heading 3'}\n`; break
      case 'list': insertion = `\n- ${selected || 'List item'}\n- Add more items\n`; break
      case 'link': insertion = `[${selected || 'link text'}](https://)`; break
      case 'tipbox': insertion = `\n💡 ${selected || 'Add your tip here'}\n`; break
    }
    const newContent = content.substring(0, start) + insertion + content.substring(end)
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + insertion.length
      textarea.selectionEnd = start + insertion.length
    }, 0)
  }

  useEffect(() => {
    async function fetchArticle() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('author_id', user.id)
        .single()

      if (error || !data) {
        router.push('/dashboard/poster')
        return
      }

      setTitle(data.title || '')
      setContent(data.content || '')
      setExcerpt(data.excerpt || '')
      setCategory(data.category || 'Trekking')
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

  async function handleSave(saveStatus: 'draft' | 'published') {
    if (!title) { setMessage('Please add a title!'); return }
    setSaving(true)
    setMessage('')

    let uploadedImageUrl = imageUrl

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
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
    setTimeout(() => router.push('/dashboard/poster'), 1500)
  }

  const seoScore = [!!seoTitle, !!metaDesc, !!(focusKw && title.toLowerCase().includes(focusKw.toLowerCase())), !!imgAlt, content.length > 500].filter(Boolean).length
  const seoColor = seoScore >= 4 ? '#1B4332' : seoScore >= 2 ? '#F59E0B' : '#DC2626'
  const seoLabel = seoScore >= 4 ? '✅ Good SEO' : seoScore >= 2 ? '⚠️ Needs Improvement' : '❌ Poor SEO'

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading article...</div>

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] py-6 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/dashboard/poster" className="text-white/70 text-sm hover:text-white mb-1 inline-block">← Back to Dashboard</Link>
            <h1 className="text-xl sm:text-2xl font-bold font-serif">✏️ Edit Article</h1>
            <p className="text-white/70 text-sm mt-1">Update your article and republish</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSave('draft')} disabled={saving}
              className="px-4 py-2.5 border-2 border-white/50 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-60">
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button onClick={() => handleSave('published')} disabled={saving}
              className="px-4 py-2.5 bg-[#F59E0B] text-white rounded-lg text-sm font-semibold hover:bg-[#D97706] transition-all disabled:opacity-60">
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
              <input type="text" value={title} onChange={e => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)); if(!seoTitle) setSeoTitle(e.target.value) }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg font-semibold outline-none focus:border-[#1B4332] transition-all" />
            </div>

            {/* Category + Tags */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] bg-white">
                    {['Trekking','Food','Budget Travel','Hidden Gems','Transport','Packing','Culture','Biking'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Tags (press Enter)</label>
                  <div className="flex flex-wrap gap-2 px-3 py-2 border border-gray-200 rounded-lg min-h-[46px] cursor-text"
                    onClick={() => document.getElementById('tag-edit')?.focus()}>
                    {tags.map(tag => (
                      <span key={tag} className="bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        {tag} <button onClick={() => setTags(tags.filter(t => t !== tag))} className="font-bold">×</button>
                      </span>
                    ))}
                    <input id="tag-edit" type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={addTag} placeholder="Add tag..." className="outline-none text-sm bg-transparent min-w-[80px]" />
                  </div>
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
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow">×</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#1B4332] transition-all"
                  onClick={() => document.getElementById('img-edit')?.click()}>
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm font-semibold text-gray-500">Click to upload image</p>
                  <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 5MB</p>
                </div>
              )}
              <input id="img-edit" type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if(f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }} />
              {!imagePreview && (
                <button onClick={() => document.getElementById('img-edit')?.click()}
                  className="mt-3 w-full py-2 border border-[#1B4332] text-[#1B4332] text-sm font-semibold rounded-lg hover:bg-[#D8F3DC] transition-all">
                  Choose Image
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Excerpt / Summary</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none" />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Article Content *</label>
              <div className="flex gap-2 flex-wrap mb-3 p-2 bg-[#F9F6F0] rounded-lg">
                {[{label:'Bold',format:'bold'},{label:'Italic',format:'italic'},{label:'H2',format:'h2'},{label:'H3',format:'h3'},{label:'• List',format:'list'},{label:'🔗 Link',format:'link'},{label:'💡 Tip Box',format:'tipbox'}].map(btn => (
                  <button key={btn.format} type="button" onClick={() => insertFormat(btn.format)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-semibold hover:bg-[#D8F3DC] hover:border-[#1B4332] transition-all">
                    {btn.label}
                  </button>
                ))}
              </div>
              <textarea id="edit-content" value={content} onChange={e => setContent(e.target.value)} rows={16}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none leading-relaxed font-mono" />
              <p className="text-xs text-gray-400 mt-2">{content.length} characters {content.length > 500 ? '✅' : `(${500-content.length} more for good SEO)`}</p>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-600">❓ FAQ Section</label>
                <button onClick={addFaq}
                  className="text-xs bg-[#D8F3DC] text-[#1B4332] px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1B4332] hover:text-white transition-all">
                  + Add Question
                </button>
              </div>
              {faqs.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  No FAQs yet — click &quot;Add Question&quot; to add dropdown FAQs
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-[#F9F6F0] rounded-lg p-4 relative">
                      <button onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                      <div className="mb-3 pr-6">
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Question {i+1}</label>
                        <input type="text" value={faq.question} onChange={e => updateFaq(i,'question',e.target.value)}
                          placeholder="e.g. Is this trek suitable for beginners?"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] bg-white" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Answer</label>
                        <textarea value={faq.answer} onChange={e => updateFaq(i,'answer',e.target.value)} rows={3}
                          placeholder="Write a clear, helpful answer..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1B4332] resize-none bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pb-8">
              <button onClick={() => handleSave('draft')} disabled={saving}
                className="flex-1 py-3 border-2 border-[#1B4332] text-[#1B4332] rounded-lg text-sm font-semibold hover:bg-[#D8F3DC] transition-all disabled:opacity-60">
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              <button onClick={() => handleSave('published')} disabled={saving}
                className="flex-1 py-3 bg-[#1B4332] text-white rounded-lg text-sm font-semibold hover:bg-[#2D6A4F] transition-all disabled:opacity-60">
                {saving ? 'Saving...' : '🌐 Update & Publish'}
              </button>
            </div>
          </div>

          {/* SEO Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-5 border-2 border-[#1B4332] h-fit sticky top-20">
            <h3 className="font-bold text-base text-[#1B4332] mb-4 pb-3 border-b border-[#D8F3DC]">🔍 SEO Settings</h3>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-500">SEO Score</span>
                <span className="text-xs font-semibold" style={{color: seoColor}}>{seoLabel}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{width:`${(seoScore/5)*100}%`,background:seoColor}}></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">SEO Title</label>
                  <span className={`text-xs ${seoTitle.length>60?'text-red-500':'text-gray-400'}`}>{seoTitle.length}/60</span>
                </div>
                <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Meta Description</label>
                  <span className={`text-xs ${metaDesc.length>160?'text-red-500':'text-gray-400'}`}>{metaDesc.length}/160</span>
                </div>
                <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332] resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Focus Keyword</label>
                <input type="text" value={focusKw} onChange={e => setFocusKw(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-green-700 mb-1 truncate">trailsofgrowth.com › blog › {slug || 'slug'}</p>
                <p className="text-sm text-blue-700 leading-snug mb-1 line-clamp-1">{seoTitle || title || 'SEO Title'}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{metaDesc || 'Meta description...'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">URL Slug</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Image Alt Text</label>
                <input type="text" value={imgAlt} onChange={e => setImgAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Open Graph Title</label>
                <input type="text" value={ogTitle} onChange={e => setOgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1B4332]" />
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
'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function PosterEditRedirect() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      // Redirect to write page with id param for now
      router.push(`/dashboard/poster/write?edit=${params.id}`)
    }
    check()
  }, [])

  return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
}
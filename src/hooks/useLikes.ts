import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'portfolio_liked'

export const useLikes = () => {
  const [count, setCount] = useState<number | null>(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') setLiked(true)

    const fetchCount = async () => {
      const { data } = await supabase
        .from('portfolio_likes')
        .select('count')
        .eq('id', 1)
        .single()
      if (data) setCount(data.count)
    }
    fetchCount()
  }, [])

  const toggleLike = useCallback(async () => {
    if (loading) return

    const newLiked = !liked
    const delta = newLiked ? 1 : -1
    setLoading(true)
    setLiked(newLiked)
    setCount((prev) => (prev !== null ? prev + delta : delta))

    const { data } = await supabase.rpc('increment_likes', { delta_val: delta })

    if (data !== null && data !== undefined) {
      setCount(data)
    }

    localStorage.setItem(STORAGE_KEY, String(newLiked))
    setLoading(false)
  }, [liked, loading])

  return { count, liked, toggleLike }
}

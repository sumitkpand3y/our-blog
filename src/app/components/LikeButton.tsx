'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  postId: string
  initialCount: number
  initialIsLiked: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function LikeButton({ 
  postId, 
  initialCount, 
  initialIsLiked, 
  size = 'md' 
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [count, setCount] = useState(initialCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!session || loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setCount(data.count)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={handleLike}
      disabled={!session || loading}
      className={`flex items-center space-x-2 transition-colors ${sizeClasses[size]} ${
        isLiked
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-500 hover:text-gray-700'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Heart
        className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''} ${
          loading ? 'animate-pulse' : ''
        }`}
      />
      <span>{count}</span>
    </button>
  )
}
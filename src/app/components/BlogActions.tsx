'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface BlogActionsProps {
  postId: string
  initialLikes: number
  userId?: string
}

export default function BlogActions({ postId, initialLikes, userId }: BlogActionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleLike = async () => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikes(data.likes)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleBookmark = async () => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setIsBookmarked(data.bookmarked)
      }
    } catch (error) {
      console.error('Error bookmarking post:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          } transition-colors`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleBookmark}
          className={`${
            isBookmarked ? 'text-medium-green' : 'text-gray-600 hover:text-medium-green'
          } transition-colors`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleShare}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
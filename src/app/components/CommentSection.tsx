'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
// import { formatDate } from '@/lib/utils'
import { MessageCircle, Reply, Heart, MoreHorizontal } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
  _count: {
    likes: number
  }
  isLiked?: boolean
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments(prev => [comment, ...prev])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const { isLiked, count } = await response.json()
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked,
                  _count: { likes: count }
                }
              : comment
          )
        )
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
      </div>

      {/* Add Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex space-x-3">
            <Image
              src={session.user?.image || '/default-image.png'}
              alt={session.user?.name || 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={submitting}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Please <a href="/auth/signin" className="text-blue-600 hover:underline">sign in</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
              <Image
                src={comment.author.image || '/default-image.png'}
                alt={comment.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                  <span className="text-sm text-gray-500">
                    {/* {formatDate(comment.createdAt)} */}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                <div className="flex items-center space-x-4 pt-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={!session}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      comment.isLiked
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-gray-500 hover:text-gray-700'
                    } disabled:cursor-not-allowed`}
                  >
                    <Heart
                      className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`}
                    />
                    <span>{comment._count.likes}</span>
                  </button>
                  <button
                    disabled={!session}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  {session?.user?.id === comment.author.id && (
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
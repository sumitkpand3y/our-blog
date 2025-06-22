'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/app/components/RichTextEditor'
import { ImageIcon, X, Save, Eye, Globe } from 'lucide-react'
import Image from 'next/image'

export default function EditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    tags: [] as string[],
    published: false
  })
  
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medium-green"></div>
    </div>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setPost(prev => ({ ...prev, featuredImage: data.url }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setImageLoading(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!post.tags.includes(tagInput.trim())) {
        setPost(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }))
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSave = async (publish: boolean = false) => {
    if (!post.title.trim() || !post.content.trim()) {
      alert('Please provide a title and content for your post.')
      return
    }

    setIsLoading(true)
console.log("post", post);
// return
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          published: publish,
          slug: generateSlug(post.title),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (publish) {
          router.push(`/blog/${data.slug}`)
        } else {
          router.push('/dashboard/drafts')
        }
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to save post')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('An error occurred while saving the post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Write your story</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            <span>{isLoading ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-6">
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          className="w-full text-4xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
        />
      </div>

      {/* Excerpt Input */}
      <div className="mb-6">
        <textarea
          value={post.excerpt}
          onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Write a brief description of your post..."
          className="w-full text-xl text-gray-600 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
          rows={2}
        />
      </div>

      {/* Featured Image */}
      <div className="mb-6">
        {post.featuredImage ? (
          <div className="relative">
            <Image
              src={post.featuredImage}
              alt="Featured image"
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={() => setPost(prev => ({ ...prev, featuredImage: '' }))}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                {imageLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medium-green"></div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to add a featured image</p>
                  </>
                )}
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags (press Enter to add)"
          className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
        />
      </div>

      {/* Rich Text Editor */}
      <div className="mb-8">
        <RichTextEditor
          content={post.content}
          onChange={(content) => setPost(prev => ({ ...prev, content }))}
          placeholder="Tell your story..."
        />
      </div>
    </div>
  )
}

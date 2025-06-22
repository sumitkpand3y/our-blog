'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import TagSelector from './TagSelector'
import { Save, Eye, Upload } from 'lucide-react'

// Dynamically import rich text editor
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
})

interface Tag {
  id: string
  name: string
  slug: string
}

interface PostEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
    excerpt?: string
    published: boolean
    tags: Tag[]
    coverImage?: string
  }
}

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    published: initialData?.published || false,
    tags: initialData?.tags || [],
    coverImage: initialData?.coverImage || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (publish = false) => {
    setSaving(true)
    try {
      const url = initialData?.id 
        ? `/api/posts/${initialData.id}` 
        : '/api/posts'
      
      const method = initialData?.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish,
          tagIds: formData.tags.map(tag => tag.id)
        })
      })

      if (response.ok) {
        const post = await response.json()
        router.push(`/dashboard/posts`)
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {initialData?.id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <div className="flex space-x-3">
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                coverImage: e.target.value 
              }))}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              title: e.target.value 
            }))}
            placeholder="Enter post title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (Optional)
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              excerpt: e.target.value 
            }))}
            placeholder="Brief description of your post..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <TagSelector
            selectedTags={formData.tags}
            onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
            placeholder="Add tags to help readers find your post..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        </div>
      </div>
    </div>
  )
}
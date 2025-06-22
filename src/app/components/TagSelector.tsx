'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Plus } from 'lucide-react'

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagSelectorProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
}

export default function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  placeholder = "Add tags..." 
}: TagSelectorProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (input.length > 0) {
      fetchSuggestions(input)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [input])

  const fetchSuggestions = async (search: string) => {
    try {
      const response = await fetch(`/api/tags?search=${encodeURIComponent(search)}`)
      if (response.ok) {
        const tags = await response.json()
        setSuggestions(tags.filter((tag: Tag) => 
          !selectedTags.find(selected => selected.id === tag.id)
        ))
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const addTag = async (tag: Tag | string) => {
    if (typeof tag === 'string') {
      // Create new tag
      try {
        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: tag })
        })
        
        if (response.ok) {
          const newTag = await response.json()
          onTagsChange([...selectedTags, newTag])
        }
      } catch (error) {
        console.error('Error creating tag:', error)
      }
    } else {
      // Add existing tag
      onTagsChange([...selectedTags, tag])
    }
    
    setInput('')
    setShowSuggestions(false)
  }

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      if (suggestions.length > 0) {
        addTag(suggestions[0])
      } else {
        addTag(input.trim())
      }
    } else if (e.key === 'Backspace' && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-0 outline-none bg-transparent"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {tag.name}
            </button>
          ))}
          {input.trim() && !suggestions.find(tag => 
            tag.name.toLowerCase() === input.toLowerCase()
          ) && (
            <button
              type="button"
              onClick={() => addTag(input.trim())}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create "{input.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}
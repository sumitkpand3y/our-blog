import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    author: {
      name: string
      image: string
      username: string
    }
    publishedAt: string
    readTime: number
    tags: string[]
    image?: string
    slug: string
    likes: number
    comments: number
  }
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <article className="py-8 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Content */}
        <div className="flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/profile/${post.author.username}`}>
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            </Link>
            <Link 
              href={`/profile/${post.author.username}`}
              className="text-sm text-gray-700 hover:text-black"
            >
              {post.author.name}
            </Link>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-500">
              {formatDate(post.publishedAt)}
            </span>
          </div>

          {/* Title & Excerpt */}
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-gray-700 transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 text-base mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase()}`}
                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{post.readTime} min read</span>
              <button className="flex items-center gap-1 hover:text-gray-700">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-gray-700">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
            </div>

            <button className="text-gray-400 hover:text-gray-700">
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="sm:w-32 sm:h-32 w-full h-48 flex-shrink-0">
            <Link href={`/blog/${post.slug}`}>
              <Image
                src={post.image}
                alt={post.title}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded"
              />
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
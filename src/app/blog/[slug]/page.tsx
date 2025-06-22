// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '../../../lib/db'
// import { formatDate } from '../../../lib/utils'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import BlogActions from '@/app/components/BlogActions'
import CommentSection from '@/app/components/CommentSection'

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          username:true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    }
  })

  if (!post || !post.published) {
    return null
  }

  return post
}

export async function generateMetadata(props: BlogDetailPageProps): Promise<Metadata> {
    const slug = props.params.slug;
    
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name || 'Anonymous'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
    }
  }
}

export default async function BlogDetailPage(props: BlogDetailPageProps) {
    const slug = props.params.slug;
  const post = await getBlogPost(slug)
  
  const session = await getServerSession(authOptions)

  if (!post) {
    notFound()
  }

  const isAuthor = session?.user?.id === post.author.id

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href={`/profile/${post.author.id}`} className="flex items-center space-x-3">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {post.author.name?.charAt(0) || 'A'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 hover:text-medium-green">
                  {post.author.name}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <time dateTime={post.createdAt.toISOString()}>
                    {/* {formatDate(post.createdAt)} */}
                  </time>
                  <span>·</span>
                  <span>{Math.ceil(post.content.length / 1000)} min read</span>
                </div>
              </div>
            </Link>
          </div>

          {isAuthor && (
            <div className="flex items-center space-x-2">
              <Link
                href={`/editor/${post.id}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Edit
              </Link>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              priority
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="text-gray-900 leading-relaxed"
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="border-t border-b border-gray-200 py-4 mb-8">
        <BlogActions 
          postId={post.id} 
          initialLikes={post._count.likes}
          userId={session?.user?.id}
        />
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name || 'Author'}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-xl">
                {post.author.name?.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {post.author.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Writer and developer sharing insights about technology, creativity, and life.
            </p>
            <div className="flex space-x-4">
              <Link
                href={`/${post.author.username}`}
                className="text-medium-green hover:text-green-600 font-medium"
              >
                View Profile
              </Link>
              <button className="text-medium-green hover:text-green-600 font-medium">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} />
    </article>
  )
}
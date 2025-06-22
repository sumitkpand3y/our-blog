'use client'

import { useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Calendar, Heart, Bookmark, MessageCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProfileTabsProps {
  username: string
}

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  content: string
  publishedAt: string
  readingTime: number
  featured: boolean
  tags: Array<{ id: string; name: string }>
  author: {
    id: string
    username: string
    name: string
    image: string
  }
  _count: {
    likes: number
    comments: number
    bookmarks: number
  }
}

export default function ProfileTabs({ username }: ProfileTabsProps) {
  console.log(username);
  
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="likes">Liked</TabsTrigger>
        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <PostsTab username={username} />
      </TabsContent>

      <TabsContent value="likes" className="mt-6">
        <LikedPostsTab username={username} />
      </TabsContent>

      <TabsContent value="bookmarks" className="mt-6">
        <BookmarksTab username={username} />
      </TabsContent>

      <TabsContent value="about" className="mt-6">
        <AboutTab username={username} />
      </TabsContent>
    </Tabs>
  )
}

// Posts Tab Component
function PostsTab({ username }: { username: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery<Post[], Error>({
    queryKey: ['user-posts', username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/users/${username}/posts?page=${pageParam}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined
    }
  })

  const posts = data?.pages.flat() || []

  if (isLoading) {
    return <PostsSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load posts. Please try again.
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-600">
            @{username} hasn't published any posts yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}
    </div>
  )
}

// Liked Posts Tab Component
function LikedPostsTab({ username }: { username: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['user-likes', username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/users/${username}/likes?page=${pageParam}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch liked posts')
      return response.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any[], pages: any[][]) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined
    }
  })

  const likedPosts = data?.pages.flat() || []

  if (isLoading) {
    return <PostsSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load liked posts. Please try again.
      </div>
    )
  }

  if (likedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No liked posts</h3>
          <p className="text-gray-600">
            @{username} hasn't liked any posts yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {likedPosts.map((like: any) => (
          <PostCard key={like.post.id} post={like.post} showLikedDate={like.createdAt} />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}

// Bookmarks Tab Component
function BookmarksTab({ username }: { username: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['user-bookmarks', username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/users/${username}/bookmarks?page=${pageParam}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch bookmarks')
      return response.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any[], pages: any[][]) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined
    }
  })
//   })

  const bookmarks = data?.pages.flat() || []

  if (isLoading) {
    return <PostsSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load bookmarks. Please try again.
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No bookmarks</h3>
          <p className="text-gray-600">
            @{username} hasn't bookmarked any posts yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {bookmarks.map((bookmark: any) => (
          <PostCard 
            key={bookmark.post.id} 
            post={bookmark.post} 
            showBookmarkedDate={bookmark.createdAt} 
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}

// About Tab Component
function AboutTab({ username }: { username: string }) {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      const response = await fetch(`/api/users/${username}`)
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
        <div className="animate-pulse bg-gray-200 h-24 rounded-lg" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load profile information.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bio Section */}
      {profile.bio && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Details Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            {profile.location && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 text-gray-500">📍</div>
                <span className="text-sm text-gray-600">{profile.location}</span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 text-gray-500">🔗</div>
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      {(profile.twitter || profile.github || profile.linkedin) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Social Links</h3>
            <div className="space-y-3">
              {profile.twitter && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 text-gray-500">🐦</div>
                  <a 
                    href={`https://twitter.com/${profile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    @{profile.twitter}
                  </a>
                </div>
              )}

              {profile.github && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 text-gray-500">⚡</div>
                  <a 
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    github.com/{profile.github}
                  </a>
                </div>
              )}

              {profile.linkedin && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 text-gray-500">💼</div>
                  <a 
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    linkedin.com/in/{profile.linkedin}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profile.stats.postsCount}</div>
              <div className="text-sm text-gray-600">Posts Published</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile.stats.followersCount}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{profile.stats.followingCount}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Post Card Component
function PostCard({ 
  post, 
  showLikedDate, 
  showBookmarkedDate 
}: { 
  post: Post
  showLikedDate?: string
  showBookmarkedDate?: string
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Author image */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10">
              <Image
                src={post.author.image || '/default-image.png'}
                alt={post.author.name || post.author.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/@${post.author.username}`}
                className="font-medium hover:underline"
              >
                {post.author.name || post.author.username}
              </Link>
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              {post.featured && (
                <Badge variant="secondary" className="ml-2">
                  Featured
                </Badge>
              )}
            </div>

            {/* Special Dates */}
            {showLikedDate && (
              <div className="text-xs text-gray-500 mb-2">
                ❤️ Liked on {new Date(showLikedDate).toLocaleDateString()}
              </div>
            )}
            {showBookmarkedDate && (
              <div className="text-xs text-gray-500 mb-2">
                🔖 Bookmarked on {new Date(showBookmarkedDate).toLocaleDateString()}
              </div>
            )}

            {/* Title and Excerpt */}
            <Link href={`/@${post.author.username}/${post.slug}`}>
              <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map(tag => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post._count.likes}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post._count.comments}
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                {post._count.bookmarks}
              </div>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton
function PostsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
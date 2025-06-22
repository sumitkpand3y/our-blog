'use client'

import { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import PostCard from './PostCard'
import { Button } from './ui/button'

export default function Feed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/feed?page=${pageParam}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch feed')
      return response.json()
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined
    }
  })

  const posts = data?.pages.flat() || []

  if (isLoading) {
    return <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
      ))}
    </div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">
      Failed to load feed. Please try again.
    </div>
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Your feed is empty</h3>
        <p className="text-gray-600 mb-4">
          Follow some users to see their posts in your feed
        </p>
        <Button asChild>
          <Link href="/explore">Discover Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
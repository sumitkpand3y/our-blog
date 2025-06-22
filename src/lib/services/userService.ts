import { prisma } from '@/lib/db'

export class UserService {
  static async getPublicProfile(username: string, currentUserId?: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        website: true,
        twitter: true,
        linkedin: true,
        github: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            posts: { where: { published: true } },
            // followers: true,
            // following: true
          }
        }
      }
    })
    if (!user) {
      throw new Error('User not found')
    }

    let isFollowing = false
    if (currentUserId && currentUserId !== user.id) {
      isFollowing = await FollowService.isFollowing(currentUserId, user.id)
    }

    return {
      ...user,
      isFollowing,
      stats: {
        postsCount: user._count.posts,
        followersCount: user._count.followers,
        followingCount: user._count.following
      }
    }
  }

  static async getUserPosts(username: string, page = 1, limit = 10) {
    const posts = await prisma.post.findMany({
      where: {
        author: { username },
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return posts
  }

  static async updateProfile(userId: string, data: {
    name?: string
    bio?: string
    image?: string
    website?: string
    twitter?: string
    linkedin?: string
    github?: string
    location?: string
  }) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        website: true,
        twitter: true,
        linkedin: true,
        github: true,
        location: true
      }
    })
  }
}
import { prisma } from '@/lib/db'

export class FollowService {
  static async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself')
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })

    if (existingFollow) {
      throw new Error('Already following this user')
    }

    return await prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    })
  }

  static async unfollowUser(followerId: string, followingId: string) {
    return await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })
  }

  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })
    return !!follow
  }

  static async getFollowStats(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: { followingId: userId }
      }),
      prisma.follow.count({
        where: { followerId: userId }
      })
    ])

    return {
      followersCount,
      followingCount
    }
  }

  static async getFollowers(userId: string, page = 1, limit = 20) {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return followers.map(f => f.follower)
  }

  static async getFollowing(userId: string, page = 1, limit = 20) {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return following.map(f => f.following)
  }

  static async getFeedPosts(userId: string, page = 1, limit = 10) {
    // Get posts from followed users
    const posts = await prisma.post.findMany({
      where: {
        author: {
          followers: {
            some: {
              followerId: userId
            }
          }
        },
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
}
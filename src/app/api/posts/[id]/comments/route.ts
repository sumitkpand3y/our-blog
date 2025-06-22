import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: postId } = context.params
    const session = await getServerSession(authOptions)
    
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username:true
          }
        },
        _count: {
          select: {
            likes: true
          }
        },
        likes: session ? {
          where: {
            userId: session.user.id
          }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    })

    const commentsWithLikeStatus = comments.map(comment => ({
      ...comment,
      isLiked: session ? comment.likes.length > 0 : false,
      likes: undefined // Remove likes array from response
    }))

    return NextResponse.json(commentsWithLikeStatus)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: postId } = context.params
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username:true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    return NextResponse.json({
      ...comment,
      isLiked: false
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
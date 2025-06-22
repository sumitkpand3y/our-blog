import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username:true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user can access this post
    if (!post.published && post.authorId !== session?.user?.id) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, excerpt, content, featuredImage, tags, published, slug } = await request.json()

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if new slug conflicts with existing posts
    if (slug !== existingPost.slug) {
      const slugConflict = await prisma.post.findUnique({
        where: { slug }
      })

      if (slugConflict) {
        return NextResponse.json(
          { message: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        excerpt,
        content,
        featuredImage,
        tags,
        published,
        slug,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username:true
          }
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService } from '@/lib/services/userService'
import { prisma } from '@/lib/db'
import { FollowService } from '@/lib/services/followService'

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get target user ID
    const targetUser = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await FollowService.followUser(session.user.id, targetUser.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to follow user' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get target user ID
    const targetUser = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await FollowService.unfollowUser(session.user.id, targetUser.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 400 }
    )
  }
}

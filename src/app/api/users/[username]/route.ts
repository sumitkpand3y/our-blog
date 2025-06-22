import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService } from '@/lib/services/userService'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const profile = await UserService.getPublicProfile(
      params.username,
      session?.user?.id
    )

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/userService'

export async function GET(
  request: NextRequest,
  context: { params: { username: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const { username } = context.params

    const posts = await UserService.getUserPosts(username, page, limit)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('[API ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

import { authOptions } from "@/lib/auth"
import { UserService } from "@/lib/services/userService"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const updatedProfile = await UserService.updateProfile(session.user.id, data)
    
    return NextResponse.json(updatedProfile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
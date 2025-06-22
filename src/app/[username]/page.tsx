import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService } from '@/lib/services/userService'
import ProfileHeader from './components/ProfileHeader'
import ProfileTabs from './components/ProfileTabs'

interface ProfilePageProps {
  params: { username: string }
}

export async function generateMetadata(props: ProfilePageProps): Promise<Metadata> {
  
  try {
    const { username } = props.params
    const profile = await UserService.getPublicProfile(username)
    return {
      title: `${profile.name || profile.username} - Your Platform`,
      description: profile.bio || `${profile.name || profile.username}'s profile`
    }
  } catch {
    return {
      title: 'User not found'
    }
  }
}

export default async function ProfilePage(props: ProfilePageProps) {
  
  try {
    const { username } = props.params
    
    const session = await getServerSession(authOptions)
    
    const profile = await UserService.getPublicProfile(
      username,
      session?.user?.id
    )

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader profile={profile} currentUserId={session?.user?.id} />
        <ProfileTabs username={username} />
      </div>
    )
  } catch {
    notFound()
  }
}
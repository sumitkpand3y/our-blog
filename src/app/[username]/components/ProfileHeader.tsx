'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Calendar, MapPin, Link as LinkIcon, Twitter, Github, Linkedin } from 'lucide-react'

interface ProfileHeaderProps {
  profile: any
  currentUserId?: string
}

export default function ProfileHeader({ profile, currentUserId }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${profile.username}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST'
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
      }
    } catch (error) {
      console.error('Follow error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isOwnProfile = currentUserId === profile.id

  return (
    <div className="border-b pb-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* image */}
        <div className="relative w-32 h-32 mx-auto md:mx-0">
          <Image
            src={profile.image || '/default-image.png'}
            alt={profile.name || profile.username}
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{profile.name || profile.username}</h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button variant="outline" asChild>
                  <Link href="/settings/profile">Edit Profile</Link>
                </Button>
              ) : currentUserId ? (
                <Button
                  onClick={handleFollow}
                  disabled={isLoading}
                  variant={isFollowing ? 'outline' : 'default'}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              ) : null}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 mb-4">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="w-5 h-5 text-gray-600 hover:text-blue-600" />
              </a>
            )}
            {profile.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-600" />
              </a>
            )}
            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 text-gray-600 hover:text-blue-600" />
              </a>
            )}
            {profile.linkedin && (
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600" />
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold">{profile.stats.postsCount}</span>
              <span className="text-gray-600 ml-1">Posts</span>
            </div>
            <Link href={`/${profile.username}/followers`} className="hover:underline">
              <span className="font-semibold">{profile.stats.followersCount}</span>
              <span className="text-gray-600 ml-1">Followers</span>
            </Link>
            <Link href={`/${profile.username}/following`} className="hover:underline">
              <span className="font-semibold">{profile.stats.followingCount}</span>
              <span className="text-gray-600 ml-1">Following</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
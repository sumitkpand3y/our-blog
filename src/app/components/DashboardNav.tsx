'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Home, 
  PenTool, 
  FileText, 
  Settings, 
  User,
  LogOut 
} from 'lucide-react'

// const navItems = [
//   { href: '/dashboard', label: 'Overview', icon: Home },
//   { href: '/dashboard/posts', label: 'Posts', icon: FileText },
//   { href: '/dashboard/drafts', label: 'Drafts', icon: PenTool },
//   { href: '/dashboard/profile', label: 'Profile', icon: User },
//   { href: '/dashboard/settings', label: 'Settings', icon: Settings },
// ]

export default function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const username = session?.user?.username
  

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/posts', label: 'Posts', icon: FileText },
    { href: '/dashboard/drafts', label: 'Drafts', icon: PenTool },
    { href: username ? `/${username}` : '/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Blog
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
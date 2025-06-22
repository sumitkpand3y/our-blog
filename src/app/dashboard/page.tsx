import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { 
  FileText, 
  Eye, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Users
} from 'lucide-react'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  const [posts, drafts, totalViews, totalLikes] = await Promise.all([
    prisma.post.count({
      where: { authorId: session?.user?.id, published: true }
    }),
    prisma.post.count({
      where: { authorId: session?.user?.id, published: false }
    }),
    // You'll need to add view tracking
    0, // placeholder
    prisma.like.count({
      where: { 
        post: { authorId: session?.user?.id } 
      }
    })
  ])

  const stats = [
    { title: 'Published Posts', value: posts, icon: FileText, color: 'blue' },
    { title: 'Drafts', value: drafts, icon: FileText, color: 'gray' },
    { title: 'Total Views', value: totalViews, icon: Eye, color: 'green' },
    { title: 'Total Likes', value: totalLikes, icon: Heart, color: 'red' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-500`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          {/* Add recent posts list */}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          {/* Add analytics chart */}
        </div>
      </div>
    </div>
  )
}
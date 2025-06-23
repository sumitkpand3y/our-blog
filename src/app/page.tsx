"use client"
// import PostCard from '@/app/components/PostCard'
// import Link from 'next/link'

// // Mock data - In real app, this would come from your API/database
// const mockPosts = [
//   {
//     id: '1',
//     title: 'Building a Medium Clone with Next.js and TypeScript',
//     excerpt: 'Learn how to create a modern blog platform using the latest web technologies. We\'ll cover everything from setup to deployment.',
//     author: {
//       name: 'John Developer',
//       image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
//       username: 'johndev'
//     },
//     publishedAt: '2024-01-15',
//     readTime: 8,
//     tags: ['Next.js', 'TypeScript', 'Web Development'],
//     image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
//     slug: 'building-medium-clone-nextjs-typescript',
//     likes: 142,
//     comments: 23
//   },
//   {
//     id: '2',
//     title: 'The Future of React: What\'s Coming in 2024',
//     excerpt: 'Explore the latest React features and what the future holds for this popular JavaScript library.',
//     author: {
//       name: 'Sarah Tech',
//       image: 'https://images.unsplash.com/photo-1494790108755-2616b852e6f6?w=40&h=40&fit=crop&crop=face',
//       username: 'sarahtech'
//     },
//     publishedAt: '2024-01-12',
//     readTime: 6,
//     tags: ['React', 'JavaScript', 'Frontend'],
//     image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
//     slug: 'future-of-react-2024',
//     likes: 89,
//     comments: 15
//   },
//   {
//     id: '3',
//     title: 'Mastering Tailwind CSS: Advanced Tips and Tricks',
//     excerpt: 'Take your Tailwind CSS skills to the next level with these advanced techniques and best practices.',
//     author: {
//       name: 'Alex Designer',
//       image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
//       username: 'alexdesigner'
//     },
//     publishedAt: '2024-01-10',
//     readTime: 12,
//     tags: ['CSS', 'Tailwind', 'Design'],
//     slug: 'mastering-tailwind-css-advanced-tips',
//     likes: 67,
//     comments: 8
//   },
//   {
//     id: '4',
//     title: 'Database Design Patterns for Modern Applications',
//     excerpt: 'Understanding database design patterns that scale with your application growth.',
//     author: {
//       name: 'Mike Backend',
//       image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
//       username: 'mikebackend'
//     },
//     publishedAt: '2024-01-08',
//     readTime: 15,
//     tags: ['Database', 'Backend', 'Architecture'],
//     image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
//     slug: 'database-design-patterns-modern-applications',
//     likes: 234,
//     comments: 45
//   },
//   {
//     id: '5',
//     title: 'Understanding Serverless Architecture',
//     excerpt: 'A comprehensive guide to serverless computing and when to use it in your projects.',
//     author: {
//       name: 'Emma Cloud',
//       image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
//       username: 'emmacloud'
//     },
//     publishedAt: '2024-01-05',
//     readTime: 10,
//     tags: ['Serverless', 'Cloud', 'AWS'],
//     slug: 'understanding-serverless-architecture',
//     likes: 156,
//     comments: 32
//   }
// ]

// const trendingTags = [
//   'Programming', 'JavaScript', 'React', 'Next.js', 'TypeScript', 
//   'Web Development', 'CSS', 'Node.js', 'Database', 'Career'
// ]

// export default function HomePage() {
//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <section className="bg-medium-light-gray border-b border-gray-200">
//         <div className="container-custom py-20">
//           <div className="max-w-2xl">
//             <h1 className="text-6xl sm:text-7xl font-normal text-black mb-6">
//               Human <br />
//               stories & ideas
//             </h1>
//             <p className="text-xl text-gray-700 mb-8">
//               A place to read, write, and deepen your understanding
//             </p>
//             <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
//               Start reading
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <div className="container-custom py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* Posts Feed */}
//           <div className="lg:col-span-2">
//             <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
//               <button className="pb-4 border-b border-black text-sm font-medium">
//                 For you
//               </button>
//               <button className="pb-4 text-sm text-gray-500 hover:text-black">
//                 Following
//               </button>
//             </div>

//             <div className="space-y-0">
//               {mockPosts.map((post) => (
//                 <PostCard key={post.id} post={post} />
//               ))}
//             </div>

//             {/* Load More */}
//             <div className="text-center mt-12">
//               <button className="btn-secondary">
//                 Load more stories
//               </button>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24">
//               {/* Trending Tags */}
//               <div className="mb-8">
//                 <h3 className="text-sm font-semibold text-gray-900 mb-4">
//                   Discover more of what matters to you
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {trendingTags.map((tag) => (
//                     <Link
//                       key={tag}
//                       href={`/tags/${tag.toLowerCase()}`}
//                       className="inline-block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 transition-colors"
//                     >
//                       {tag}
//                     </Link>
//                   ))}
//                 </div>
//               </div>

//               {/* Reading List */}
//               <div className="mb-8">
//                 <h3 className="text-sm font-semibold text-gray-900 mb-4">
//                   Reading list
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Click the bookmark icon on any story to easily add it to your reading list or a custom list that you can share.
//                 </p>
//               </div>

//               {/* Footer Links */}
//               <div className="text-xs text-gray-500 space-y-1">
//                 <div className="flex flex-wrap gap-4">
//                   <Link href="/help" className="hover:text-gray-700">Help</Link>
//                   <Link href="/status" className="hover:text-gray-700">Status</Link>
//                   <Link href="/about" className="hover:text-gray-700">About</Link>
//                 </div>
//                 <div className="flex flex-wrap gap-4">
//                   <Link href="/careers" className="hover:text-gray-700">Careers</Link>
//                   <Link href="/press" className="hover:text-gray-700">Press</Link>
//                   <Link href="/blog" className="hover:text-gray-700">Blog</Link>
//                 </div>
//                 <div className="flex flex-wrap gap-4">
//                   <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
//                   <Link href="/terms" className="hover:text-gray-700">Terms</Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useSession } from 'next-auth/react';
import LandingPage from '@/app/components/LandingPage';
import Dashboard from '@/app/components/Dashboard';
import Navbar from '@/app/components/Navbar';
import Head from 'next/head';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Medium - Where good ideas find you</title>
        <meta name="description" content="Medium is an open platform where readers find dynamic thinking, and where expert and undiscovered voices can share their writing on any topic." />
      </Head>
      
      {/* <Navbar /> */}
      
      {/* Show different content based on authentication status */}
      {session ? <Dashboard /> : <LandingPage />}
    </>
  );
}
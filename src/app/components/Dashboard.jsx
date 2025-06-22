import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);
  const mockPosts = [
    {
      id: "1",
      title: "Building a Medium Clone with Next.js and TypeScript",
      excerpt:
        "Learn how to create a modern blog platform using the latest web technologies. We'll cover everything from setup to deployment.",
      author: {
        name: "John Developer",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        username: "johndev",
      },
      publishedAt: "2024-01-15",
      readTime: 8,
      tags: ["Next.js", "TypeScript", "Web Development"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      slug: "building-medium-clone-nextjs-typescript",
      likes: 142,
      comments: 23,
    },
    {
      id: "2",
      title: "The Future of React: What's Coming in 2024",
      excerpt:
        "Explore the latest React features and what the future holds for this popular JavaScript library.",
      author: {
        name: "Sarah Tech",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b852e6f6?w=40&h=40&fit=crop&crop=face",
        username: "sarahtech",
      },
      publishedAt: "2024-01-12",
      readTime: 6,
      tags: ["React", "JavaScript", "Frontend"],
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
      slug: "future-of-react-2024",
      likes: 89,
      comments: 15,
    },
    {
      id: "3",
      title: "Mastering Tailwind CSS: Advanced Tips and Tricks",
      excerpt:
        "Take your Tailwind CSS skills to the next level with these advanced techniques and best practices.",
      author: {
        name: "Alex Designer",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        username: "alexdesigner",
      },
      publishedAt: "2024-01-10",
      readTime: 12,
      tags: ["CSS", "Tailwind", "Design"],
      slug: "mastering-tailwind-css-advanced-tips",
      likes: 67,
      comments: 8,
    },
    {
      id: "4",
      title: "Database Design Patterns for Modern Applications",
      excerpt:
        "Understanding database design patterns that scale with your application growth.",
      author: {
        name: "Mike Backend",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
        username: "mikebackend",
      },
      publishedAt: "2024-01-08",
      readTime: 15,
      tags: ["Database", "Backend", "Architecture"],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      slug: "database-design-patterns-modern-applications",
      likes: 234,
      comments: 45,
    },
    {
      id: "5",
      title: "Understanding Serverless Architecture",
      excerpt:
        "A comprehensive guide to serverless computing and when to use it in your projects.",
      author: {
        name: "Emma Cloud",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        username: "emmacloud",
      },
      publishedAt: "2024-01-05",
      readTime: 10,
      tags: ["Serverless", "Cloud", "AWS"],
      slug: "understanding-serverless-architecture",
      likes: 156,
      comments: 32,
    },
  ];

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (data) {
        setPosts(data.posts);
      } else {
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                <button className="border-b-2 border-gray-900 py-2 text-sm font-medium text-gray-900">
                  For you
                </button>
                <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Following
                </button>
                <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center">
                  Featured
                  <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    New
                  </span>
                </button>
                <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  React
                </button>
                <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Web Development
                </button>
              </nav>
            </div>

            {/* Posts Feed */}
            <div className="space-y-8">
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="flex items-center space-x-4">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                posts?.map((post) => (
                  <article
                    key={post.id}
                    className="border-b border-gray-100 pb-8"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Image
                        src={post.author.image || "/default-image.jpg"}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">{post.author.name}</span>
                        <span>in</span>
                        <span className="font-medium">
                          {post.category || "General"}
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="md:col-span-3">
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{post.readTime || "5 min read"}</span>
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              <span>{post.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span>{post.comments || 0}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                              </svg>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {post.featuredImage && (
                        <div className="md:col-span-1">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            width={200}
                            height={134}
                            className="rounded-lg object-cover w-full h-32"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-8">
              {/* Staff Picks */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Staff Picks</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src="/obama-image.jpg"
                      alt="Barack Obama"
                      width={24}
                      height={24}
                      className="rounded-full mt-1"
                    />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Barack Obama</h4>
                      <Link
                        href="/blog/conversation-connecticut-forum"
                        className="text-sm text-gray-900 hover:text-gray-700"
                      >
                        Conversation at The Connecticut Forum
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">3d ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Topics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Recommended topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Politics",
                    "Cryptocurrency",
                    "Python",
                    "Business",
                    "Science",
                    "Life",
                    "UX",
                  ].map((topic) => (
                    <button
                      key={topic}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <button className="text-green-600 text-sm mt-3 hover:text-green-700">
                  See more topics
                </button>
              </div>

              {/* Membership Prompt */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900 mb-2">
                      Get unlimited access to the best of Medium for less than
                      $1/week.
                    </p>
                    <button className="text-sm text-green-600 font-medium hover:text-green-700">
                      Become a member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

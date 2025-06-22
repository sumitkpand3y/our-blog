// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockPosts = [
  {
    id: '1',
    title: 'Building a Medium Clone with Next.js and TypeScript',
    excerpt: 'Learn how to create a modern blog platform using the latest web technologies. We\'ll cover everything from setup to deployment.',
    author: {
      name: 'John Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      username: 'johndev'
    },
    publishedAt: '2024-01-15',
    readTime: 8,
    tags: ['Next.js', 'TypeScript', 'Web Development'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
    slug: 'building-medium-clone-nextjs-typescript',
    likes: 142,
    comments: 23
  },
  {
    id: '2',
    title: 'The Future of React: What\'s Coming in 2024',
    excerpt: 'Explore the latest React features and what the future holds for this popular JavaScript library.',
    author: {
      name: 'Sarah Tech',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b852e6f6?w=40&h=40&fit=crop&crop=face',
      username: 'sarahtech'
    },
    publishedAt: '2024-01-12',
    readTime: 6,
    tags: ['React', 'JavaScript', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
    slug: 'future-of-react-2024',
    likes: 89,
    comments: 15
  },
  {
    id: '3',
    title: 'Mastering Tailwind CSS: Advanced Tips and Tricks',
    excerpt: 'Take your Tailwind CSS skills to the next level with these advanced techniques and best practices.',
    author: {
      name: 'Alex Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      username: 'alexdesigner'
    },
    publishedAt: '2024-01-10',
    readTime: 12,
    tags: ['CSS', 'Tailwind', 'Design'],
    slug: 'mastering-tailwind-css-advanced-tips',
    likes: 67,
    comments: 8
  },
  {
    id: '4',
    title: 'Database Design Patterns for Modern Applications',
    excerpt: 'Understanding database design patterns that scale with your application growth.',
    author: {
      name: 'Mike Backend',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
      username: 'mikebackend'
    },
    publishedAt: '2024-01-08',
    readTime: 15,
    tags: ['Database', 'Backend', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    slug: 'database-design-patterns-modern-applications',
    likes: 234,
    comments: 45
  },
  {
    id: '5',
    title: 'Understanding Serverless Architecture',
    excerpt: 'A comprehensive guide to serverless computing and when to use it in your projects.',
    author: {
      name: 'Emma Cloud',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      username: 'emmacloud'
    },
    publishedAt: '2024-01-05',
    readTime: 10,
    tags: ['Serverless', 'Cloud', 'AWS'],
    slug: 'understanding-serverless-architecture',
    likes: 156,
    comments: 32
  }
]

async function main() {
  for (const post of mockPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: "This is mock content for the post.",
        slug: post.slug,
        image: post.image || '',
        publishedAt: new Date(post.publishedAt),
        published: true,
        readTime: post.readTime,
        author: {
          connectOrCreate: {
            where: { email: `${post.author.username}@example.com` },
            create: {
              name: post.author.name,
              email: `${post.author.username}@example.com`,
              image: post.author.image,
              username:post.author.username
            },
          },
        },
      },
    })
  }
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: { name: 'JavaScript', slug: 'javascript' }
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' }
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' }
    }),
    prisma.tag.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: { name: 'Web Development', slug: 'web-development' }
    })
  ])
}

main()
  .then(() => console.log('✅ Seeding complete'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())

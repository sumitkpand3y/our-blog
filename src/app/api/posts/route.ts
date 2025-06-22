import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(tag && {
        tags: {
          some: {
            slug: tag,
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true,
            },
          },
          tags: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, excerpt, published, tagIds, coverImage, tags } =
      await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    // Validate tags (slugs → IDs)
    let validTags: { id: string }[] = [];

    if (tags && tags.length > 0) {
      validTags = await prisma.tag.findMany({
        where: { slug: { in: tags } },
        select: { id: true },
      });

      if (validTags.length !== tags.length) {
        return NextResponse.json(
          { error: "Some tags are invalid or missing" },
          { status: 400 }
        );
      }
    }

    const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug;

    // Step 1: Create Post (❌ remove tags.connect here)
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug: finalSlug,
        published: !!published,
        coverImage,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Step 2: Create PostTag relations manually ✅
    if (validTags.length > 0) {
      await prisma.postTag.createMany({
        data: validTags.map((tag) => ({
          postId: post.id,
          tagId: tag.id,
          authorId: session.user.id,
        })),
      });
    }
console.log("validTags", validTags);

    // Step 3: Update tag counts ✅
    if (validTags.length > 0) {
      await prisma.tag.updateMany({
        where: {
          id: {
            in: validTags.map((tag) => tag.id), // ✅ make sure it's a list of strings, not objects
          },
        },
        data: {
          count: { increment: 1 }, // ✅ only if `count` column exists
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

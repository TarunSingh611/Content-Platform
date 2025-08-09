// src/app/api/content/route.ts
import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      content,
      description,
      excerpt,
      coverImage,
      tags,
      published,
      featured,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = await req.json();

    const coerceToBoolean = (value: unknown): boolean =>
      value === true || value === 'true' || value === 1 || value === '1';

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    const newContent = await prisma.content.create({
      data: {
        title,
        content,
        description,
        excerpt,
        coverImage,
        tags: Array.isArray(tags) ? tags : [],
        published: coerceToBoolean(published),
        featured: coerceToBoolean(featured),
        seoTitle,
        seoDescription,
        seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
        slug,
        readingTime,
        author: {
          connect: { id: session.user.id }
        }
      }
    });

    return NextResponse.json(newContent);
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contents = await prisma.content.findMany({
      where: {
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}
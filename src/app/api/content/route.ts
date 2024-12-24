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

    const { title, content, description, published } = await req.json();

    const newContent = await prisma.content.create({
      data: {
        title,
        content,
        description,
        published: published || false,
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
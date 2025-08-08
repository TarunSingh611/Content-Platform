import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const content = await prisma.content.findUnique({
      where: { 
        id: id,
        authorId: session.user.id // Ensure user can only access their own content
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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
      seoKeywords
    } = await req.json();

    const updatedContent = await prisma.content.update({
      where: { 
        id: id,
        authorId: session.user.id // Ensure user can only update their own content
      },
      data: {
        title,
        content,
        description,
        excerpt,
        coverImage,
        tags: tags || [],
        published: published || false,
        featured: featured || false,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords || [],
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.content.delete({
      where: { 
        id: id,
        authorId: session.user.id // Ensure user can only delete their own content
      },
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}

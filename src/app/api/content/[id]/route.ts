// src/app/api/content/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, description, published } = await req.json();

    const updatedContent = await prisma.content.update({
      where: {
        id: params.id,
        authorId: session.user.id // Ensure user owns the content
      },
      data: {
        title,
        content,
        description,
        published
      }
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.content.delete({
      where: {
        id: params.id,
        authorId: session.user.id // Ensure user owns the content
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
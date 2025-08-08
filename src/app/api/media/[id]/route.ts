import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';
import { deleteFromImageKit } from '@/lib/utils/imagekit';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get media from database
    const media = await prisma.media.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Extract file ID from URL (ImageKit file ID)
    const urlParts = media.url.split('/');
    const fileId = urlParts[urlParts.length - 1].split('?')[0];

    // Delete from ImageKit
    try {
      await deleteFromImageKit(fileId);
    } catch (error) {
      console.error('Error deleting from ImageKit:', error);
      // Continue with database deletion even if ImageKit deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title } = await req.json();

    // Update media in database
    const updatedMedia = await prisma.media.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
      },
    });

    return NextResponse.json({
      message: 'Media updated successfully',
      media: updatedMedia,
    });
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

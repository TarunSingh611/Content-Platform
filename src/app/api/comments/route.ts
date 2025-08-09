import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

// Create a comment (top-level or reply)
export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { contentId, text, parentId } = await req.json()
    if (!contentId || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const created = await prisma.comment.create({
      data: {
        text,
        content: { connect: { id: contentId } },
        user: { connect: { id: session.user.id } },
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      },
    })

    // Increment content.comments counter for top-level only
    if (!parentId) {
      await prisma.content.update({
        where: { id: contentId },
        data: { comments: { increment: 1 } },
      })
    }

    return NextResponse.json(created)
  } catch (err) {
    console.error('Error creating comment:', err)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

// List comments for a content (returns tree up to 2 levels)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const contentId = searchParams.get('contentId')
    if (!contentId) return NextResponse.json({ error: 'contentId required' }, { status: 400 })

    const comments = await prisma.comment.findMany({
      where: { contentId, parentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (err) {
    console.error('Error listing comments:', err)
    return NextResponse.json({ error: 'Failed to list comments' }, { status: 500 })
  }
}



import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

// Saved page: list bookmarks and favorites for the current user
export async function GET() {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [bookmarks, favorites] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: session.user.id },
        include: { content: { select: { id: true, title: true, slug: true, coverImage: true, tags: true, createdAt: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reaction.findMany({
        where: { userId: session.user.id, type: 'FAVORITE' as any },
        include: { content: { select: { id: true, title: true, slug: true, coverImage: true, tags: true, createdAt: true } } },
        orderBy: { createdAt: 'desc' },
      })
    ])

    return NextResponse.json({ bookmarks, favorites })
  } catch (err) {
    console.error('Error loading library:', err)
    return NextResponse.json({ error: 'Failed to load library' }, { status: 500 })
  }
}



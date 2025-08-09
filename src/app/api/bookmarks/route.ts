import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

// Toggle bookmark
export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { contentId } = await req.json() as { contentId: string }
    if (!contentId) return NextResponse.json({ error: 'Missing contentId' }, { status: 400 })

    const existing = await prisma.bookmark.findUnique({
      where: { contentId_userId: { contentId, userId: session.user.id } },
    })

    const day = new Date(); day.setUTCHours(0, 0, 0, 0)

    if (existing) {
      await prisma.$transaction(async (tx) => {
        await tx.bookmark.delete({ where: { id: existing.id } })
        const daily = await tx.analyticsDaily.upsert({
          where: { contentId_day: { contentId, day } },
          update: {},
          create: { contentId, day, tagsSnapshot: [], recentNextContentIds: [] },
        })
        await tx.analyticsDaily.update({ where: { id: daily.id }, data: { bookmarks: { decrement: 1 } } })
      })
      return NextResponse.json({ bookmarked: false })
    }

    await prisma.$transaction(async (tx) => {
      await tx.bookmark.create({ data: { contentId, userId: session.user.id } })
      const daily = await tx.analyticsDaily.upsert({
        where: { contentId_day: { contentId, day } },
        update: {},
        create: { contentId, day, tagsSnapshot: [], recentNextContentIds: [] },
      })
      await tx.analyticsDaily.update({ where: { id: daily.id }, data: { bookmarks: { increment: 1 } } })
    })
    return NextResponse.json({ bookmarked: true })
  } catch (err) {
    console.error('Error toggling bookmark:', err)
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 })
  }
}

// Get current user's bookmarks list (saved page)
export async function GET() {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        content: { select: { id: true, title: true, slug: true, coverImage: true, tags: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookmarks)
  } catch (err) {
    console.error('Error listing bookmarks:', err)
    return NextResponse.json({ error: 'Failed to list bookmarks' }, { status: 500 })
  }
}



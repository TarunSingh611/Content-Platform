import { NextResponse } from 'next/server'
import prisma from '@/lib/utils/db'

// Non-auth tracking endpoint to record view/time and reactions roll-ups into AnalyticsDaily
// Accepts: { contentId, event: 'view' | 'time', sessionId?, durationMs? }
export async function POST(req: Request) {
  try {
    const { contentId, event, durationMs } = await req.json() as { contentId: string; event: 'view' | 'time'; durationMs?: number }
    if (!contentId || !event) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    const day = new Date()
    day.setUTCHours(0, 0, 0, 0)

    // Ensure row exists
    const daily = await prisma.analyticsDaily.upsert({
      where: { contentId_day: { contentId, day } },
      update: {},
      create: { contentId, day, tagsSnapshot: [], recentNextContentIds: [] },
    })

    if (event === 'view') {
      // Update both daily rollup and content counter
      await prisma.$transaction([
        prisma.analyticsDaily.update({ where: { id: daily.id }, data: { views: { increment: 1 } } }),
        prisma.content.update({ where: { id: contentId }, data: { views: { increment: 1 } } }),
      ])
    } else if (event === 'time' && typeof durationMs === 'number' && durationMs > 0) {
      await prisma.analyticsDaily.update({
        where: { id: daily.id },
        data: { totalTimeMs: { increment: Math.floor(durationMs) }, timeSamples: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error tracking analytics:', err)
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 })
  }
}



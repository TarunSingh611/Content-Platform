import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

// Upsert rating (1..5)
export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { contentId, value } = await req.json() as { contentId: string; value: number }
    if (!contentId || typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const rating = await prisma.rating.upsert({
      where: { contentId_userId: { contentId, userId: session.user.id } },
      update: { value },
      create: { contentId, userId: session.user.id, value },
    })

    return NextResponse.json(rating)
  } catch (err) {
    console.error('Error upserting rating:', err)
    return NextResponse.json({ error: 'Failed to upsert rating' }, { status: 500 })
  }
}



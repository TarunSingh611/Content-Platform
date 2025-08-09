import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

// Lightweight user search for @mentions suggestions
export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q) return NextResponse.json([])

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, image: true },
      take: 10,
    })

    return NextResponse.json(users)
  } catch (err) {
    console.error('Error searching users for mentions:', err)
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 })
  }
}



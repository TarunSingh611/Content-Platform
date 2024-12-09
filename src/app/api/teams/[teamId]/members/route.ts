import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';

// Modify the context type to wrap params in a Promise
export async function POST(
  req: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    // Resolve the Promise for params
    const params = await context.params;

    const session = await getServerAuthSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { email, role } = data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const member = await prisma.teamMember.create({
      data: {
        teamId: params.teamId,
        userId: user.id,
        role
      }
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error adding team member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Optional: Add generateStaticParams for static generation
export async function generateStaticParams() {
  // In a real-world scenario, fetch team IDs from your database
  return [
    { teamId: '1' },
    { teamId: '2' }
  ];
}
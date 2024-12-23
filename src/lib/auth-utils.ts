// src/lib/utils/auth-utils.ts
import { randomBytes } from 'crypto';
import { prisma } from './utils/db';
import { getServerSession } from 'next-auth/next';  
import { authOptions } from '@/lib/auth';  

export async function getServerAuthSession() {  
  return await getServerSession(authOptions);  
}  


export async function generatePasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expires,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expires: {
        gt: new Date(),
      },
    },
  });

  if (!resetToken) {
    return null;
  }

  // Delete the used token
  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return resetToken.userId;
}
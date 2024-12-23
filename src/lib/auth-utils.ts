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

export async function generateEmailVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyEmailToken(token: string): Promise<string | null> {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
      expires: {
        gt: new Date(),
      },
    },
  });

  if (!verificationToken) {
    return null;
  }

  // Update user's email verification status
  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  // Delete the used token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return verificationToken.identifier;
}
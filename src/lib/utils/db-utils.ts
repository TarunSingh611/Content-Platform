// lib/utils/db-utils.ts  
import { Prisma } from '@prisma/client';  
import prisma from './db';  

export async function createUser(data: Prisma.UserCreateInput) {  
  return prisma.user.create({  
    data,  
  });  
}  

export async function getUserByEmail(email: string) {  
  return prisma.user.findUnique({  
    where: { email },  
  });  
}  

export async function getUserById(id: string) {  
  return prisma.user.findUnique({  
    where: { id },  
  });  
}  

export async function updateUser(id: string, data: Prisma.UserUpdateInput) {  
  return prisma.user.update({  
    where: { id },  
    data,  
  });  
}  

export async function createContent(data: Prisma.ContentCreateInput) {  
  return prisma.content.create({  
    data,  
  });  
}  

export async function getContentById(id: string) {  
  return prisma.content.findUnique({  
    where: { id },  
    include: {  
      author: {  
        select: {  
          id: true,  
          name: true,  
          email: true,  
          image: true,  
        },  
      },  
    },  
  });  
}  

export async function updateContent(id: string, data: Prisma.ContentUpdateInput) {  
  return prisma.content.update({  
    where: { id },  
    data,  
  });  
}  

export async function deleteContent(id: string) {  
  return prisma.content.delete({  
    where: { id },  
  });  
}  

export async function getContentsByUser(userId: string) {  
  return prisma.content.findMany({  
    where: {  
      authorId: userId,  
    },  
    include: {  
      author: {  
        select: {  
          id: true,  
          name: true,  
          email: true,  
          image: true,  
        },  
      },  
    },  
    orderBy: {  
      createdAt: 'desc',  
    },  
  });  
}  
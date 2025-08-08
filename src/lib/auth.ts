import { NextAuthOptions } from 'next-auth';  
import { PrismaAdapter } from '@next-auth/prisma-adapter';  
import CredentialsProvider from 'next-auth/providers/credentials';  
import { PrismaClient } from '@prisma/client';  
import { compare } from 'bcrypt';  
  
const prisma = new PrismaClient();  
  
export const authOptions: NextAuthOptions = {  
  adapter: PrismaAdapter(prisma),  
  providers: [  
    CredentialsProvider({  
      name: 'Credentials',  
      credentials: {  
        email: { label: "Email", type: "email" },  
        password: { label: "Password", type: "password" }  
      },  
      async authorize(credentials) {  
        if (!credentials?.email || !credentials?.password) {  
          throw new Error('Missing credentials');  
        }  
  
        const user = await prisma.user.findUnique({  
          where: {   
            email: credentials.email   
          }  
        });  
  
        if (!user || !user.password) {  
          throw new Error('User not found');  
        }  

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Email not verified. Please verify your email to log in.');
        }
  
        const isPasswordValid = await compare(credentials.password, user.password);  
  
        if (!isPasswordValid) {  
          throw new Error('Invalid password');  
        }  
  
        return {  
          id: user.id,  
          email: user.email,  
          name: user.name,  
          image: user.image,  
          bio: user.bio ?? null,
          websiteUrl: user.websiteUrl ?? null,
          role: user.role,  
        };  
      },  
    }),  
  ],  
  pages: {  
    signIn: '/auth',  
    newUser: '/auth/signup',  
  },  
  callbacks: {  
    async jwt({ token, user, trigger, session }) {  
      if (user) {   
        token.id = user.id;  
        token.role = user.role;  
        token.name = user.name;
        token.image = user.image;
        token.bio = user.bio;
        token.websiteUrl = user.websiteUrl;
      }  
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.user?.name;
        token.image = session.user?.image;
        token.bio = session.user?.bio;
        token.websiteUrl = session.user?.websiteUrl;
      }
      
      return token;  
    },  
    async session({ session, token }) {  
      if (session.user) {  
        session.user.id = token.id as string;  
        session.user.role = token.role as 'USER' | 'ADMIN';  
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.bio = token.bio as string;
        session.user.websiteUrl = token.websiteUrl as string;
      }  
      return session;  
    },  
  },  
  session: {  
    strategy: 'jwt',  
    maxAge: 30 * 24 * 60 * 60, // 30 days  
  },  
};  
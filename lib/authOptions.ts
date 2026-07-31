import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            image: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { id: true },
        });

        if (!dbUser) {
          try {
            dbUser = await prisma.user.create({
              data: {
                name: user.name,
                email: user.email.toLowerCase(),
                image: user.image,
                emailVerified: new Date(),
              },
              select: { id: true },
            });
          } catch (createErr: any) {
            if (createErr?.message?.includes("role")) {
              const newId = `user_${Date.now()}`;
              await prisma.$executeRawUnsafe(
                `INSERT INTO "User" ("id", "name", "email", "image", "emailVerified", "plan", "allowedTemplatesCount", "allowedCardsCount", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), 'PRO_999', 99, 99, NOW(), NOW()) ON CONFLICT ("email") DO NOTHING`,
                newId,
                user.name || "",
                user.email.toLowerCase(),
                user.image || null
              );
              dbUser = { id: newId };
            } else {
              throw createErr;
            }
          }
        }
        user.id = dbUser.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { id: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "e9f4a8b7c6d5e4f3a2b1c09876543210fedcba98765432109876543210fedcba",
};

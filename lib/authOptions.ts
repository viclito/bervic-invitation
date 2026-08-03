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

        const cleanEmail = credentials.email.toLowerCase().trim();

        let user: any = null;
        try {
          user = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });
        } catch {}

        // Fallback to raw SQL query if Prisma lookup failed
        if (!user) {
          try {
            const raw: any = await prisma.$queryRawUnsafe(
              `SELECT * FROM "User" WHERE LOWER("email") = $1 LIMIT 1`,
              cleanEmail
            );
            if (raw && raw.length > 0) {
              user = raw[0];
            }
          } catch {}
        }

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
      if (user.email) {
        const cleanEmail = user.email.toLowerCase().trim();
        const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        let dbUser: any = null;
        try {
          dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
            select: { id: true },
          });
        } catch {}

        if (!dbUser) {
          try {
            dbUser = await prisma.user.create({
              data: {
                id: newId,
                name: user.name || "User",
                email: cleanEmail,
                image: user.image || null,
                emailVerified: new Date(),
                plan: "NONE",
                allowedTemplatesCount: 0,
                allowedCardsCount: 0,
                role: "USER",
              },
              select: { id: true },
            });
          } catch {
            try {
              await prisma.$executeRawUnsafe(
                `INSERT INTO "User" ("id", "name", "email", "image", "emailVerified", "plan", "allowedTemplatesCount", "allowedCardsCount", "role", "createdAt", "updatedAt") 
                 VALUES ($1, $2, $3, $4, NOW(), 'NONE', 0, 0, 'USER', NOW(), NOW()) 
                 ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name"`,
                newId,
                user.name || "User",
                cleanEmail,
                user.image || null
              );
              dbUser = { id: newId };
            } catch {}
          }
        }

        if (dbUser?.id) {
          user.id = dbUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (token?.id && trigger !== "update") {
        return token;
      }

      if (token?.email) {
        const cleanEmail = (token.email as string).toLowerCase().trim();
        let dbUser: any = null;

        try {
          dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
            select: { id: true },
          });
        } catch {}

        // Ensure user row is strictly persisted in PostgreSQL User table
        if (!dbUser) {
          const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          try {
            dbUser = await prisma.user.create({
              data: {
                id: newId,
                name: token.name || (user?.name as string) || "User",
                email: cleanEmail,
                image: (token.picture as string) || user?.image || null,
                plan: "NONE",
                allowedTemplatesCount: 0,
                allowedCardsCount: 0,
                role: "USER",
              },
              select: { id: true },
            });
          } catch {
            try {
              await prisma.$executeRawUnsafe(
                `INSERT INTO "User" ("id", "name", "email", "image", "plan", "allowedTemplatesCount", "allowedCardsCount", "role", "createdAt", "updatedAt") 
                 VALUES ($1, $2, $3, $4, 'NONE', 0, 0, 'USER', NOW(), NOW()) 
                 ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name"`,
                newId,
                token.name || user?.name || "User",
                cleanEmail,
                token.picture || user?.image || null
              );
              dbUser = { id: newId };
            } catch {}
          }
        }

        if (dbUser?.id) {
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

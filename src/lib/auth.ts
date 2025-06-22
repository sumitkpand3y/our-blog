import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // For demo purposes, we'll assume password is stored as plain text
        // In production, use bcrypt.compare(credentials.password, user.password)
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id;
        token.username = user.username
      }
      return token;
    },
    async session({ session, token }) {
      
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      
      if (account?.provider === "google") {
        const email = profile?.email;
        const username = email?.split("@")[0]; // or generate unique slug

        // Save username if new user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        

        if (!existingUser) {
          await prisma.user.update({
            where: { email },
            data: { username },
          });
        }
      }

      return true;
    },
  },
};

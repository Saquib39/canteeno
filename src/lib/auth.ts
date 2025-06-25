// lib/auth.ts
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import connectDB from "./db";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

/* ---------- Type augmentations ---------- */
declare module "next-auth" {
  interface Session {
    user: {
      /** default fields */
      name?: string | null;
      email?: string | null;
      image?: string | null;
      /** custom field */
      role?: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
/* ---------------------------------------- */

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials!.email });
        if (!user) return null;

        const match = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!match) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role ?? "user",
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  /* ---------- Callbacks ---------- */
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role ?? "user";
      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = (token as JWT).role;
      return session as Session;
    },
  },
};

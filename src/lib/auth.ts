import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch subscription data
        try {
          const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id },
          });
          (session.user as any).subscription = subscription;
          (session.user as any).role = (user as any).role;
        } catch {
          // ignore if subscription fetch fails
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Create free subscription for new users
      try {
        await prisma.subscription.create({
          data: {
            userId: user.id!,
            plan: "FREE",
            status: "ACTIVE",
          },
        });
      } catch {
        // ignore if subscription already exists
      }
    },
  },
  trustHost: true,
});

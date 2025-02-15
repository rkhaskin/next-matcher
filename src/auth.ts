import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "@/actions/authActions";
import { compare } from "bcryptjs";

// these functions can only be called from server-side actions, not from client
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds);

        if (validated.success) {
          const { password, email } = validated.data;
          const user = await getUserByEmail(email);
          if (!user || !(await compare(password, user.passwordHash)))
            return null;
          return user;
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});

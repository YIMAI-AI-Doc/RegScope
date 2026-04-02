import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { emailAuthEnabled, getAuthSecret, placeholderEmailConfig } from "@/lib/auth-secrets";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      avatarUrl?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(emailAuthEnabled
      ? [
          EmailProvider({
            server: placeholderEmailConfig.server,
            from: placeholderEmailConfig.from,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@regscope.local" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const demoPassword = process.env.REGSCOPE_DEMO_PASSWORD ?? "regscope";
        const email = parsed.data.email.trim().toLowerCase();
        if (!email.endsWith("@regscope.local")) {
          return null;
        }
        if (parsed.data.password !== demoPassword) {
          return null;
        }

        const guessedName = email.split("@")[0] ?? "RegScope 用户";
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            name: guessedName,
          },
          create: {
            email,
            name: guessedName,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  secret: getAuthSecret(),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "USER";
      }

      return session;
    },
  },
};

export { emailAuthEnabled };
export { placeholderEmailConfig };
export { getAuthSecret } from "@/lib/auth-secrets";
export { getIngestSecret } from "@/lib/auth-secrets";

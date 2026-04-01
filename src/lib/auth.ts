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
    avatarUrl?: string | null;
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
          avatarUrl: user.avatarUrl ?? undefined,
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
        token.avatarUrl = (user as { avatarUrl?: string | null }).avatarUrl ?? null;
      } else if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            select: { avatarUrl: true },
            where: { id: String(token.id) },
          });
          token.avatarUrl = dbUser?.avatarUrl ?? null;
        } catch {
          token.avatarUrl = null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "USER";
        session.user.avatarUrl = typeof token.avatarUrl === "string" ? token.avatarUrl : null;
      }

      return session;
    },
  },
};

export { emailAuthEnabled };
export { placeholderEmailConfig };
export { getAuthSecret } from "@/lib/auth-secrets";
export { getIngestSecret } from "@/lib/auth-secrets";

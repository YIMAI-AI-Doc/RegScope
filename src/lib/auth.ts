import type { DefaultSession, NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

const emailAuthEnabled = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

const placeholderEmailConfig = {
  server: process.env.EMAIL_SERVER ?? "",
  from: process.env.EMAIL_FROM ?? "RegScope <noreply@regscope.local>",
};

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET ?? "regscope-dev-secret";
}

export function getIngestSecret() {
  return process.env.REGSCOPE_INGEST_SECRET ?? getAuthSecret();
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [],
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

import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(source: Record<string, string | undefined> = process.env): Env {
  return envSchema.parse(source);
}

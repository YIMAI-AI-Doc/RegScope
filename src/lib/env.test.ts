import { describe, expect, it } from "vitest";
import { envSchema, getEnv } from "./env";

describe("env", () => {
  it("rejects missing required values", () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts the minimal valid environment", () => {
    const env = getEnv({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/regscope",
      NEXTAUTH_SECRET: "super-secret",
    });

    expect(env.DATABASE_URL).toContain("postgresql://");
    expect(env.NEXTAUTH_SECRET).toBe("super-secret");
  });
});

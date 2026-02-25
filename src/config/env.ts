export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || "http://127.0.0.1:54321",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  PORT: Number(process.env.PORT) || 8788,
  HOSTNAME: "0.0.0.0",
} as const;

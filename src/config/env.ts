export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  PORT: Number(process.env.PORT) || 8788,
  HOSTNAME: '0.0.0.0',
} as const

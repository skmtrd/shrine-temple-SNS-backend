import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

export const createAuthenticatedClient = (authHeader: string | undefined) => {
  const token = authHeader?.replace("Bearer ", "") || "";
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

export const createAnonClient = () => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
};

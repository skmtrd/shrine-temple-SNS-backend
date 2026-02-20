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

export const verifyAuth = async (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid authorization header" };
  }
  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, error: "Invalid or expired token" };
  }
  return { user: { id: user.id, email: user.email || "" }, error: null };
};

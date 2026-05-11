import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

function requireEnv(name, value) {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

const supabaseUrl = requireEnv("SUPABASE_URL", SUPABASE_URL);
const supabaseAnonKey = requireEnv("SUPABASE_ANON_KEY", SUPABASE_ANON_KEY);

try {
  const parsed = new URL(supabaseUrl);
  if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".supabase.co")) {
    throw new Error("SUPABASE_URL must look like https://<project-ref>.supabase.co");
  }
} catch (err) {
  throw new Error(`Invalid SUPABASE_URL: ${err.message}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

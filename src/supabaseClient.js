import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bjpivoddnyoeoggmpevx.supabase.co"; // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcGl2b2RkbnlvZW9nZ21wZXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjU2NzYsImV4cCI6MjA1NzkwMTY3Nn0.ZxC8Ecnw5ICUOA8Q6-ZVUv-TrlEpEBOKqR9M5j0LjS4"; // Replace with your actual anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

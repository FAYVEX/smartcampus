// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cxcuwniiwtzbvavptplg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y3V3bmlpd3R6YnZhdnB0cGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDgxNDIsImV4cCI6MjA1NTc4NDE0Mn0.E7SmeGcyKdsEC_lz7YuJrdyfLIiezLj8Y9NiBy4Clkc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
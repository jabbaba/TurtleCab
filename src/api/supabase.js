import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxvcgxakadcicqhsqoiz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmNneGFrYWRjaWNxaHNxb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDcxNzgsImV4cCI6MjA2OTE4MzE3OH0.ixHWOgHOL4cUeA0x5373w3fQNaMPABtSQzV2ZRiTEEE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

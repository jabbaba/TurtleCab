import { createClient } from '@supabase/supabase-js';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabase_url = 'https://mxvcgxakadcicqhsqoiz.supabase.co';
const supabase_anon_key ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmNneGFrYWRjaWNxaHNxb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDcxNzgsImV4cCI6MjA2OTE4MzE3OH0.ixHWOgHOL4cUeA0x5373w3fQNaMPABtSQzV2ZRiTEEE'

export const supabase = createClient(supabase_url, supabase_anon_key);

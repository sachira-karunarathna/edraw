import { createClient } from '@supabase/supabase-js';

const supabase_url = 'https://tygqqmwyijljolqhhnoe.supabase.co'
const supabase_anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Z3FxbXd5aWpsam9scWhobm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4ODgzNzMsImV4cCI6MjA0NjQ2NDM3M30.Ikh81Qguex1RfpsQtEnKoDBrSrck65yTz3u0EhgMIMg'

export const supabase = createClient(
    supabase_url, 
    supabase_anon_key
)

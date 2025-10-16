import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbvsdzgqezurizqdzyol.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idnNkemdxZXp1cml6cWR6eW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODM5NTAsImV4cCI6MjA3NjE1OTk1MH0.g28qI20mw7Z5uNxkz9PjJPz3KXEKHoO-LWuLOtLzkOw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


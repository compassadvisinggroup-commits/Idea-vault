import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://andtbpbugpjoioswprns.supabase.co'
const supabaseKey = 'sb_publishable_tato9lHQSq-FXA9lrDoung_juwGvsYG'

export const supabase = createClient(supabaseUrl, supabaseKey)
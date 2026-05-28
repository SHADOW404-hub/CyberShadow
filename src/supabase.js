import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
    'https://fbrrptvtlgsrkrfelqev.supabase.co'

const supabaseKey =
    'sb_publishable_0oBACFPPkhtNaCUcoa7QRw_WwughQGJ'

export const supabase =
    createClient(supabaseUrl, supabaseKey)
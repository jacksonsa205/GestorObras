const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL; // Defina no .env
const supabaseKey = process.env.SUPABASE_KEY; // Defina no .env

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

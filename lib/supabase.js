import { createClient } from '@supabase/supabase-js'

// .env file eke thiyena URL ekayi Key ekayi me widiyata gannawa
const supabaseUrl = 'https://aeveehkbesdibvtlawrl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFldmVlaGtiZXNkaWJ2dGxhd3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MzQ2OTQsImV4cCI6MjEwMTQxMDY5NH0.HG0HpoL-lkTbzRY-IDRrfd2OvGnalAVd2nByGDMdAQw'

const hasValidSupabaseConfig =
	typeof supabaseUrl === 'string' &&
	supabaseUrl.startsWith('http') &&
	typeof supabaseAnonKey === 'string' &&
	supabaseAnonKey.length > 0

// Supabase client eka hadanawa
export const supabase = hasValidSupabaseConfig
	? createClient(supabaseUrl, supabaseAnonKey)
	: null

export const isSupabaseConfigured = hasValidSupabaseConfig

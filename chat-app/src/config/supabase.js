import { createClient } from '@supabase/supabase-js'

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://ekxjgehscufpnqnbmuyz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreGpnZWhzY3VmcG5xbmJtdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzU1NTEsImV4cCI6MjA4NzM1MTU1MX0.AlAXrMZhM891TNUOk1fzAPWomR39d9AL724WQF480XA'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Storage functions for chat images
export const uploadFile = async (file, path) => {
  try {
    const { data, error } = await supabase.storage
      .from('chat-images') // Create this bucket in your Supabase project
      .upload(path, file)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export const getPublicUrl = (path, bucket = 'chat-images') => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

export const deleteFile = async (path, bucket = 'chat-images') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}
import { createClient } from '@supabase/supabase-js'

// Replace these with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
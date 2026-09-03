import { supabase } from '../config/supabase';

const upload = async (file) => {
    const fileName = `images/${Date.now()}_${file.name}`;
    try {
        const { data, error } = await supabase.storage
            .from('chat-images') // Make sure this bucket exists in your Supabase project
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('chat-images')
            .getPublicUrl(fileName);

        console.log('Upload successful:', publicUrl);
        return publicUrl;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

export default upload;

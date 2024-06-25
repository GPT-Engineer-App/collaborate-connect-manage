import { uploadPngToBucket } from '../integrations/supabase/index.js';

export const uploadPngFiles = async (files) => {
    const pngFiles = files.filter(file => file.type === 'image/png');
    const uploadPromises = pngFiles.map(file => uploadPngToBucket(file));

    try {
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('Error uploading PNG files:', error);
        throw error;
    }
};
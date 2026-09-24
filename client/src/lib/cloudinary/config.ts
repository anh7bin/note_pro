import type { CloudinaryConfig } from './types';

export function getCloudinaryConfig(folder?: string): CloudinaryConfig {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error(
            'Cloudinary configuration is missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.'
        );
    }

    return {
        cloudName,
        uploadPreset,
        folder: folder || 'note_pro',
    };
}

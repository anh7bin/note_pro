import {
    CloudinaryUploadResponse,
    uploadImageToCloudinary,
} from '@/lib/cloudinary/index';
import { useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { useI18n } from '@/contexts/I18nContext';
import { showToast } from '@/lib/toast';

interface UseImageUploadOptions {
    tags?: string[];
    onSuccess?: (imageUrl: string, response: CloudinaryUploadResponse) => void;
    onError?: (error: Error) => void;
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export function useImageUpload({
    tags,
    onSuccess,
    onError,
    maxSizeMB = 5,
    allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
    ],
}: UseImageUploadOptions = {}) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const { startLoading, stopLoading } = useLoading();
    const { t } = useI18n();

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!allowedTypes.includes(file.type)) {
            const error = new Error(
                t('invalidImageType', {
                    types: allowedTypes
                        .map((type) => type.split('/')[1]?.toUpperCase())
                        .join(', '),
                })
            );
            showToast.error(error.message);
            onError?.(error);
            return null;
        }

        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            const error = new Error(t('imageTooLarge', { size: maxSizeMB }));
            showToast.error(error.message);
            onError?.(error);
            return null;
        }

        setIsUploading(true);
        startLoading();

        try {
            const uploadResult = await uploadImageToCloudinary(file, {
                folder: 'note_pro/images',
                tags,
            });
            setUploadedUrl(uploadResult.secure_url);
            showToast.success(t('imageUploaded'));
            onSuccess?.(uploadResult.secure_url, uploadResult);

            return uploadResult.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast.error(t('imageUploadError'));
            onError?.(
                error instanceof Error
                    ? error
                    : new Error(t('imageUploadError'))
            );
            return null;
        } finally {
            setIsUploading(false);
            stopLoading();
        }
    };

    const reset = () => {
        setUploadedUrl(null);
    };

    return {
        uploadImage,
        reset,
        isUploading,
        uploadedUrl,
    };
}

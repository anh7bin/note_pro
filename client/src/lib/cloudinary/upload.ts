import { getCloudinaryConfig } from './config';
import type { CloudinaryUploadResponse } from './types';

interface ImageUploadOptions {
    folder?: string;
    transformation?: string;
    tags?: string[];
}

interface FileUploadOptions {
    folder?: string;
    tags?: string[];
    resourceType?: 'auto' | 'raw' | 'image' | 'video';
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
    timeoutMs?: number;
}

export async function uploadImageToCloudinary(
    file: File,
    options?: ImageUploadOptions
): Promise<CloudinaryUploadResponse> {
    const config = getCloudinaryConfig();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    if (options?.folder || config.folder) {
        formData.append('folder', options?.folder || config.folder || '');
    }

    if (options?.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
    }

    if (options?.transformation) {
        formData.append('transformation', options.transformation);
    }

    const url = `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${config.cloudName}/image/upload`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to upload image');
        }

        const data: CloudinaryUploadResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export function uploadFileToCloudinary(
    file: File,
    options?: FileUploadOptions
): Promise<CloudinaryUploadResponse> {
    const config = getCloudinaryConfig();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    if (options?.folder || config.folder) {
        formData.append('folder', options?.folder || config.folder || '');
    }

    if (options?.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
    }

    const resourceType = options?.resourceType || 'auto';
    const url = `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${config.cloudName}/${resourceType}/upload`;

    return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const request = new XMLHttpRequest();
        let settled = false;

        const createAbortError = () => {
            const error = new Error('Upload cancelled');
            error.name = 'AbortError';
            return error;
        };
        const removeAbortListener = () =>
            options?.signal?.removeEventListener('abort', abortRequest);
        const finish = (callback: () => void) => {
            if (settled) return;
            settled = true;
            removeAbortListener();
            callback();
        };
        const abortRequest = () => request.abort();

        if (options?.signal?.aborted) {
            reject(createAbortError());
            return;
        }

        options?.signal?.addEventListener('abort', abortRequest, {
            once: true,
        });

        request.upload.addEventListener('progress', (event) => {
            if (!event.lengthComputable) return;
            const progress = Math.round((event.loaded / event.total) * 100);
            options?.onProgress?.(progress);
        });

        request.addEventListener('load', () => {
            let data: CloudinaryUploadResponse & {
                error?: { message?: string };
            };

            try {
                data = JSON.parse(request.responseText);
            } catch {
                finish(() =>
                    reject(new Error('Cloudinary returned an invalid response'))
                );
                return;
            }

            if (request.status >= 200 && request.status < 300) {
                options?.onProgress?.(100);
                finish(() => resolve(data));
                return;
            }

            finish(() =>
                reject(
                    new Error(data.error?.message || 'Failed to upload file')
                )
            );
        });

        request.addEventListener('error', () => {
            finish(() => reject(new Error('Unable to connect to Cloudinary')));
        });

        request.addEventListener('abort', () => {
            finish(() => reject(createAbortError()));
        });

        request.addEventListener('timeout', () => {
            finish(() =>
                reject(
                    new Error(
                        'Upload timed out. Check your connection and try again.'
                    )
                )
            );
        });

        request.open('POST', url);
        request.timeout = options?.timeoutMs ?? 5 * 60 * 1000;
        request.send(formData);
    });
}

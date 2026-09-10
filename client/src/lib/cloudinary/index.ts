/**
 * Cloudinary Configuration and Upload Utilities
 *
 * This module provides functions to upload images directly to Cloudinary
 * from the browser without requiring a backend server.
 */

export interface CloudinaryUploadResponse {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    original_filename: string;
}

export interface CloudinaryConfig {
    cloudName: string;
    uploadPreset: string;
    folder?: string;
}

/**
 * Get Cloudinary configuration from environment variables
 */
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

/**
 * Upload an image to Cloudinary
 *
 * @param file - The file to upload
 * @param options - Additional upload options
 * @returns Promise with the upload response
 */
export async function uploadImageToCloudinary(
    file: File,
    options?: {
        folder?: string;
        transformation?: string;
        tags?: string[];
    }
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

    // Add transformation for workspace images (resize, optimize)
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

export async function uploadFileToCloudinary(
    file: File,
    options?: {
        folder?: string;
        tags?: string[];
        resourceType?: 'auto' | 'raw' | 'image' | 'video';
        onProgress?: (progress: number) => void;
        signal?: AbortSignal;
        timeoutMs?: number;
    }
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

    try {
        return await new Promise<CloudinaryUploadResponse>(
            (resolve, reject) => {
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
                    const progress = Math.round(
                        (event.loaded / event.total) * 100
                    );
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
                            reject(
                                new Error(
                                    'Cloudinary returned an invalid response'
                                )
                            )
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
                            new Error(
                                data.error?.message || 'Failed to upload file'
                            )
                        )
                    );
                });

                request.addEventListener('error', () => {
                    finish(() =>
                        reject(new Error('Unable to connect to Cloudinary'))
                    );
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
            }
        );
    } catch (error) {
        if (!(error instanceof Error && error.name === 'AbortError')) {
            console.error('Error uploading file to Cloudinary:', error);
        }
        throw error;
    }
}

/**
 * Delete an image from Cloudinary (requires backend with admin credentials)
 * Note: This needs to be done on the backend for security reasons
 *
 * @param publicId - The public_id of the image to delete
 */
export function extractPublicIdFromUrl(imageUrl: string): string | null {
    try {
        // Extract public_id from Cloudinary URL
        // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
        // Returns: folder/image
        const matches = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
        return matches ? (matches[1] ?? null) : null;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): {
    valid: boolean;
    error?: string;
} {
    // Check file type
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
    ];
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.',
        };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size exceeds 5MB limit.',
        };
    }

    return { valid: true };
}

/**
 * Get optimized image URL from Cloudinary
 *
 * @param url - Original Cloudinary URL
 * @param transformations - Cloudinary transformation parameters
 */
export function getOptimizedImageUrl(
    url: string,
    transformations?: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'fit' | 'scale' | 'limit';
        quality?: 'auto' | number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
): string {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const parts = url.split('/upload/');
    if (parts.length !== 2) {
        return url;
    }

    const transforms: string[] = [];

    if (transformations?.width) {
        transforms.push(`w_${transformations.width}`);
    }

    if (transformations?.height) {
        transforms.push(`h_${transformations.height}`);
    }

    if (transformations?.crop) {
        transforms.push(`c_${transformations.crop}`);
    }

    if (transformations?.quality) {
        transforms.push(`q_${transformations.quality}`);
    }

    if (transformations?.format) {
        transforms.push(`f_${transformations.format}`);
    }

    if (transforms.length === 0) {
        return url;
    }

    return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}

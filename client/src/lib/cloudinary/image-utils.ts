export function extractPublicIdFromUrl(imageUrl: string): string | null {
    try {
        const matches = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
        return matches ? (matches[1] ?? null) : null;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
}

export function validateImageFile(file: File): {
    valid: boolean;
    error?: string;
} {
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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size exceeds 5MB limit.',
        };
    }

    return { valid: true };
}

interface ImageTransformations {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
}

export function getOptimizedImageUrl(
    url: string,
    transformations?: ImageTransformations
): string {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const parts = url.split('/upload/');
    if (parts.length !== 2) {
        return url;
    }

    const transforms: string[] = [];

    if (transformations?.width) transforms.push(`w_${transformations.width}`);
    if (transformations?.height) transforms.push(`h_${transformations.height}`);
    if (transformations?.crop) transforms.push(`c_${transformations.crop}`);
    if (transformations?.quality)
        transforms.push(`q_${transformations.quality}`);
    if (transformations?.format) transforms.push(`f_${transformations.format}`);

    if (transforms.length === 0) {
        return url;
    }

    return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}

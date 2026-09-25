export function formatFileSize(bytes?: number | null) {
    if (!bytes || bytes <= 0) return null;
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export type FileBadge = {
    label: string;
    textClass: string;
};

const FILE_BADGES: Record<string, FileBadge> = {
    pdf: { label: 'PDF', textClass: 'text-red-500' },
    doc: { label: 'WORD', textClass: 'text-blue-500' },
    docx: { label: 'WORD', textClass: 'text-blue-500' },
    xls: { label: 'XLS', textClass: 'text-green-500' },
    xlsx: { label: 'XLSX', textClass: 'text-green-500' },
    ppt: { label: 'PPT', textClass: 'text-orange-500' },
    pptx: { label: 'PPT', textClass: 'text-orange-500' },
    txt: { label: 'TXT', textClass: 'text-muted-foreground' },
    csv: { label: 'CSV', textClass: 'text-emerald-500' },
    zip: { label: 'ZIP', textClass: 'text-amber-500' },
    rar: { label: 'RAR', textClass: 'text-amber-500' },
    default: { label: 'FILE', textClass: 'text-primary' },
};

export function getFileBadge(extension?: string | null): FileBadge {
    if (!extension) {
        return FILE_BADGES.default!;
    }
    return (
        FILE_BADGES[extension] ?? {
            label: extension.toUpperCase(),
            textClass: FILE_BADGES.default!.textClass,
        }
    );
}

export function getFileExtension(fileName: string, fileType?: string | null) {
    const fromName = fileName?.split('?')[0]?.split('.').pop()?.toLowerCase();
    if (fromName) return fromName;
    if (!fileType) return null;
    const normalizedType = fileType.toLowerCase();
    if (normalizedType.includes('pdf')) return 'pdf';
    if (normalizedType.includes('word')) return 'docx';
    if (
        normalizedType.includes('excel') ||
        normalizedType.includes('spreadsheet')
    )
        return 'xlsx';
    if (normalizedType.includes('powerpoint')) return 'pptx';
    if (normalizedType.includes('text')) return 'txt';
    if (normalizedType.includes('zip')) return 'zip';
    if (normalizedType.includes('rar')) return 'rar';
    return null;
}

/**
 * Determines if a file can be previewed in the browser
 * Files that can be previewed: PDF, images, text, video, audio
 */
export function canPreviewInBrowser(
    fileType?: string | null,
    fileExtension?: string | null
): boolean {
    if (!fileType && !fileExtension) return false;

    const normalizedType = fileType?.toLowerCase() || '';
    const normalizedExt = fileExtension?.toLowerCase() || '';

    // Images
    if (
        normalizedType.startsWith('image/') ||
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp'].includes(
            normalizedExt
        )
    ) {
        return true;
    }

    // PDFs
    if (normalizedType === 'application/pdf' || normalizedExt === 'pdf') {
        return true;
    }

    // Text files
    if (
        normalizedType.startsWith('text/') ||
        ['txt', 'md', 'json', 'xml', 'csv'].includes(normalizedExt)
    ) {
        return true;
    }

    // Video files
    if (
        normalizedType.startsWith('video/') ||
        ['mp4', 'webm', 'ogg'].includes(normalizedExt)
    ) {
        return true;
    }

    // Audio files
    if (
        normalizedType.startsWith('audio/') ||
        ['mp3', 'wav', 'ogg'].includes(normalizedExt)
    ) {
        return true;
    }

    return false;
}

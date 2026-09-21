'use client';

import { useCallback, useRef } from 'react';
import { useImageUpload } from './useImageUpload';
import { Block } from './useBlocks';

interface UseDocumentCoverProps {
    rootBlock: Block | null;
    onUpdateCover: (coverImage: string | null) => Promise<boolean>;
}

export function useDocumentCover({
    rootBlock,
    onUpdateCover,
}: UseDocumentCoverProps) {
    const { uploadImage, isUploading } = useImageUpload({
        tags: ['document-cover'],
        maxSizeMB: 10,
    });

    // Use ref to avoid recreating callbacks when rootBlock reference changes
    const rootBlockRef = useRef(rootBlock);
    rootBlockRef.current = rootBlock;

    const coverImage = rootBlock?.cover_image as string | undefined;

    const handleAddCover = useCallback(
        async (file: File) => {
            const currentRootBlock = rootBlockRef.current;
            if (!currentRootBlock) return;

            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                await onUpdateCover(imageUrl);
            }
        },
        [onUpdateCover, uploadImage]
    );

    const handleRemoveCover = useCallback(async () => {
        const currentRootBlock = rootBlockRef.current;
        if (!currentRootBlock) return;

        await onUpdateCover(null);
    }, [onUpdateCover]);

    return {
        coverImage,
        handleAddCover,
        handleRemoveCover,
        isUploading,
    };
}

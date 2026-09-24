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
            if (!currentRootBlock) return false;

            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                return onUpdateCover(imageUrl);
            }

            return false;
        },
        [onUpdateCover, uploadImage]
    );

    const handleSelectCover = useCallback(
        async (imageUrl: string) => {
            const currentRootBlock = rootBlockRef.current;
            if (!currentRootBlock) return false;

            return onUpdateCover(imageUrl);
        },
        [onUpdateCover]
    );

    const handleRemoveCover = useCallback(async () => {
        const currentRootBlock = rootBlockRef.current;
        if (!currentRootBlock) return;

        await onUpdateCover(null);
    }, [onUpdateCover]);

    return {
        coverImage,
        handleAddCover,
        handleSelectCover,
        handleRemoveCover,
        isUploading,
    };
}

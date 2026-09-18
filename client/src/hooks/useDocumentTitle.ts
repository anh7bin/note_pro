'use client';

import { useParams } from 'next/navigation';
import { useMemo, useRef } from 'react';
import { useDocumentBlocksData } from './useDocumentBlocksData';
import { getPlainText } from '@/lib/text';

interface UseDocumentTitleOptions {
    enabled?: boolean;
}

export function useDocumentTitle(options: UseDocumentTitleOptions = {}) {
    const { enabled = true } = options;
    const params = useParams();
    const lastTitleRef = useRef<string | null>(null);

    const documentId = useMemo(() => {
        if (!params || !enabled) return null;

        if (Array.isArray(params.params)) {
            return params.params[params.params.length - 1];
        }

        if (typeof params.documentId === 'string') {
            return params.documentId;
        }

        return null;
    }, [params, enabled]);

    const { processedRootBlock, loading } = useDocumentBlocksData(
        documentId || ''
    );

    const documentTitle = useMemo(() => {
        if (!enabled || !processedRootBlock?.content?.title) {
            lastTitleRef.current = null;
            return null;
        }

        const rawTitle = processedRootBlock.content.title;
        const extractedTitle = getPlainText(rawTitle) || 'Untitled';

        if (lastTitleRef.current !== extractedTitle) {
            lastTitleRef.current = extractedTitle;
        }

        return lastTitleRef.current;
    }, [processedRootBlock?.content?.title, enabled]);

    const documentIcon = useMemo(() => {
        const icon = processedRootBlock?.content?.icon;
        return enabled && typeof icon === 'string' && icon.trim() ? icon : null;
    }, [enabled, processedRootBlock?.content?.icon]);

    return useMemo(
        () => ({
            documentId,
            documentTitle,
            documentIcon,
            loading: enabled ? loading : false,
            hasDocument: enabled && Boolean(documentId),
        }),
        [documentIcon, documentId, documentTitle, loading, enabled]
    );
}

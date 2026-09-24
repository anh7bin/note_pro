'use client';

import {
    type GetDocumentBlocksQuery,
    GetDocumentBlocksDocument,
    useGetDocumentBlocksQuery,
    useSubscribeToDocumentBlocksSubscription,
} from '@/graphql/queries/__generated__/document.generated';
import { normalizeBlock } from '@/lib/editor/block-normalization';
import type { Block } from '@/types/editor';
import { BlockType } from '@/types/types';
import { useMemo } from 'react';

interface DocumentBlocksData {
    loading: boolean;
    processedBlocks: Block[];
    processedRootBlock: Block | null;
}

interface UseDocumentBlocksDataOptions {
    realtime?: boolean;
}

type DocumentBlock = GetDocumentBlocksQuery['blocks'][number];

function isNewerTimestamp(
    candidate: string | null | undefined,
    baseline: string | null | undefined
) {
    const candidateTime = candidate ? Date.parse(candidate) : Number.NaN;
    const baselineTime = baseline ? Date.parse(baseline) : Number.NaN;

    return (
        Number.isFinite(candidateTime) &&
        (!Number.isFinite(baselineTime) || candidateTime > baselineTime)
    );
}

function mergeWithNewerQueryBlocks(
    queryBlocks: DocumentBlock[],
    subscribedBlocks?: DocumentBlock[]
) {
    if (!subscribedBlocks) return queryBlocks;

    const queryBlocksById = new Map(
        queryBlocks.map((block) => [block.id, block])
    );

    // The subscription owns membership, so deletions are reflected immediately.
    // A newer query-cache entity can temporarily exist while its own mutation is
    // still waiting for the corresponding subscription event.
    return subscribedBlocks.map((subscribedBlock) => {
        const queryBlock = queryBlocksById.get(subscribedBlock.id);
        return queryBlock &&
            isNewerTimestamp(queryBlock.updated_at, subscribedBlock.updated_at)
            ? queryBlock
            : subscribedBlock;
    });
}

export function useDocumentBlocksData(
    pageId: string,
    { realtime = false }: UseDocumentBlocksDataOptions = {}
): DocumentBlocksData {
    const { data, loading } = useGetDocumentBlocksQuery({
        variables: { pageId },
        skip: !pageId,
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
    });
    const { data: subscribedData } = useSubscribeToDocumentBlocksSubscription({
        variables: { pageId },
        skip: !pageId || !realtime,
        ignoreResults: false,
        onData: ({ client, data: subscriptionResult }) => {
            const blocks = subscriptionResult.data?.blocks;
            if (!blocks) return;

            // Keep the regular query cache in sync so the title and document
            // sidebar can reuse this single subscription connection.
            client.cache.writeQuery<GetDocumentBlocksQuery>({
                query: GetDocumentBlocksDocument,
                variables: { pageId },
                data: { blocks },
                overwrite: true,
            });
        },
    });

    const synchronizedBlocks = useMemo(
        () =>
            mergeWithNewerQueryBlocks(
                data?.blocks ?? [],
                subscribedData?.blocks
            ),
        [data?.blocks, subscribedData?.blocks]
    );

    const { processedBlocks, processedRootBlock } = useMemo(() => {
        if (!synchronizedBlocks.length) {
            return { processedBlocks: [], processedRootBlock: null };
        }

        const allBlocks = synchronizedBlocks
            .map(normalizeBlock)
            .filter((block) => block !== null);
        const root =
            allBlocks.find(
                (block) => block.id === pageId && block.type === BlockType.PAGE
            ) ?? null;

        const childBlocksRaw = allBlocks
            .filter(
                (block) =>
                    block.page_id === pageId && block.type !== BlockType.PAGE
            )
            .sort((a, b) => {
                const positionA = a.position ?? 0;
                const positionB = b.position ?? 0;

                if (positionA !== positionB) {
                    return positionA - positionB;
                }

                const isTaskA = a.type === BlockType.TASK;
                const isTaskB = b.type === BlockType.TASK;

                if (isTaskA && !isTaskB) return -1;
                if (!isTaskA && isTaskB) return 1;

                return 0;
            });

        const seen = new Set<string>();
        const childBlocks = childBlocksRaw.filter((b) => {
            if (seen.has(b.id)) return false;
            seen.add(b.id);
            return true;
        });

        return { processedBlocks: childBlocks, processedRootBlock: root };
    }, [synchronizedBlocks, pageId]);

    return { loading, processedBlocks, processedRootBlock };
}

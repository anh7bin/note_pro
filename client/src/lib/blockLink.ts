const BLOCK_HASH_PREFIX = 'block-';

export const getBlockElementId = (blockId: string): string =>
    `${BLOCK_HASH_PREFIX}${blockId}`;

export const createBlockLink = (
    currentHref: string,
    blockId: string
): string => {
    const url = new URL(currentHref);
    url.searchParams.delete('openShare');
    url.hash = getBlockElementId(blockId);
    return url.toString();
};

export const getBlockIdFromHash = (hash: string): string | null => {
    const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!normalizedHash.startsWith(BLOCK_HASH_PREFIX)) return null;

    try {
        const blockId = decodeURIComponent(
            normalizedHash.slice(BLOCK_HASH_PREFIX.length)
        );
        return blockId || null;
    } catch {
        return null;
    }
};

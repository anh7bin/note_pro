import type { ApolloCache } from '@apollo/client';

export const pluralize = (
    count: number,
    singular: string,
    plural?: string
): string => {
    return count === 1 ? singular : plural || `${singular}s`;
};

type BulkDeleteDocumentsFunction = (options: {
    variables: { ids: string[] };
}) => Promise<unknown>;

type BulkDeleteDocumentsAndFoldersFunction = (options: {
    variables: { documentIds: string[]; folderIds: string[] };
    update?: (cache: ApolloCache<unknown>) => void;
}) => Promise<unknown>;

type BulkDeleteAccessRequestsFunction = (options: {
    variables: { document_ids: string[]; requester_id: string };
}) => Promise<unknown>;

export const handleBulkDeleteDocuments = async (
    selectedDocuments: Set<string>,
    bulkDeleteDocuments: BulkDeleteDocumentsFunction,
    clearSelection: () => void
): Promise<void> => {
    await bulkDeleteDocuments({
        variables: { ids: Array.from(selectedDocuments) },
    });
    clearSelection();
};

export const handleBulkDeleteDocumentsAndFolders = async (
    documentIds: string[],
    folderIds: string[],
    bulkDeleteDocumentsAndFolders: BulkDeleteDocumentsAndFoldersFunction,
    clearSelection: () => void
): Promise<void> => {
    await bulkDeleteDocumentsAndFolders({
        variables: { documentIds, folderIds },
        update: (cache) => {
            folderIds.forEach((id) => {
                cache.evict({
                    id: cache.identify({
                        __typename: 'folders',
                        id,
                    }),
                });
            });
            cache.gc();
        },
    });
    clearSelection();
};

export const handleBulkRemoveShared = async (
    selectedDocuments: Set<string>,
    bulkDeleteAccessRequests: BulkDeleteAccessRequestsFunction,
    userId: string | null,
    clearSelection: () => void
): Promise<void> => {
    if (!userId) return;

    await bulkDeleteAccessRequests({
        variables: {
            document_ids: Array.from(selectedDocuments),
            requester_id: userId,
        },
    });
    clearSelection();
};

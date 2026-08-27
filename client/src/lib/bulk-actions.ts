import { toast } from '@/hooks/useToast';

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

type BulkDeleteAccessRequestsFunction = (options: {
    variables: { document_ids: string[]; requester_id: string };
}) => Promise<{
    data?: {
        delete_access_requests?: {
            affected_rows: number;
        } | null;
    } | null;
}>;

export const handleBulkDeleteDocuments = async (
    selectedDocuments: Set<string>,
    bulkDeleteDocuments: BulkDeleteDocumentsFunction,
    clearSelection: () => void
): Promise<void> => {
    const count = selectedDocuments.size;

    try {
        await bulkDeleteDocuments({
            variables: { ids: Array.from(selectedDocuments) },
        });

        toast({
            title: 'Success',
            description: `Deleted ${count} ${pluralize(count, 'document')} successfully`,
        });
        clearSelection();
    } catch {
        toast({
            title: 'Error',
            description: 'Failed to delete documents',
            variant: 'destructive',
        });
    }
};

export const handleBulkRemoveShared = async (
    selectedDocuments: Set<string>,
    bulkDeleteAccessRequests: BulkDeleteAccessRequestsFunction,
    userId: string | null,
    clearSelection: () => void
): Promise<void> => {
    if (!userId) {
        toast({
            title: 'Error',
            description: 'User ID not found',
            variant: 'destructive',
        });
        return;
    }

    try {
        const result = await bulkDeleteAccessRequests({
            variables: {
                document_ids: Array.from(selectedDocuments),
                requester_id: userId,
            },
        });

        const affectedRows =
            result.data?.delete_access_requests?.affected_rows || 0;

        toast({
            title: 'Success',
            description: `Removed ${affectedRows} ${pluralize(affectedRows, 'document')} from shared`,
        });
        clearSelection();
    } catch (error) {
        console.error('Error removing shared documents:', error);
        toast({
            title: 'Error',
            description: 'Failed to remove documents from shared',
            variant: 'destructive',
        });
    }
};

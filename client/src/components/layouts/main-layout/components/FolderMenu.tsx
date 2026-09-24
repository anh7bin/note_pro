import { FolderItem } from '@/components/features/page/FolderItem';
import { useGetFoldersQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildTree, FolderNode } from '@/lib/folder';
import { useI18n } from '@/contexts/I18nContext';
import { Skeleton } from '@/components/ui/skeleton';

export const FolderMenu = () => {
    const { workspace, workspaceSlug } = useWorkspace();
    const { t } = useI18n();
    const { data, loading } = useGetFoldersQuery({
        variables: { workspaceId: workspace?.id ?? '' },
        skip: !workspace?.id,
    });

    const folders = data?.folders ?? [];
    const tree = buildTree(folders as FolderNode[]);

    return (
        <div className="space-y-1">
            {loading ? (
                <div
                    className="space-y-2 px-1 py-1.5"
                    role="status"
                    aria-label={t('loadingFolders')}>
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
            ) : tree.length === 0 ? (
                <p className="px-1 py-1.5 text-xs italic leading-5 text-muted-foreground/70">
                    {t('foldersEmptyDescription')}
                </p>
            ) : (
                tree.map((folder) => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        workspaceSlug={workspaceSlug}
                    />
                ))
            )}
        </div>
    );
};

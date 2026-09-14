import { FolderItem } from '@/components/features/page/FolderItem';
import { useGetFoldersQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildTree, FolderNode } from '@/lib/folder';
import { useI18n } from '@/contexts/I18nContext';

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
                <div className="text-xs text-muted-foreground py-1 animate-pulse">
                    {t('loadingFolders')}
                </div>
            ) : tree.length === 0 ? (
                <div className="text-xs text-muted-foreground py-1">
                    {t('noFolders')}
                </div>
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

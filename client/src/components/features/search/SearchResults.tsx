'use client';

import type { SearchResult } from 'hooks/useSearch';
import { useWorkspace } from 'hooks/useWorkspace';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchSection } from './SearchSection';
import { SearchSkeleton } from './SearchSkeleton';
import { useI18n } from '@/contexts/I18nContext';
import { DEFAULT_WORKSPACE_IMAGE } from '@/lib/constants';

interface Props {
    results: SearchResult;
    onResultClick: () => void;
}

export function SearchResults({ results, onResultClick }: Props) {
    const { folders, documents, sharedDocuments, isLoading } = results;
    const { workspace } = useWorkspace();
    const { t } = useI18n();
    const workspaceImageUrl = workspace?.image_url || DEFAULT_WORKSPACE_IMAGE;

    const hasResults =
        folders.length + documents.length + sharedDocuments.length > 0;

    if (isLoading) {
        return <SearchSkeleton />;
    }

    if (!hasResults) {
        return <SearchEmptyState />;
    }

    return (
        <div className="p-2">
            {documents.length > 0 && (
                <SearchSection
                    title={t('documents')}
                    items={documents}
                    type="document"
                    workspaceId={workspace?.id ?? ''}
                    workspaceImageUrl={workspaceImageUrl}
                    onResultClick={onResultClick}
                    renderSubtitle={(doc) =>
                        t('inWorkspace', {
                            workspace: doc.workspace?.name ?? '',
                        })
                    }
                />
            )}

            {folders.length > 0 && (
                <SearchSection
                    title={t('folders')}
                    items={folders}
                    type="folder"
                    workspaceId={workspace?.id ?? ''}
                    workspaceImageUrl={workspaceImageUrl}
                    onResultClick={onResultClick}
                    renderSubtitle={(folder) =>
                        t('inWorkspace', {
                            workspace: folder.workspace?.name ?? '',
                        })
                    }
                />
            )}

            {sharedDocuments.length > 0 && (
                <SearchSection
                    title={t('sharedDocuments')}
                    items={sharedDocuments}
                    type="sharedDocument"
                    getWorkspaceId={(doc) => doc.workspace_id ?? ''}
                    onResultClick={onResultClick}
                    renderSubtitle={(doc) =>
                        t('byUser', { user: doc.user?.name ?? '' })
                    }
                />
            )}
        </div>
    );
}

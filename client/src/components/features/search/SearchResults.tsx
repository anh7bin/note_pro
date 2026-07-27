'use client';

import { SearchResult } from 'hooks/useSearch';
import { useWorkspace } from 'hooks/useWorkspace';
import { useMemo } from 'react';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchSection } from './SearchSection';
import { SearchSkeleton } from './SearchSkeleton';

interface Props {
    results: SearchResult;
    onResultClick: () => void;
}

export function SearchResults({ results, onResultClick }: Props) {
    const { folders, documents, sharedDocuments, isLoading } = results;
    const { workspace } = useWorkspace();

    const counts = useMemo(
        () => ({
            all: folders.length + documents.length + sharedDocuments.length,
        }),
        [folders.length, documents.length, sharedDocuments.length]
    );

    if (isLoading) {
        return <SearchSkeleton />;
    }

    if (counts.all === 0) {
        return <SearchEmptyState message="No Results Found" />;
    }

    return (
        <div className="max-h-[calc(60vh-4rem)] overflow-y-auto p-2">
            {documents.length > 0 && (
                <SearchSection
                    title="Documents"
                    items={documents}
                    type="document"
                    workspaceId={workspace?.id ?? ''}
                    onResultClick={onResultClick}
                    renderSubtitle={(doc) => `In ${doc.workspace?.name ?? ''}`}
                />
            )}

            {folders.length > 0 && (
                <SearchSection
                    title="Folders"
                    items={folders}
                    type="folder"
                    workspaceId={workspace?.id ?? ''}
                    onResultClick={onResultClick}
                    renderSubtitle={(folder) =>
                        `In ${folder.workspace?.name ?? ''}`
                    }
                />
            )}

            {sharedDocuments.length > 0 && (
                <SearchSection
                    title="Shared Documents"
                    items={sharedDocuments}
                    type="sharedDocument"
                    getWorkspaceId={(doc) => doc.workspace_id ?? ''}
                    onResultClick={onResultClick}
                    renderSubtitle={(doc) => `By ${doc.user?.name ?? ''}`}
                />
            )}
        </div>
    );
}

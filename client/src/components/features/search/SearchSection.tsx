'use client';

import { getPlainText } from '@/lib/text';
import { SearchItem } from './SearchItem';
import type { SearchItemType } from 'types/app';
import type { SearchAllQuery } from 'graphql/queries/__generated__/search.generated';
import { useI18n } from '@/contexts/I18nContext';

type SearchDocument = SearchAllQuery['documents'][number];
type SearchFolder = SearchAllQuery['folders'][number];
type SearchSharedDocument = SearchAllQuery['sharedDocuments'][number];
type SearchItemUnion = SearchDocument | SearchFolder | SearchSharedDocument;

interface Props<T extends SearchItemUnion = SearchItemUnion> {
    title: string;
    items: T[];
    type: SearchItemType;
    workspaceId?: string;
    workspaceImageUrl?: string;
    onResultClick: () => void;
    renderSubtitle: (item: T) => string;
    getWorkspaceId?: (item: T) => string;
}

export const SearchSection = <T extends SearchItemUnion = SearchItemUnion>({
    title,
    items,
    type,
    workspaceId,
    workspaceImageUrl,
    onResultClick,
    renderSubtitle,
    getWorkspaceId,
}: Props<T>) => {
    const { t } = useI18n();

    if (items.length === 0) return null;

    return (
        <div>
            <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
            </div>
            <div className="space-y-0.5">
                {items.map((item) => {
                    const wsId = getWorkspaceId?.(item) ?? workspaceId ?? '';

                    if (type === 'folder') {
                        const folder = item as SearchFolder;
                        return (
                            <SearchItem
                                key={folder.id}
                                type={type}
                                id={folder.id}
                                title={folder.name}
                                subtitle={t('inWorkspace', {
                                    workspace: folder.workspace?.name ?? '',
                                })}
                                href={`/s/${wsId}/f/${folder.id}`}
                                icon={folder.icon || undefined}
                                avatarUrl={workspaceImageUrl}
                                avatarAlt={t('workspace')}
                                onClick={onResultClick}
                            />
                        );
                    }

                    const doc = item as SearchDocument | SearchSharedDocument;
                    const isSharedDocument = type === 'sharedDocument';
                    return (
                        <SearchItem
                            key={doc.id}
                            type={type}
                            id={doc.id}
                            title={getPlainText(doc.content.title)}
                            subtitle={renderSubtitle(item)}
                            href={`/editor/d/${wsId}/${doc.id}`}
                            icon={doc.content?.icon || undefined}
                            avatarUrl={
                                isSharedDocument
                                    ? doc.user?.avatar_url || undefined
                                    : workspaceImageUrl
                            }
                            avatarAlt={
                                isSharedDocument
                                    ? t('userAvatar')
                                    : t('workspace')
                            }
                            onClick={onResultClick}
                        />
                    );
                })}
            </div>
        </div>
    );
};

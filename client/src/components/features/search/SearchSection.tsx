import React from 'react';
import { getPlainText } from 'components/features/page/CardDocument';
import { SearchItem } from './SearchItem';
import { SearchItemType } from 'types/app';
import { SearchAllQuery } from 'graphql/queries/__generated__/search.generated';

type SearchDocument = SearchAllQuery['documents'][number];
type SearchFolder = SearchAllQuery['folders'][number];
type SearchSharedDocument = SearchAllQuery['sharedDocuments'][number];

type SearchItemUnion = SearchDocument | SearchFolder | SearchSharedDocument;

interface Props<T extends SearchItemUnion = SearchItemUnion> {
    title: string;
    items: T[];
    type: SearchItemType;
    workspaceId?: string;
    onResultClick: () => void;
    renderSubtitle: (item: T) => string;
    getWorkspaceId?: (item: T) => string;
}

export const SearchSection = <T extends SearchItemUnion = SearchItemUnion>({
    title,
    items,
    type,
    workspaceId,
    onResultClick,
    renderSubtitle,
    getWorkspaceId,
}: Props<T>) => {
    if (items.length === 0) {
        return null;
    }

    const isDocument = (item: SearchItemUnion): item is SearchDocument => {
        return type === 'document';
    };

    const isSharedDocument = (
        item: SearchItemUnion
    ): item is SearchSharedDocument => {
        return type === 'sharedDocument';
    };

    const isFolder = (item: SearchItemUnion): item is SearchFolder => {
        return type === 'folder';
    };

    return (
        <div>
            <div className="text-xs text-muted-foreground font-semibold p-1">
                {title}
            </div>
            <div className="space-y-1">
                {items.map((item) => {
                    let href = '';
                    let itemTitle = '';
                    let subtitle = '';

                    // Get workspace ID for this specific item
                    const itemWorkspaceId = getWorkspaceId
                        ? getWorkspaceId(item)
                        : (workspaceId ?? '');

                    if (isDocument(item) || isSharedDocument(item)) {
                        href = `/editor/d/${itemWorkspaceId}/${item.id}`;
                        itemTitle = getPlainText(item.content.title);
                        subtitle = renderSubtitle?.(item) ?? '';
                    } else if (isFolder(item)) {
                        href = `/s/${itemWorkspaceId}/f/${item.id}`;
                        itemTitle = item.name;
                        subtitle = `In ${item.workspace?.name ?? ''}`;
                    }

                    const avatarUrl =
                        isDocument(item) || isSharedDocument(item)
                            ? (item.user?.avatar_url ?? '')
                            : '';

                    return (
                        <SearchItem
                            key={item.id}
                            type={type}
                            id={item.id}
                            title={itemTitle}
                            subtitle={subtitle}
                            href={href}
                            onClick={onResultClick}
                            avatarUrl={avatarUrl}
                        />
                    );
                })}
            </div>
        </div>
    );
};

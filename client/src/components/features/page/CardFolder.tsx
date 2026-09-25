'use client';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/contexts/LoadingContext';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { GetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { Folder, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FolderMoreMenu } from './FolderMoreMenu';
import { useI18n } from '@/contexts/I18nContext';

type FolderType = NonNullable<
    GetFolderByIdQuery['folders_by_pk']
>['children'][0];

interface CardFolderProps {
    folder: FolderType;
    variant?: 'card' | 'list';
}

const CardFolderComponent = ({ folder, variant = 'card' }: CardFolderProps) => {
    const router = useRouter();
    const { workspace } = useWorkspace();
    const { startLoading } = useLoading();
    const { t, locale } = useI18n();
    const { toggleFolder, isSelected, selectedDocuments, selectedFolders } =
        useDocumentSelection();

    const workspaceId = workspace?.id;
    const docCount = folder.blocks_aggregate?.aggregate?.count || 0;
    const selected = isSelected(folder.id);
    const isSelectionActive = selectedDocuments.size + selectedFolders.size > 0;

    const openFolder = (newTab = false) => {
        if (!workspaceId) return;

        const folderUrl = ROUTES.WORKSPACE_FOLDER(workspaceId, folder.id);

        if (newTab) {
            window.open(folderUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        startLoading();
        router.push(folderUrl);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (isSelectionActive) {
            toggleFolder(folder.id);
            return;
        }

        openFolder(e.ctrlKey || e.metaKey);
    };

    const handleSelectToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFolder(folder.id);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            if (isSelectionActive) {
                toggleFolder(folder.id);
                return;
            }

            openFolder();
        }
    };

    const listContent = (
        <div
            role={isSelectionActive ? 'button' : 'link'}
            tabIndex={0}
            className={`group grid min-h-[76px] cursor-pointer grid-cols-[minmax(0,1fr)_64px] items-center rounded-lg border bg-card px-5 py-2.5 transition-[background-color,border-color,box-shadow] hover:border-border-strong hover:bg-accent/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:grid-cols-[minmax(0,1fr)_132px_116px_64px] ${
                selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border-subtle'
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}>
            <div className="flex min-w-0 items-center gap-3 pr-4">
                <span className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-primary/5 text-primary shadow-sm">
                    {folder.icon ? (
                        <span className="text-xl">{folder.icon}</span>
                    ) : (
                        <Folder className="h-5 w-5" />
                    )}
                </span>
                <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-5 text-foreground">
                        {folder.name}
                    </span>
                    <span className="block truncate text-xs leading-5 text-muted-foreground">
                        {t(
                            docCount === 1
                                ? 'documentCount'
                                : 'documentCountPlural',
                            { count: docCount }
                        )}
                    </span>
                </div>
            </div>
            <span className="hidden truncate pr-3 text-xs text-muted-foreground sm:block">
                —
            </span>
            <span className="hidden truncate pr-3 text-xs text-muted-foreground sm:block">
                {folder.created_at
                    ? formatDate(folder.created_at, { relative: true, locale })
                    : '—'}
            </span>
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className={`h-5 w-5 rounded-full border focus-visible:opacity-100 ${
                        selected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background opacity-100 md:opacity-0 md:group-hover:opacity-100'
                    }`}
                    onClick={handleSelectToggle}>
                    {selected && <Check />}
                </Button>
            </div>
        </div>
    );

    return (
        <FolderMoreMenu
            folder={{
                ...folder,
                description: folder.description ?? undefined,
                icon: folder.icon ?? undefined,
            }}>
            {variant === 'list' ? (
                listContent
            ) : (
                <Card
                    key={folder.id}
                    role={isSelectionActive ? 'button' : 'link'}
                    tabIndex={0}
                    className={`group relative flex h-[140px] w-full cursor-pointer flex-col bg-primary/5 transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 ${
                        selected
                            ? 'border-primary ring-1 ring-primary/25'
                            : 'border-border-subtle hover:border-border-strong hover:shadow-md'
                    }`}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}>
                    <CardHeader className="flex flex-col p-4 flex-1">
                        <div className="absolute top-3 right-3 z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-5 w-5 rounded-full border transition-all focus-visible:opacity-100 ${
                                    selected
                                        ? 'opacity-100 bg-primary border-primary text-primary-foreground'
                                        : 'bg-background border-border opacity-100 hover:border-primary md:opacity-0 md:group-hover:opacity-100'
                                }`}
                                onClick={handleSelectToggle}>
                                {selected && <Check />}
                            </Button>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
                                {folder.icon ? (
                                    <span className="text-2xl">
                                        {folder.icon}
                                    </span>
                                ) : (
                                    <Folder className="w-5 h-5 text-primary" />
                                )}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <CardTitle className="text-sm truncate">
                                    {folder.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {t(
                                        docCount === 1
                                            ? 'documentCount'
                                            : 'documentCountPlural',
                                        { count: docCount }
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            )}
        </FolderMoreMenu>
    );
};

export const CardFolder = React.memo(CardFolderComponent);

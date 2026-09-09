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
import { Folder, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FolderMoreMenu } from './FolderMoreMenu';

type FolderType = NonNullable<
    GetFolderByIdQuery['folders_by_pk']
>['children'][0];

interface CardFolderProps {
    folder: FolderType;
}

const CardFolderComponent = ({ folder }: CardFolderProps) => {
    const router = useRouter();
    const { workspace } = useWorkspace();
    const { startLoading } = useLoading();
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

    return (
        <FolderMoreMenu
            folder={{
                ...folder,
                description: folder.description ?? undefined,
                icon: folder.icon ?? undefined,
            }}>
            <Card
                key={folder.id}
                role={isSelectionActive ? 'button' : 'link'}
                tabIndex={0}
                aria-label={
                    isSelectionActive
                        ? `${selected ? 'Deselect' : 'Select'} folder “${folder.name}”`
                        : `Open folder “${folder.name}”`
                }
                aria-pressed={isSelectionActive ? selected : undefined}
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
                            aria-label={
                                selected
                                    ? `Deselect “${folder.name}”`
                                    : `Select “${folder.name}”`
                            }
                            aria-pressed={selected}
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
                                <span className="text-2xl">{folder.icon}</span>
                            ) : (
                                <Folder className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <CardTitle className="text-sm truncate">
                                {folder.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {docCount}{' '}
                                {docCount <= 1 ? 'document' : 'documents'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </FolderMoreMenu>
    );
};

export const CardFolder = React.memo(CardFolderComponent);

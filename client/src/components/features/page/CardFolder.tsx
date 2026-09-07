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
    const { toggleFolder, isSelected } = useDocumentSelection();

    const workspaceId = workspace?.id;
    const docCount = folder.blocks_aggregate?.aggregate?.count || 0;
    const selected = isSelected(folder.id);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!workspaceId) return;

        const folderUrl = ROUTES.WORKSPACE_FOLDER(workspaceId, folder.id);

        if (e.ctrlKey || e.metaKey) {
            window.open(folderUrl, '_blank');
            return;
        }

        startLoading();
        router.push(folderUrl);
    };

    const handleSelectToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFolder(folder.id);
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
                className={`group relative cursor-pointer transition-all duration-200 h-[140px] w-full rounded-md bg-primary/5 flex flex-col ${
                    selected
                        ? 'border-2 border-primary'
                        : 'border-2 border-[rgb(223,228,231)] hover:border-primary dark:border-border dark:hover:border-primary'
                }`}
                onClick={handleClick}>
                <CardHeader className="flex flex-col p-4 flex-1">
                    <div className="absolute top-3 right-3 z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 rounded-full border-2 transition-all ${
                                selected
                                    ? 'opacity-100 bg-primary border-primary text-primary-foreground'
                                    : 'opacity-0 group-hover:opacity-100 bg-background border-border hover:border-primary'
                            }`}
                            onClick={handleSelectToggle}>
                            {selected && <Check className="h-4 w-4" />}
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

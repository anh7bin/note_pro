'use client';

import { DocumentMoreMenu } from '@/components/features/page/DocumentMoreMenu';
import { BulkDocumentMenu } from '@/components/features/page/BulkDocumentMenu';
import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useUserId } from '@/hooks/useAuth';
import { useLoading } from '@/contexts/LoadingContext';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { Document } from '@/types/app';
import { Folder, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { CardDocumentPreview } from './CardDocumentPreview';
import { Button } from '@/components/ui/button';

export const getPlainText = (html?: string | null) => {
    if (!html) return '';
    if (typeof window !== 'undefined') {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
    return html.replace(/<[^>]*>/g, '');
};

const CardDocumentComponent = ({ document }: { document: Document }) => {
    const router = useRouter();
    const { workspace } = useWorkspace();
    const currentUserId = useUserId();
    const { startLoading } = useLoading();
    const {
        toggleDocument,
        isSelected,
        selectedDocuments,
        selectedFolders,
        mode,
    } = useDocumentSelection();

    const plainTitle = getPlainText(document.content?.title) || 'Untitled';
    const selected = isSelected(document.id);
    const hasMultipleSelected = selectedDocuments.size > 1;
    const isSelectionActive = selectedDocuments.size + selectedFolders.size > 0;

    const workspaceId = document.workspace_id || workspace?.id;

    const isOwner = useMemo(() => {
        return document.user_id === currentUserId;
    }, [document.user_id, currentUserId]);

    useEffect(() => {
        if (!workspaceId) return;
        const href = document.folder?.id
            ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                  workspaceId,
                  document.folder.id,
                  document.id
              )
            : ROUTES.WORKSPACE_DOCUMENT(workspaceId, document.id);
        router.prefetch(href);
    }, [workspaceId, document.folder?.id, document.id, router]);

    const openDocument = () => {
        if (!workspaceId) return;

        startLoading();

        if (document.folder?.id) {
            router.push(
                ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                    workspaceId,
                    document.folder.id,
                    document.id
                )
            );
        } else {
            router.push(ROUTES.WORKSPACE_DOCUMENT(workspaceId, document.id));
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (isSelectionActive) {
            toggleDocument(document.id);
            return;
        }

        openDocument();
    };

    const handleSelectToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleDocument(document.id);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            if (isSelectionActive) {
                toggleDocument(document.id);
                return;
            }

            openDocument();
        }
    };

    const cardContent = (
        <Card
            role={isSelectionActive ? 'button' : 'link'}
            tabIndex={0}
            aria-label={
                isSelectionActive
                    ? `${selected ? 'Deselect' : 'Select'} document “${plainTitle}”`
                    : `Open document “${plainTitle}”`
            }
            aria-pressed={isSelectionActive ? selected : undefined}
            className={`group relative flex h-[304px] w-full cursor-pointer flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 ${
                selected
                    ? 'border-primary ring-1 ring-primary/25'
                    : 'border-border-subtle hover:border-border-strong hover:shadow-md'
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}>
            <div className="absolute top-3 right-3 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                        selected
                            ? `Deselect “${plainTitle}”`
                            : `Select “${plainTitle}”`
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
            <CardHeader className="flex flex-shrink-0 flex-col p-4">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <TruncatedTooltip text={plainTitle}>
                            <CardTitle className="text-sm truncate">
                                {plainTitle}
                            </CardTitle>
                        </TruncatedTooltip>
                        <CardDescription className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                            {document.folder?.name && (
                                <span className="flex items-center gap-1 shrink-0">
                                    <Folder className="w-3 h-3" />
                                    <span className="truncate">
                                        {document.folder?.name} •
                                    </span>
                                </span>
                            )}
                            <span className="truncate">
                                Updated{' '}
                                {formatDate(document?.updated_at || '', {
                                    relative: true,
                                })}
                            </span>
                        </CardDescription>
                    </div>
                </div>
                <Separator className="mt-2" />
            </CardHeader>
            <CardContent className="px-4 pb-4 flex-1 overflow-hidden">
                <CardDocumentPreview blocks={document.sub_blocks} />
            </CardContent>
        </Card>
    );

    return hasMultipleSelected && selected ? (
        <BulkDocumentMenu mode={mode}>{cardContent}</BulkDocumentMenu>
    ) : (
        <DocumentMoreMenu
            documentId={document.id}
            workspaceId={workspaceId}
            folderId={document.folder?.id}
            isOwner={isOwner}>
            {cardContent}
        </DocumentMoreMenu>
    );
};

export const CardDocument = React.memo(CardDocumentComponent);

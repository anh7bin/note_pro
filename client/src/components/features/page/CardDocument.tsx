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
    const { toggleDocument, isSelected, selectedDocuments, mode } =
        useDocumentSelection();

    const plainTitle = getPlainText(document.content?.title) || 'Untitled';
    const selected = isSelected(document.id);
    const hasMultipleSelected = selectedDocuments.size > 1;

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

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
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

    const handleSelectToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleDocument(document.id);
    };

    const cardContent = (
        <Card
            className={`group relative cursor-pointer transition-all duration-200 h-[304px] w-full rounded-md flex flex-col ${
                selected
                    ? 'border-2 border-primary'
                    : 'border-2 border-[rgb(223,228,231)] hover:border-primary dark:border-border dark:hover:border-primary'
            }`}
            onClick={handleClick}>
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
            <CardHeader className="flex flex-col p-4 flex-shrink-0">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <TruncatedTooltip text={plainTitle}>
                            <CardTitle className="text-sm truncate">
                                {plainTitle}
                            </CardTitle>
                        </TruncatedTooltip>
                        <CardDescription className="text-xs flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
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

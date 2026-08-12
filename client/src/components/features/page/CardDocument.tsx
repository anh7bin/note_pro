'use client';

import { DocumentMoreMenu } from '@/components/features/page/DocumentMoreMenu';
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
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { Document } from '@/types/app';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { CardDocumentPreview } from './CardDocumentPreview';

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

    const plainTitle = getPlainText(document.content?.title) || 'Untitled';

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

    return (
        <DocumentMoreMenu
            documentId={document.id}
            workspaceId={workspaceId}
            folderId={document.folder?.id}
            isOwner={isOwner}>
            <Card
                key={document.id}
                className="group relative cursor-pointer transition-all duration-200 h-[304px] w-full rounded-md border-[rgb(223,228,231)] hover:border-primary dark:border-border dark:hover:border-primary flex flex-col"
                onClick={handleClick}>
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
                        <DocumentMoreMenu
                            documentId={document.id}
                            workspaceId={workspaceId}
                            folderId={document.folder?.id}
                            isOwner={isOwner}
                        />
                    </div>
                    <Separator className="mt-2" />
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 overflow-hidden">
                    <CardDocumentPreview blocks={document.sub_blocks} />
                </CardContent>
            </Card>
        </DocumentMoreMenu>
    );
};

export const CardDocument = React.memo(CardDocumentComponent);

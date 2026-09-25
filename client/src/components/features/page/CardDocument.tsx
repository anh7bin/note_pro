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
import { getPlainText } from '@/lib/text';
import { formatDate } from '@/lib/utils';
import { Document } from '@/types/app';
import { BlockType } from '@/types/types';
import { Folder, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { CardDocumentPreview } from './CardDocumentPreview';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useDocumentStar } from '@/hooks/useDocumentStar';
import { DocumentStarButton } from './DocumentStarButton';

const CardDocumentComponent = ({
    document,
    variant = 'card',
}: {
    document: Document;
    variant?: 'card' | 'list';
}) => {
    const router = useRouter();
    const { workspace } = useWorkspace();
    const currentUserId = useUserId();
    const { startLoading } = useLoading();
    const { locale, t } = useI18n();
    const {
        toggleDocument,
        isSelected,
        selectedDocuments,
        selectedFolders,
        mode,
    } = useDocumentSelection();

    const plainTitle =
        getPlainText(document.content?.title) || t('untitledPage');
    const listDescription =
        variant === 'list'
            ? document.sub_blocks
                  .map((block) => {
                      const text = getPlainText(block.content?.text)
                          .replace(/\s+/g, ' ')
                          .trim();
                      if (text) return text;
                      if (block.type === BlockType.FILE) {
                          return block.content?.fileName || t('attachment');
                      }
                      if (block.type === BlockType.TASK) {
                          return t('untitledTask');
                      }
                      if (block.type === BlockType.TABLE) {
                          return t('emptyTable');
                      }
                      return '';
                  })
                  .filter(Boolean)
                  .slice(0, 2)
                  .join(' · ') || t('emptyDocument')
            : '';
    const selected = isSelected(document.id);
    const hasMultipleSelected = selectedDocuments.size > 1;
    const isSelectionActive = selectedDocuments.size + selectedFolders.size > 0;
    const {
        isStarred,
        isLoading: isUpdatingStar,
        toggleStar,
    } = useDocumentStar(document.id, {
        initialIsStarred: document.document_stars.length > 0,
    });

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

    const listContent = (
        <div
            role={isSelectionActive ? 'button' : 'link'}
            tabIndex={0}
            className={`group grid min-h-[76px] cursor-pointer grid-cols-[minmax(0,1fr)_64px] items-center rounded-lg border px-5 py-2.5 transition-[background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:grid-cols-[minmax(0,1fr)_132px_116px_64px] ${
                selected
                    ? 'border-primary/60 bg-primary/[0.08] shadow-sm ring-1 ring-primary/15 hover:border-primary/80 hover:bg-primary/[0.12]'
                    : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover hover:shadow-sm'
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}>
            <div className="flex min-w-0 items-center gap-3 pr-4">
                <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border border-border bg-background shadow-sm">
                    <div
                        className="absolute inset-0.5 overflow-hidden"
                        style={{
                            transform: 'scale(0.16)',
                            transformOrigin: 'top left',
                            width: '200px',
                            height: '275px',
                        }}>
                        <CardDocumentPreview blocks={document.sub_blocks} />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <TruncatedTooltip text={plainTitle}>
                        <span className="block truncate text-sm font-semibold leading-5 text-foreground">
                            {plainTitle}
                        </span>
                    </TruncatedTooltip>
                    <span
                        className={`block max-w-[72ch] truncate text-xs leading-5 text-muted-foreground ${
                            listDescription === t('emptyDocument')
                                ? 'italic'
                                : ''
                        }`}>
                        {listDescription}
                    </span>
                </div>
            </div>
            <span className="hidden truncate pr-3 text-xs text-muted-foreground sm:block">
                {document.updated_at
                    ? formatDate(document.updated_at, {
                          relative: true,
                          locale,
                      })
                    : '—'}
            </span>
            <span className="hidden truncate pr-3 text-xs text-muted-foreground sm:block">
                {document.created_at
                    ? formatDate(document.created_at, {
                          relative: true,
                          locale,
                      })
                    : '—'}
            </span>
            <div className="flex items-center justify-end gap-1">
                {!isSelectionActive && (
                    <DocumentStarButton
                        isStarred={isStarred}
                        isLoading={isUpdatingStar}
                        onToggle={() => void toggleStar()}
                    />
                )}
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className={`w-5 h-5 rounded-full border focus-visible:opacity-100 ${
                        selected
                            ? 'border-primary-button bg-primary-button text-primary-foreground'
                            : 'border-border bg-background opacity-100 md:opacity-0 md:group-hover:opacity-100'
                    }`}
                    onClick={handleSelectToggle}>
                    {selected && <Check />}
                </Button>
            </div>
        </div>
    );

    const cardContent = (
        <Card
            role={isSelectionActive ? 'button' : 'link'}
            tabIndex={0}
            className={`group relative flex h-[304px] w-full cursor-pointer flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 ${
                selected
                    ? 'border-primary ring-1 ring-primary/25'
                    : 'border-border-subtle hover:border-border-strong hover:shadow-md'
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}>
            {!isSelectionActive && (
                <DocumentStarButton
                    isStarred={isStarred}
                    isLoading={isUpdatingStar}
                    onToggle={() => void toggleStar()}
                    className={`absolute right-10 top-3 z-10 h-5 w-5 rounded-full border transition-all focus-visible:opacity-100 ${
                        isStarred
                            ? 'bg-amber-500 text-primary-foreground opacity-100 hover:bg-amber-500 hover:text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground opacity-100 hover:border-amber-500 hover:bg-background hover:text-amber-500 md:opacity-0 md:group-hover:opacity-100'
                    }`}
                />
            )}
            <div className="absolute top-3 right-3 z-10">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className={`h-5 w-5 rounded-full border transition-all focus-visible:opacity-100 ${
                        selected
                            ? 'opacity-100 bg-primary-button border-primary-button text-primary-foreground'
                            : 'bg-background border-border opacity-100 hover:border-primary md:opacity-0 md:group-hover:opacity-100'
                    }`}
                    onClick={handleSelectToggle}>
                    {selected && <Check />}
                </Button>
            </div>
            <CardHeader className="flex flex-shrink-0 flex-col p-4">
                <div className="flex items-start justify-between gap-2 pr-16">
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
                                {t('updated', {
                                    time: formatDate(
                                        document?.updated_at || '',
                                        {
                                            relative: true,
                                            locale,
                                        }
                                    ),
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

    const content = variant === 'list' ? listContent : cardContent;

    return hasMultipleSelected && selected ? (
        <BulkDocumentMenu mode={mode}>{content}</BulkDocumentMenu>
    ) : (
        <DocumentMoreMenu
            documentId={document.id}
            workspaceId={workspaceId}
            folderId={document.folder?.id}
            isOwner={isOwner}
            isStarred={isStarred}
            isUpdatingStar={isUpdatingStar}
            onToggleStar={() => void toggleStar()}>
            {content}
        </DocumentMoreMenu>
    );
};

export const CardDocument = React.memo(CardDocumentComponent);

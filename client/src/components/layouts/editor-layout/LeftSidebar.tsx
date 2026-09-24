import { GetDocumentBlocksDocument } from '@/graphql/queries/__generated__/document.generated';
import { useDocumentBlocksData, useTaskCompletion } from '@/hooks';
import { highlightBlock } from '@/lib/blockHighlight';
import { formatFileSize } from '@/lib/fileUtils';
import { formatDate } from '@/lib/utils';
import { BlockType } from '@/types/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getPlainText } from '@/lib/text';
import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import { CardDocumentPreview } from '@/components/features/page/CardDocumentPreview';
import {
    SectionItem,
    SidebarAttachment,
    SidebarTabs,
    SidebarTask,
} from './SidebarTabs';
import { useI18n } from '@/contexts/I18nContext';

interface Props {
    pageId: string;
}

export const LeftSidebar = ({ pageId }: Props) => {
    const { processedRootBlock: rootBlock, processedBlocks: blocks } =
        useDocumentBlocksData(pageId);
    const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(
        () => new Set()
    );
    const { setTaskCompleted } = useTaskCompletion({
        refetchQueries: [
            {
                query: GetDocumentBlocksDocument,
                variables: { pageId },
            },
        ],
        awaitRefetchQueries: true,
    });
    const cleanupHighlightRef = useRef<(() => void) | null>(null);
    const { locale, t } = useI18n();

    const sectionItems = useMemo<SectionItem[]>(() => {
        const headingBlocks = (blocks || []).filter((block) => {
            const html = block.content?.text || '';
            const plain = getPlainText(block.content?.text) || '';
            const hasHeading =
                html.includes('<h1') ||
                html.includes('<h2') ||
                html.includes('<h3');
            const hasContent = plain.trim().length > 0;
            return hasHeading && hasContent;
        });

        return headingBlocks.map((block) => {
            const plain = getPlainText(block.content?.text) || '';
            const html = block.content?.text || '';

            let level = 1;
            if (html.includes('<h1')) level = 1;
            else if (html.includes('<h2')) level = 2;
            else if (html.includes('<h3')) level = 3;

            return {
                id: block.id,
                title: plain,
                level,
            };
        });
    }, [blocks]);

    const taskBlocks = useMemo(
        () =>
            (blocks || []).filter(
                (block) => block.type === BlockType.TASK && block.tasks?.length
            ),
        [blocks]
    );

    const tasks = useMemo<SidebarTask[]>(() => {
        return taskBlocks
            .map((block) => {
                const task = block.tasks?.[0];
                if (!task) return null;
                return {
                    blockId: block.id,
                    task,
                    title:
                        getPlainText(block.content?.text) || t('untitledTask'),
                };
            })
            .filter(Boolean) as SidebarTask[];
    }, [taskBlocks, t]);

    const attachmentBlocks = useMemo(
        () => (blocks || []).filter((block) => block.type === BlockType.FILE),
        [blocks]
    );

    const attachments = useMemo<SidebarAttachment[]>(() => {
        return attachmentBlocks.map((block) => {
            const content = block.content;
            const sizeLabel = content.fileSize
                ? formatFileSize(content.fileSize)
                : null;
            const uploadedAt = block.created_at || null;

            return {
                id: block.id,
                blockId: block.id,
                name: content.fileName ?? t('untitledPage'),
                type: content.fileType ?? 'application/octet-stream',
                size: sizeLabel,
                url: content.fileUrl ?? null,
                uploadedAt,
            };
        });
    }, [attachmentBlocks, t]);
    const documentTitle = useMemo(
        () => getPlainText(rootBlock?.content?.title).trim(),
        [rootBlock?.content?.title]
    );

    const handleScrollToBlock = useCallback((blockId: string) => {
        if (cleanupHighlightRef.current) {
            cleanupHighlightRef.current();
            cleanupHighlightRef.current = null;
        }

        const cleanup = highlightBlock(blockId);
        if (cleanup) {
            cleanupHighlightRef.current = cleanup;
        }
    }, []);

    const handleToggleTask = useCallback(
        async (taskId: string, completed: boolean) => {
            if (!taskId) {
                return;
            }
            setPendingTaskIds((prev) => {
                const next = new Set(prev);
                next.add(taskId);
                return next;
            });
            try {
                await setTaskCompleted(taskId, completed);
            } finally {
                setPendingTaskIds((prev) => {
                    const next = new Set(prev);
                    next.delete(taskId);
                    return next;
                });
            }
        },
        [setTaskCompleted]
    );

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="h-full flex flex-col overflow-hidden">
                {documentTitle && (
                    <div className="sticky top-0 z-10 flex shrink-0 flex-row items-center gap-3 border-b border-border-subtle bg-background px-4 py-3">
                        <div
                            className="relative shrink-0 overflow-hidden rounded-sm border border-border-subtle bg-card p-2"
                            style={{ width: 24, height: 32 }}>
                            <div
                                className="absolute inset-0.5 overflow-hidden"
                                style={{
                                    transform: 'scale(0.07)',
                                    transformOrigin: 'top left',
                                    width: '266px',
                                    height: '266px',
                                }}>
                                <div className="text-[10px]">
                                    <CardDocumentPreview
                                        blocks={blocks || []}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                            <TruncatedTooltip text={documentTitle}>
                                <span className="truncate text-sm font-medium">
                                    {documentTitle}
                                </span>
                            </TruncatedTooltip>
                            <span className="truncate text-xs text-muted-foreground">
                                {formatDate(rootBlock?.updated_at || '', {
                                    relative: true,
                                    locale,
                                })}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-hidden px-4 pt-3">
                    <SidebarTabs
                        sections={sectionItems}
                        tasks={tasks}
                        attachments={attachments}
                        blocks={blocks || []}
                        pendingTaskIds={pendingTaskIds}
                        onScrollToBlock={handleScrollToBlock}
                        onToggleTask={handleToggleTask}
                    />
                </div>
            </div>
        </div>
    );
};

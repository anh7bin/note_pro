'use client';

import { useCallback } from 'react';
import { TiptapWrapper } from './TiptapWrapper';
import { PageLoading } from '@/components/ui/loading';
import { DocumentTitleInput } from '@/components/features/page/DocumentTitleInput';
import { BlockList } from '@/components/features/page/BlockList';
import { Separator } from '@/components/ui/separator';
import { DocumentCover } from '@/components/features/page/DocumentCover';
import { AddCoverButton } from '@/components/features/page/AddCoverButton';
import { DocumentIcon } from '@/components/features/page/DocumentIcon';
import { useDocumentCover } from '@/hooks/useDocumentCover';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { BlockInteractionsProvider } from '@/contexts/BlockInteractionsContext';
import { BlockInteractions } from './BlockInteractions';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import type { DraftDocumentConfig } from '@/contexts/editor/types';

interface Props {
    pageId: string;
    draft?: DraftDocumentConfig;
}

function EditorContent({
    autoFocusTitle = false,
}: {
    autoFocusTitle?: boolean;
}) {
    const {
        loading,
        persisted,
        rootBlock,
        editable,
        handleUpdateTitle,
        handleUpdateDocumentIcon,
        handleUpdateDocumentCover,
        handleTitleBlur,
        handleTitleEnter,
    } = useEditor();
    const { coverImage, handleAddCover, handleRemoveCover, isUploading } =
        useDocumentCover({
            rootBlock,
            onUpdateCover: handleUpdateDocumentCover,
        });
    const documentIcon = rootBlock?.content.icon;
    const { t } = useI18n();

    const handleTitleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key !== 'Enter') return false;

            event.preventDefault();
            handleTitleEnter();
            return true;
        },
        [handleTitleEnter]
    );

    if (loading || !rootBlock) {
        return <PageLoading />;
    }

    return (
        <div className="relative h-full">
            <div className="mx-auto h-full w-full max-w-full">
                <div className="mx-auto h-full max-w-full overflow-hidden bg-card">
                    <div
                        data-tour="editor-scroll"
                        className="h-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-x-none">
                        {coverImage && (
                            <DocumentCover
                                imageUrl={coverImage}
                                onRemove={handleRemoveCover}
                                onChangeCover={handleAddCover}
                                editable={editable}
                                isUploading={isUploading}
                            />
                        )}
                        <div
                            className={cn(
                                'mx-auto max-w-[50rem] px-6 pb-16 sm:px-10',
                                !coverImage && 'pt-8',
                                coverImage && !documentIcon && 'pt-4'
                            )}>
                            <div
                                className={cn(
                                    'group flex flex-col gap-2',
                                    coverImage && documentIcon && '-mt-10'
                                )}>
                                {documentIcon && (
                                    <div className="relative z-10 w-fit">
                                        <DocumentIcon
                                            icon={documentIcon}
                                            editable={editable}
                                            display="large"
                                            onChange={handleUpdateDocumentIcon}
                                        />
                                    </div>
                                )}
                                {editable && (!documentIcon || !coverImage) && (
                                    <div className="flex min-h-8 flex-wrap items-center gap-1">
                                        {!documentIcon && (
                                            <DocumentIcon
                                                editable={editable}
                                                display="action"
                                                onChange={
                                                    handleUpdateDocumentIcon
                                                }
                                            />
                                        )}
                                        {!coverImage && (
                                            <AddCoverButton
                                                onAddCover={handleAddCover}
                                                isUploading={isUploading}
                                            />
                                        )}
                                    </div>
                                )}
                                <div
                                    data-tour="editor-title"
                                    className="group/block relative pl-[5px]">
                                    <DocumentTitleInput
                                        value={rootBlock.content?.title || ''}
                                        onChange={handleUpdateTitle}
                                        onBlur={handleTitleBlur}
                                        onKeyDown={handleTitleKeyDown}
                                        editable={editable}
                                        autoFocus={autoFocusTitle}
                                        placeholder={t('untitledPage')}
                                    />
                                    {persisted && (
                                        <BlockInteractions
                                            blockId={rootBlock.id}
                                            variant="document-title"
                                        />
                                    )}
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div data-tour="editor-blocks" className="min-h-24">
                                <TiptapWrapper>
                                    <BlockList />
                                </TiptapWrapper>
                            </div>
                            <div className="h-[40vh]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TiptapBlockEditor({ pageId, draft }: Props) {
    return (
        <EditorProvider pageId={pageId} draft={draft}>
            <BlockInteractionsProvider pageId={pageId} enabled={!draft}>
                <EditorContent autoFocusTitle={Boolean(draft)} />
            </BlockInteractionsProvider>
        </EditorProvider>
    );
}

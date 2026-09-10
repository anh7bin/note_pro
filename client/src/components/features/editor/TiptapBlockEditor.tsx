'use client';

import { useCallback } from 'react';
import { TiptapWrapper } from './TiptapWrapper';
import { PageLoading } from '@/components/ui/loading';
import { DocumentTitleInput } from '@/components/features/page/DocumentTitleInput';
import { BlockList } from '@/components/features/page/BlockList';
import { Separator } from '@/components/ui/separator';
import { DocumentCover } from '@/components/features/page/DocumentCover';
import { AddCoverButton } from '@/components/features/page/AddCoverButton';
import { useDocumentCover } from '@/hooks/useDocumentCover';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { BlockInteractionsProvider } from '@/contexts/BlockInteractionsContext';
import { BlockInteractions } from './BlockInteractions';

interface Props {
    pageId: string;
}

function EditorContent() {
    const {
        loading,
        rootBlock,
        editable,
        handleUpdateTitle,
        handleTitleBlur,
        handleTitleEnter,
    } = useEditor();
    const { coverImage, handleAddCover, handleRemoveCover, isUploading } =
        useDocumentCover({
            rootBlock,
        });
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
                    <div className="h-full overflow-y-auto">
                        {coverImage && (
                            <DocumentCover
                                imageUrl={coverImage}
                                onRemove={handleRemoveCover}
                                onChangeCover={handleAddCover}
                                editable={editable}
                                isUploading={isUploading}
                            />
                        )}
                        <div className="mx-auto max-w-[61rem] px-9 py-16 sm:px-10">
                            <div className="group flex flex-col gap-2">
                                {!coverImage && editable && (
                                    <div className="">
                                        <AddCoverButton
                                            onAddCover={handleAddCover}
                                            isUploading={isUploading}
                                        />
                                    </div>
                                )}
                                <div className="group/block relative pl-[5px]">
                                    <DocumentTitleInput
                                        value={rootBlock.content?.title || ''}
                                        onChange={handleUpdateTitle}
                                        onBlur={handleTitleBlur}
                                        onKeyDown={handleTitleKeyDown}
                                        editable={editable}
                                    />
                                    <BlockInteractions
                                        blockId={rootBlock.id}
                                        variant="document-title"
                                    />
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <TiptapWrapper>
                                <BlockList />
                            </TiptapWrapper>
                            <div className="h-[40vh]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TiptapBlockEditor({ pageId }: Props) {
    return (
        <EditorProvider pageId={pageId}>
            <BlockInteractionsProvider pageId={pageId}>
                <EditorContent />
            </BlockInteractionsProvider>
        </EditorProvider>
    );
}

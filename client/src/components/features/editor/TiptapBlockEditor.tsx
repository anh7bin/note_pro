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
            <div className="max-w-full mx-auto w-full h-full">
                <div className="mx-auto max-w-full bg-card overflow-hidden h-full">
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
                        <div className="mx-auto max-w-4xl py-16">
                            <div className="group flex flex-col gap-2">
                                {!coverImage && editable && (
                                    <div className="">
                                        <AddCoverButton
                                            onAddCover={handleAddCover}
                                            isUploading={isUploading}
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <DocumentTitleInput
                                            value={
                                                rootBlock.content?.title || ''
                                            }
                                            onChange={handleUpdateTitle}
                                            onBlur={handleTitleBlur}
                                            onKeyDown={handleTitleKeyDown}
                                            editable={editable}
                                        />
                                    </div>
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
            <EditorContent />
        </EditorProvider>
    );
}

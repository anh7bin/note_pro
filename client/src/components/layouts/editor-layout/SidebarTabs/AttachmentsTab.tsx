import { getFileBadge, getFileExtension } from '@/lib/fileUtils';
import { Paperclip } from 'lucide-react';
import Image from 'next/image';
import { EmptyState } from './EmptyState';
import { SidebarAttachment } from './types';

interface AttachmentsTabProps {
    attachments: SidebarAttachment[];
    onScrollToBlock: (blockId: string) => void;
    activeBlockId?: string;
}

export const AttachmentsTab = ({
    attachments,
    onScrollToBlock,
    activeBlockId,
}: AttachmentsTabProps) => {
    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Attachments
            </h2>
            <div className="text-sm space-y-1.5">
                {attachments.length === 0 ? (
                    <EmptyState
                        icon={<Paperclip className="h-4 w-4" />}
                        title="No attachments yet"
                        description="Upload files directly from the editor."
                    />
                ) : (
                    attachments.map((file) => (
                        <AttachmentRow
                            key={file.id}
                            file={file}
                            isActive={file.blockId === activeBlockId}
                            onScrollToBlock={onScrollToBlock}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

function AttachmentRow({
    file,
    isActive,
    onScrollToBlock,
}: {
    file: SidebarAttachment;
    isActive: boolean;
    onScrollToBlock: (blockId: string) => void;
}) {
    const extension = getFileExtension(file.name, file.type);
    const badge = getFileBadge(extension);

    return (
        <button
            type="button"
            onClick={() => onScrollToBlock(file.blockId)}
            className={`flex min-h-11 w-full items-center gap-3 rounded-md border px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                isActive
                    ? 'border-border bg-muted/60'
                    : 'border-transparent hover:border-border hover:bg-muted/50'
            }`}>
            <div className="relative flex h-10 w-8 items-center justify-center">
                <Image
                    src="/images/file-badge-base.png"
                    alt=""
                    width={32}
                    height={40}
                    className="pointer-events-none select-none object-contain"
                />
                <span
                    className={`pointer-events-none absolute text-[10px] font-semibold uppercase tracking-[0.08em] ${badge.textClass}`}>
                    {badge.label}
                </span>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{file.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                    {file.type}
                    {file.size ? ` · ${file.size}` : ''}
                </p>
            </div>
        </button>
    );
}

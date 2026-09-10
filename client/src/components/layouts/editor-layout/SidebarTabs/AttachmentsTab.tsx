import { FileTypeIcon } from '@/components/ui/file-type-icon';
import { getFileBadge, getFileExtension } from '@/lib/fileUtils';
import { Paperclip } from 'lucide-react';
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
            <div
                className="flex h-10 w-8 shrink-0 items-center justify-center"
                aria-hidden="true">
                <FileTypeIcon extension={extension} className="h-9 w-7" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold" title={file.name}>
                    {file.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                    {extension?.toUpperCase() ?? badge.label}
                    {file.size ? ` · ${file.size}` : ''}
                </p>
            </div>
        </button>
    );
}

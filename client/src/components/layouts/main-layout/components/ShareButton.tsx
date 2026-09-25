'use client';

import { useDocumentSharing } from '@/components/features/page/share/hooks/useDocumentSharing';
import { ShareTab } from '@/components/features/page/share/ShareTab';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { LockKeyhole } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { HiOutlineUsers } from 'react-icons/hi2';

interface ShareExportButtonProps {
    documentId: string;
    accessRequestNotificationCount?: number;
}

export function ShareButton({
    documentId,
    accessRequestNotificationCount = 0,
}: ShareExportButtonProps) {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const {
        sharedUsers,
        linkPermission,
        pendingRequests,
        refetch,
        isOwner,
        isLoading,
    } = useDocumentSharing(documentId);
    const { t } = useI18n();

    const accessRequestCount = isOwner ? pendingRequests.length : 0;
    const hasSharedUsers = sharedUsers.length > 0;
    const hasLinkShared = linkPermission !== 'restricted';
    const isShared = hasSharedUsers || hasLinkShared;

    const ShareIcon = hasLinkShared
        ? FiLink
        : hasSharedUsers
          ? HiOutlineUsers
          : LockKeyhole;

    useEffect(() => {
        const openShare = searchParams.get('openShare');
        if (openShare === 'true') {
            setOpen(true);
            const url = new URL(window.location.href);
            url.searchParams.delete('openShare');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams]);

    useEffect(() => {
        if (isOwner && accessRequestNotificationCount > 0) {
            void refetch();
        }
    }, [accessRequestNotificationCount, isOwner, refetch]);

    return (
        <PopoverPanel
            open={open}
            onOpenChange={setOpen}
            contentProps={{
                align: 'end',
                className:
                    'w-[min(30rem,calc(100vw-1rem))] overflow-hidden p-0',
            }}
            trigger={
                <SimpleTooltip title={t('share')}>
                    <Button
                        data-tour="editor-share"
                        variant={isShared ? 'default' : 'outline'}
                        size="xs"
                        className="relative max-lg:size-7 max-lg:p-0">
                        {isLoading ? <Loading size="sm" /> : <ShareIcon />}
                        <span className="hidden lg:inline">
                            {isShared ? t('shared') : t('share')}
                        </span>
                        {accessRequestCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                        )}
                    </Button>
                </SimpleTooltip>
            }>
            <ShareTab documentId={documentId} />
        </PopoverPanel>
    );
}

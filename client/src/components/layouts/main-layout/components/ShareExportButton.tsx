'use client';

import { ExportTab } from '@/components/features/page/share/ExportTab';
import { useDocumentSharing } from '@/components/features/page/share/hooks/useDocumentSharing';
import { ShareTab } from '@/components/features/page/share/ShareTab';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/contexts/I18nContext';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaShare } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { HiOutlineUsers } from 'react-icons/hi2';

interface ShareExportButtonProps {
    documentId: string;
    accessRequestNotificationCount?: number;
}

export function ShareExportButton({
    documentId,
    accessRequestNotificationCount = 0,
}: ShareExportButtonProps) {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [inviteMode, setInviteMode] = useState(false);
    const { sharedUsers, linkPermission, pendingRequests, refetch, isOwner } =
        useDocumentSharing(documentId);
    const { t } = useI18n();

    const accessRequestCount = isOwner ? pendingRequests.length : 0;
    const hasSharedUsers = sharedUsers.length > 0;
    const hasLinkShared = linkPermission !== 'restricted';
    const isShared = hasSharedUsers || hasLinkShared;

    const ShareIcon = hasLinkShared
        ? FiLink
        : hasSharedUsers
          ? HiOutlineUsers
          : FaShare;

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
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) setInviteMode(false);
            }}
            contentProps={{
                align: 'end',
                className: 'w-[min(30rem,calc(100vw-1rem))] p-3',
            }}
            trigger={
                <Button
                    data-tour="editor-share"
                    variant={isShared ? 'default' : 'outline'}
                    size="sm"
                    className="relative"
                    aria-label={
                        accessRequestCount > 0
                            ? `${t('shareAndExport')}. ${t(
                                  'pendingAccessRequestCount',
                                  {
                                      count: accessRequestCount,
                                  }
                              )}`
                            : t('shareAndExport')
                    }>
                    <ShareIcon />
                    <span className="hidden lg:inline">
                        {isShared ? t('shared') : t('share')}
                    </span>
                    {accessRequestCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background"
                        />
                    )}
                </Button>
            }>
            <Tabs defaultValue="share" className="w-full">
                {!inviteMode && (
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="share">{t('share')}</TabsTrigger>
                        <TabsTrigger value="export">{t('export')}</TabsTrigger>
                    </TabsList>
                )}
                <TabsContent value="share" className="m-0">
                    <ShareTab
                        documentId={documentId}
                        onInviteModeChange={setInviteMode}
                    />
                </TabsContent>
                <TabsContent value="export" className="m-0">
                    <ExportTab />
                </TabsContent>
            </Tabs>
        </PopoverPanel>
    );
}

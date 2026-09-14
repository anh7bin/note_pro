'use client';

import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaShare } from 'react-icons/fa';
import { ShareTab } from '@/components/features/page/share/ShareTab';
import { ExportTab } from '@/components/features/page/share/ExportTab';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface ShareExportButtonProps {
    documentId: string;
}

export function ShareExportButton({ documentId }: ShareExportButtonProps) {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [inviteMode, setInviteMode] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        const openShare = searchParams.get('openShare');
        if (openShare === 'true') {
            setOpen(true);
            const url = new URL(window.location.href);
            url.searchParams.delete('openShare');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams]);

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
                    variant="outline"
                    size="sm"
                    aria-label={t('shareAndExport')}>
                    <FaShare />
                    <span className="hidden lg:inline">{t('share')}</span>
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

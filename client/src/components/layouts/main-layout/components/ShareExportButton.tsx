'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiShare2 } from 'react-icons/fi';
import { ShareTab } from '@/components/features/page/share/ShareTab';
import { ExportTab } from '@/components/features/page/share/ExportTab';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ShareExportButtonProps {
    documentId: string;
}

export function ShareExportButton({ documentId }: ShareExportButtonProps) {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

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
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-lg">
                    <FiShare2 className="h-4 w-4" />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[480px] p-3 rounded-lg"
                align="end">
                <Tabs defaultValue="share" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-2xl">
                        <TabsTrigger value="share" className="rounded-2xl">
                            Share
                        </TabsTrigger>
                        <TabsTrigger value="export" className="rounded-2xl">
                            Export
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="share" className="m-0">
                        <ShareTab documentId={documentId} />
                    </TabsContent>
                    <TabsContent value="export" className="m-0">
                        <ExportTab documentId={documentId} />
                    </TabsContent>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

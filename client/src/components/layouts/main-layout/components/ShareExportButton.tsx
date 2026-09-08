'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaShare } from 'react-icons/fa';
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
                    aria-label="Share or export document">
                    <FaShare className="h-4 w-4" />
                    <span className="hidden lg:inline">Share</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[min(30rem,calc(100vw-1rem))] p-3"
                align="end">
                <Tabs defaultValue="share" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="share">Share</TabsTrigger>
                        <TabsTrigger value="export">Export</TabsTrigger>
                    </TabsList>
                    <TabsContent value="share" className="m-0">
                        <ShareTab documentId={documentId} />
                    </TabsContent>
                    <TabsContent value="export" className="m-0">
                        <ExportTab />
                    </TabsContent>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

'use client';

import { SearchInputField } from 'components/features/search/SearchInputField';
import { ThemeToggle } from 'components/ui/theme-toggle';
import { TopLoadingBar } from 'components/ui/TopLoadingBar';
import { useDocumentAccess } from 'contexts/DocumentAccessContext';
import { useLoading } from 'contexts/LoadingContext';
import { useSidebar } from 'contexts/SidebarContext';
import { ROUTES } from 'lib/routes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { NotificationButton } from './components/NotificationButton';
import { RequestEditButton } from './components/RequestEditButton';
import { SettingButton } from './components/SettingButton';
import { ShareExportButton } from './components/ShareExportButton';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { DocumentPresence } from './components/DocumentPresence';

interface Props {
    workspaceSlug: string;
}

export default function Header({ workspaceSlug }: Props) {
    const { toggle } = useSidebar();
    const { documentId } = useDocumentAccess();
    const { isLoading, startLoading } = useLoading();
    const pathname = usePathname();

    // Check if we're on a document/editor page
    const isDocumentPage = pathname.startsWith('/editor/');

    const { permissionType } = useDocumentPermission(
        isDocumentPage ? documentId || '' : ''
    );

    const handleLogoClick = () => {
        const allDocsPath = ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug);
        if (pathname !== allDocsPath) {
            startLoading();
        }
    };

    return (
        workspaceSlug && (
            <>
                <TopLoadingBar isLoading={isLoading} />
                <header className="fixed inset-x-0 top-0 z-50 grid h-[var(--header-height)] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-border-subtle bg-background/95 px-3 backdrop-blur-sm sm:px-4">
                    <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="icon">
                            <Link
                                href={ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug)}
                                onClick={handleLogoClick}>
                                <Image
                                    src="/images/logo.png"
                                    alt="Home Page"
                                    width={24}
                                    height={24}
                                    priority
                                />
                            </Link>
                        </Button>
                        <SimpleTooltip title="Toggle sidebar visibility">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={toggle}>
                                <PanelLeft />
                            </Button>
                        </SimpleTooltip>
                    </div>
                    <div className="min-w-0 justify-self-end lg:w-full lg:max-w-xl lg:justify-self-center">
                        <div className="lg:hidden">
                            <MobileSearch />
                        </div>
                        <div className="hidden lg:block">
                            <SearchInputField />
                        </div>
                    </div>
                    <div className="flex min-w-0 items-center justify-end gap-1">
                        {isDocumentPage && documentId && permissionType && (
                            <>
                                <RequestEditButton documentId={documentId} />
                                <DocumentPresence documentId={documentId} />
                                <ShareExportButton documentId={documentId} />
                            </>
                        )}
                        <ThemeToggle />
                        <NotificationButton />
                        <SettingButton />
                    </div>
                </header>
            </>
        )
    );
}

function MobileSearch() {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Search">
                    <Search />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-[calc(100vw-1rem)] p-2 lg:hidden">
                <SearchInputField onResultClick={() => setOpen(false)} />
            </PopoverContent>
        </Popover>
    );
}

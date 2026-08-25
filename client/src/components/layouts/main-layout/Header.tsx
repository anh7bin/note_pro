'use client';

import { SearchInputField } from 'components/features/search/SearchInputField';
import { ThemeToggle } from 'components/ui/theme-toggle';
import { TopLoadingBar } from 'components/ui/TopLoadingBar';
import { HEADER_HEIGHT } from 'lib/constants';
import { useDocumentAccess } from 'contexts/DocumentAccessContext';
import { useLoading } from 'contexts/LoadingContext';
import { useSidebar } from 'contexts/SidebarContext';
import { ROUTES } from 'lib/routes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineViewSidebar } from 'react-icons/md';
import { NotificationButton } from './components/NotificationButton';
import { RequestEditButton } from './components/RequestEditButton';
import { SettingButton } from './components/SettingButton';
import { ShareExportButton } from './components/ShareExportButton';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';

interface Props {
    workspaceSlug: string;
}

export default function Header({ workspaceSlug }: Props) {
    const { toggle } = useSidebar();
    const { documentId } = useDocumentAccess();
    const { isLoading, startLoading } = useLoading();
    const pathname = usePathname();

    const { permissionType } = useDocumentPermission(documentId || '');

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
                <header
                    className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center mx-4 bg-background"
                    style={{ height: HEADER_HEIGHT }}>
                    <div className="flex items-center gap-2">
                        <Link
                            href={ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug)}
                            onClick={handleLogoClick}>
                            <Image
                                src="/images/logo.png"
                                alt="Bin Craft Logo"
                                width={24}
                                height={24}
                            />
                        </Link>
                        <MdOutlineViewSidebar
                            size={20}
                            className="cursor-pointer"
                            onClick={toggle}
                        />
                    </div>
                    <div className="min-w-[480px]">
                        <SearchInputField />
                    </div>
                    <div className="flex items-center gap-2">
                        {documentId && permissionType && (
                            <>
                                <RequestEditButton documentId={documentId} />
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

'use client';

import { Button } from '@/components/ui/button';
import { LanguageMenu } from '@/components/ui/language-switcher';
import { useI18n } from '@/contexts/I18nContext';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';
import { SearchInputField } from 'components/features/search/SearchInputField';
import { ThemeToggle } from 'components/ui/theme-toggle';
import { TopLoadingBar } from 'components/ui/TopLoadingBar';
import { useDocumentAccess } from 'contexts/DocumentAccessContext';
import { useLoading } from 'contexts/LoadingContext';
import { ROUTES } from 'lib/routes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DocumentPresence } from './components/DocumentPresence';
import { MobileSearch } from './components/MobileSearch';
import { NotificationButton } from './components/NotificationButton';
import { RequestEditButton } from './components/RequestEditButton';
import { SettingButton } from './components/SettingButton';
import { ShareExportButton } from './components/ShareExportButton';
import { SidebarToggleButton } from './components/SidebarToggleButton';
import { TourHelpButton } from './components/TourHelpButton';

interface Props {
    workspaceSlug: string;
}

export default function Header({ workspaceSlug }: Props) {
    const { documentId } = useDocumentAccess();
    const { isLoading, startLoading } = useLoading();
    const pathname = usePathname();
    const { t } = useI18n();

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
                    <div className="flex items-center gap-0.5">
                        <Button asChild variant="ghost" size="icon">
                            <Link
                                href={ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug)}
                                onClick={handleLogoClick}>
                                <Image
                                    src="/images/logo.png"
                                    alt={t('homePage')}
                                    width={20}
                                    height={20}
                                    priority
                                />
                            </Link>
                        </Button>
                        <SidebarToggleButton />
                    </div>
                    <div className="min-w-0 justify-self-end lg:w-full lg:max-w-xl lg:justify-self-center">
                        <div data-tour="mobile-search" className="lg:hidden">
                            <MobileSearch />
                        </div>
                        <div
                            data-tour="desktop-search"
                            className="hidden lg:block">
                            <SearchInputField />
                        </div>
                    </div>
                    <div className="flex min-w-0 items-center justify-end gap-1">
                        {isDocumentPage && documentId && permissionType && (
                            <>
                                <DocumentPresence documentId={documentId} />
                                <RequestEditButton documentId={documentId} />
                                <ShareExportButton documentId={documentId} />
                            </>
                        )}
                        <ThemeToggle />
                        <NotificationButton />
                        <LanguageMenu compact />
                        <TourHelpButton />
                        <SettingButton />
                    </div>
                </header>
            </>
        )
    );
}

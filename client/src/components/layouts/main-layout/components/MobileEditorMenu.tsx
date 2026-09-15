'use client';

import { SearchInputField } from '@/components/features/search/SearchInputField';
import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLogout } from '@/hooks/useLogout';
import {
    ArrowLeft,
    Check,
    CircleHelp,
    Ellipsis,
    House,
    LogOut,
    Moon,
    Search,
    Sun,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '@/lib/routes';

export function MobileEditorMenu({ workspaceSlug }: { workspaceSlug: string }) {
    const [open, setOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const { t, locale, setLocale } = useI18n();
    const { theme, setTheme, mounted } = useTheme();
    const { startTour, isTourRunning } = useOnboarding();
    const { data: session } = useSession();
    const { logout, isLoggingOut } = useLogout();

    const closeMenu = () => {
        setOpen(false);
        setShowSearch(false);
    };

    return (
        <PopoverPanel
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) setShowSearch(false);
            }}
            contentProps={{
                align: 'end',
                className: 'w-[min(21rem,calc(100vw-1rem))] p-2',
            }}
            trigger={
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-11"
                    data-tour="editor-more"
                    aria-label={t('moreOptions')}
                    aria-expanded={open}>
                    <Ellipsis aria-hidden="true" />
                </Button>
            }>
            {showSearch ? (
                <div className="space-y-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-11 w-full justify-start"
                        onClick={() => setShowSearch(false)}>
                        <ArrowLeft aria-hidden="true" />
                        {t('back')}
                    </Button>
                    <SearchInputField autoFocus onResultClick={closeMenu} />
                </div>
            ) : (
                <div className="space-y-1">
                    <Button
                        asChild
                        variant="ghost"
                        className="h-11 w-full justify-start px-3 min-[375px]:hidden">
                        <Link
                            href={ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug)}
                            onClick={closeMenu}>
                            <House aria-hidden="true" />
                            {t('allDocs')}
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 w-full justify-start px-3"
                        onClick={() => setShowSearch(true)}>
                        <Search aria-hidden="true" />
                        {t('search')}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 w-full justify-start px-3"
                        disabled={!mounted}
                        onClick={() => {
                            setTheme(theme === 'light' ? 'dark' : 'light');
                            closeMenu();
                        }}>
                        {theme === 'light' ? (
                            <Moon aria-hidden="true" />
                        ) : (
                            <Sun aria-hidden="true" />
                        )}
                        {mounted
                            ? t(
                                  theme === 'light'
                                      ? 'switchToDark'
                                      : 'switchToLight'
                              )
                            : t('loadingTheme')}
                    </Button>

                    <div className="border-t border-border-subtle px-1 pt-2">
                        <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">
                            {t('language')}
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                            {(['vi', 'en'] as const).map((language) => (
                                <Button
                                    key={language}
                                    type="button"
                                    variant={
                                        locale === language
                                            ? 'secondary'
                                            : 'ghost'
                                    }
                                    className="h-11 justify-between px-2 text-xs"
                                    aria-pressed={locale === language}
                                    onClick={() => {
                                        setLocale(language);
                                        closeMenu();
                                    }}>
                                    {t(
                                        language === 'vi'
                                            ? 'vietnamese'
                                            : 'english'
                                    )}
                                    {locale === language && (
                                        <Check aria-hidden="true" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 w-full justify-start px-3"
                        disabled={isTourRunning}
                        onClick={() => {
                            closeMenu();
                            startTour('editor');
                        }}>
                        <CircleHelp aria-hidden="true" />
                        {t('tourStartAgain')}
                    </Button>

                    <div className="border-t border-border-subtle px-3 pt-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <UserAvatar
                                avatarUrl={session?.user?.image}
                                name={session?.user?.name}
                                email={session?.user?.email || ''}
                                size={28}
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {session?.user?.name || t('account')}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {session?.user?.email || t('noEmail')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 w-full justify-start px-3"
                        disabled={isLoggingOut}
                        onClick={logout}>
                        <LogOut aria-hidden="true" />
                        {t('logout')}
                    </Button>
                </div>
            )}
        </PopoverPanel>
    );
}

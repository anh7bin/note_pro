import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FlagIcon } from '@/components/ui/language-switcher';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLogout } from '@/hooks/useLogout';
import { isLocale } from '@/i18n/config';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const SettingButton = () => {
    const { data: session } = useSession();
    const { logout, isLoggingOut } = useLogout();
    const { t, locale, setLocale } = useI18n();
    const { theme, setTheme, mounted } = useTheme();

    return (
        <div className="relative">
            <DropdownMenu modal={false}>
                <SimpleTooltip title={t('account')}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                            <UserAvatar
                                avatarUrl={session?.user?.image}
                                name={session?.user?.name}
                                email={session?.user?.email || ''}
                                size={20}
                            />
                        </Button>
                    </DropdownMenuTrigger>
                </SimpleTooltip>
                <DropdownMenuContent className="w-58" align="end">
                    <DropdownMenuLabel>
                        <div className="flex flex-col items-center gap-2">
                            <UserAvatar
                                avatarUrl={session?.user?.image}
                                name={session?.user?.name}
                                email={session?.user?.email || ''}
                                size={32}
                            />
                            <p className="text-sm font-medium leading-none">
                                {session?.user?.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {session?.user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        disabled={!mounted}
                        onClick={() =>
                            setTheme(theme === 'light' ? 'dark' : 'light')
                        }>
                        {theme === 'light' ? <Moon /> : <Sun />}
                        {mounted
                            ? t(
                                  theme === 'light'
                                      ? 'switchToDark'
                                      : 'switchToLight'
                              )
                            : t('loadingTheme')}
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <FlagIcon locale={locale} />
                            {t('language')}
                            <span className="ml-auto text-xs text-muted-foreground">
                                {locale.toUpperCase()}
                            </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={locale}
                                    onValueChange={(value) => {
                                        if (isLocale(value)) setLocale(value);
                                    }}>
                                    <DropdownMenuRadioItem value="vi">
                                        <FlagIcon locale="vi" />
                                        {t('vietnamese')}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">
                                        <FlagIcon locale="en" />
                                        {t('english')}
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} disabled={isLoggingOut}>
                        <LogOut />
                        {t('logout')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

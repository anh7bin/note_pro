import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLogout } from '@/hooks/useLogout';
import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';

export const SettingButton = () => {
    const { data: session } = useSession();
    const { logout, isLoggingOut } = useLogout();
    const { t } = useI18n();

    return (
        <div className="relative">
            <DropdownMenu modal={false}>
                <SimpleTooltip title={t('account')}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t('account')}>
                            <UserAvatar
                                avatarUrl={session?.user?.image}
                                name={session?.user?.name}
                                email={session?.user?.email || ''}
                                size={24}
                            />
                        </Button>
                    </DropdownMenuTrigger>
                </SimpleTooltip>
                <DropdownMenuContent className="w-56 p-2" align="end">
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
                                {session?.user?.email ?? t('noEmail')}
                            </p>
                        </div>
                    </DropdownMenuLabel>
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

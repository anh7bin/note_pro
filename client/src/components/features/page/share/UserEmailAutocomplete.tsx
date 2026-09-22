'use client';

import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useI18n } from '@/contexts/I18nContext';
import { useSearchUsersByEmailLazyQuery } from '@/graphql/queries/__generated__/user.generated';
import { PermissionType } from '@/types/types';
import debounce from 'lodash/debounce';
import differenceBy from 'lodash/differenceBy';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export type UserSearchResult = {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
};

type InvitePermission = PermissionType.READ | PermissionType.WRITE;

interface UserEmailAutocompleteProps {
    documentTitle: string;
    onInviteUsers: (
        users: UserSearchResult[],
        permission: InvitePermission
    ) => Promise<boolean>;
    onClose: () => void;
    excludeUserIds?: string[];
}

const getDisplayName = (user: UserSearchResult, fallback: string) =>
    user.name || user.email?.split('@')[0] || fallback;

export function UserEmailAutocomplete({
    documentTitle,
    onInviteUsers,
    onClose,
    excludeUserIds = [],
}: UserEmailAutocompleteProps) {
    const [inputValue, setInputValue] = useState('');
    const [permission, setPermission] = useState<InvitePermission>(
        PermissionType.WRITE
    );
    const [selectedUsers, setSelectedUsers] = useState(
        () => new Map<string, UserSearchResult>()
    );
    const [isInviting, setIsInviting] = useState(false);
    const [searchUsers, { data, loading }] = useSearchUsersByEmailLazyQuery();
    const { t } = useI18n();

    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm: string) => {
                void searchUsers({
                    variables: {
                        searchTerm: '%' + searchTerm.trim() + '%',
                    },
                });
            }, 250),
        [searchUsers]
    );

    useEffect(() => {
        debouncedSearch(inputValue);
        return () => debouncedSearch.cancel();
    }, [debouncedSearch, inputValue]);

    const filteredUsers = useMemo(() => {
        if (!data?.users) return [];
        return differenceBy(
            data.users,
            excludeUserIds.map((id) => ({ id })),
            'id'
        );
    }, [data?.users, excludeUserIds]);

    const toggleUser = (user: UserSearchResult, checked: boolean) => {
        setSelectedUsers((current) => {
            const next = new Map(current);
            if (checked) next.set(user.id, user);
            else next.delete(user.id);
            return next;
        });
    };

    const handleInvite = async () => {
        if (selectedUsers.size === 0 || isInviting) return;

        setIsInviting(true);
        const wasInvited = await onInviteUsers(
            [...selectedUsers.values()],
            permission
        );
        setIsInviting(false);

        if (wasInvited) onClose();
    };

    return (
        <div className="flex min-h-[340px] flex-col">
            <div className="flex items-center justify-between border-b border-border px-1 pb-3">
                <h2 className="min-w-0 truncate pr-3 text-sm font-semibold">
                    {t('shareDocument', {
                        title: documentTitle || t('untitledPage'),
                    })}
                </h2>
                <Button variant="ghost" size="icon-xs" onClick={onClose}>
                    <X />
                </Button>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_8rem] gap-2 py-3">
                <Input
                    autoFocus
                    type="search"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder={t('addEmails')}
                    aria-label={t('searchUsersByEmail')}
                    autoComplete="off"
                    className="min-w-0"
                />
                <Select
                    value={permission}
                    onValueChange={(value) => {
                        if (
                            value === PermissionType.READ ||
                            value === PermissionType.WRITE
                        ) {
                            setPermission(value);
                        }
                    }}>
                    <SelectTrigger
                        className="w-full"
                        aria-label={t('invitedUserPermission')}>
                        <SelectValue>
                            {permission === PermissionType.WRITE
                                ? t('editor')
                                : t('viewer')}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={PermissionType.WRITE}>
                            {t('editor')}
                        </SelectItem>
                        <SelectItem value={PermissionType.READ}>
                            {t('viewer')}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-1">
                {loading && !data ? (
                    <div className="flex min-h-32 items-center justify-center">
                        <Loading size="sm" text={t('searchingUsers')} />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                        {t('noUsersFound')}
                    </div>
                ) : (
                    filteredUsers.map((user) => {
                        const checked = selectedUsers.has(user.id);
                        const checkboxId = 'invite-user-' + user.id;

                        return (
                            <label
                                key={user.id}
                                htmlFor={checkboxId}
                                className="flex min-h-12 cursor-pointer items-center gap-1.5 rounded-md p-1.5 transition-colors hover:bg-accent">
                                <UserAvatar
                                    avatarUrl={user.avatar_url}
                                    name={user.name}
                                    email={user.email}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium">
                                        {getDisplayName(user, t('unknown'))}
                                    </span>
                                    <span className="block truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </span>
                                <Checkbox
                                    id={checkboxId}
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                        toggleUser(user, value === true)
                                    }
                                    className="h-4 w-4"
                                />
                            </label>
                        );
                    })
                )}
            </div>

            <Button
                size="sm"
                className="w-full"
                disabled={selectedUsers.size === 0 || isInviting}
                aria-busy={isInviting}
                onClick={() => void handleInvite()}>
                {isInviting ? (
                    <>
                        <Spinner size="sm" className="text-current" />
                        {t('inviting')}
                    </>
                ) : selectedUsers.size > 1 ? (
                    t('invitePeople', { count: selectedUsers.size })
                ) : (
                    t('invite')
                )}
            </Button>
        </div>
    );
}

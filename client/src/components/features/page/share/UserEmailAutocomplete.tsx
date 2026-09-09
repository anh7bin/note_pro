'use client';

import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSearchUsersByEmailLazyQuery } from '@/graphql/queries/__generated__/user.generated';
import { PermissionType } from '@/types/types';
import debounce from 'lodash/debounce';
import differenceBy from 'lodash/differenceBy';
import { Loader2, X } from 'lucide-react';
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

const getDisplayName = (user: UserSearchResult) =>
    user.name || user.email?.split('@')[0] || 'Unknown';

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
                    Share &ldquo;{documentTitle || 'Untitled'}&rdquo;
                </h2>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label="Back to share settings"
                    onClick={onClose}>
                    <X aria-hidden="true" />
                </Button>
            </div>

            <div className="flex gap-2 py-3">
                <Input
                    autoFocus
                    type="search"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Add emails to invite"
                    aria-label="Search users by email"
                    autoComplete="off"
                    className="min-w-0 flex-1"
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
                        className="w-[112px]"
                        aria-label="Permission for invited users">
                        <SelectValue>
                            {permission === PermissionType.WRITE
                                ? 'Editor'
                                : 'Viewer'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={PermissionType.WRITE}>
                            Editor
                        </SelectItem>
                        <SelectItem value={PermissionType.READ}>
                            Viewer
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div
                className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-3"
                aria-live="polite">
                {loading && !data ? (
                    <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                        <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                        Searching users…
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                        No users found
                    </div>
                ) : (
                    filteredUsers.map((user) => {
                        const checked = selectedUsers.has(user.id);
                        const checkboxId = 'invite-user-' + user.id;

                        return (
                            <label
                                key={user.id}
                                htmlFor={checkboxId}
                                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent">
                                <UserAvatar
                                    avatarUrl={user.avatar_url}
                                    name={user.name}
                                    email={user.email}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium">
                                        {getDisplayName(user)}
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
                                    aria-label={
                                        (checked ? 'Deselect ' : 'Select ') +
                                        getDisplayName(user)
                                    }
                                    className="h-5 w-5"
                                />
                            </label>
                        );
                    })
                )}
            </div>

            <Button
                type="button"
                className="w-full"
                disabled={selectedUsers.size === 0 || isInviting}
                aria-busy={isInviting}
                onClick={() => void handleInvite()}>
                {isInviting ? (
                    <>
                        <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                        Inviting…
                    </>
                ) : selectedUsers.size > 1 ? (
                    'Invite ' + selectedUsers.size + ' people'
                ) : (
                    'Invite'
                )}
            </Button>
        </div>
    );
}

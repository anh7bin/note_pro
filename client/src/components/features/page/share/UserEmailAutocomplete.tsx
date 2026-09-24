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
import { PermissionType } from '@/types/types';
import { Mail, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export type UserSearchResult = {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
};

type InvitePermission = PermissionType.READ | PermissionType.WRITE;

interface UserEmailAutocompleteProps {
    documentId: string;
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserEmailAutocomplete({
    documentId,
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
    const [searchResult, setSearchResult] = useState<UserSearchResult | null>(
        null
    );
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchFailed, setSearchFailed] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const { t } = useI18n();

    const normalizedEmail = inputValue.trim().toLowerCase();
    const hasCompleteEmail =
        normalizedEmail.length <= 254 && EMAIL_PATTERN.test(normalizedEmail);

    useEffect(() => {
        setSearchResult(null);
        setHasSearched(false);
        setSearchFailed(false);

        if (!hasCompleteEmail) {
            setIsSearching(false);
            return;
        }

        const controller = new AbortController();
        setIsSearching(true);

        const timeoutId = window.setTimeout(async () => {
            try {
                const response = await fetch('/api/share/invitee', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        documentId,
                        email: normalizedEmail,
                    }),
                    signal: controller.signal,
                });

                if (!response.ok) throw new Error('Invite search failed');

                const result = (await response.json()) as {
                    user: UserSearchResult | null;
                };
                setSearchResult(result.user);
                setHasSearched(true);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    setSearchFailed(true);
                }
            } finally {
                if (!controller.signal.aborted) setIsSearching(false);
            }
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [documentId, hasCompleteEmail, normalizedEmail]);

    const resultAlreadyHasAccess = Boolean(
        searchResult && excludeUserIds.includes(searchResult.id)
    );
    const filteredUsers = useMemo(
        () => (searchResult && !resultAlreadyHasAccess ? [searchResult] : []),
        [resultAlreadyHasAccess, searchResult]
    );

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
                <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t('close')}
                    onClick={onClose}>
                    <X />
                </Button>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_8rem] gap-2 py-3">
                <label htmlFor="invite-email" className="sr-only">
                    {t('addEmails')}
                </label>
                <Input
                    id="invite-email"
                    autoFocus
                    type="email"
                    inputMode="email"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder={t('addEmails')}
                    autoComplete="off"
                    aria-describedby="invite-email-help"
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
                        aria-label={t('permissionHelp')}>
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

            <div
                id="invite-email-help"
                className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-1"
                aria-live="polite">
                {isSearching ? (
                    <div className="flex min-h-32 items-center justify-center">
                        <Loading size="sm" text={t('searchingUsers')} />
                    </div>
                ) : searchFailed ? (
                    <div
                        role="alert"
                        className="flex min-h-32 items-center justify-center px-4 text-center text-sm text-destructive">
                        {t('inviteSearchError')}
                    </div>
                ) : !inputValue.trim() || !hasCompleteEmail ? (
                    <div className="flex min-h-32 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
                        <Mail className="size-5" />
                        <span>{t('enterCompleteEmail')}</span>
                    </div>
                ) : resultAlreadyHasAccess ? (
                    <div className="flex min-h-32 items-center justify-center px-4 text-center text-sm text-muted-foreground">
                        {t('userAlreadyHasAccess')}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                        {hasSearched ? t('noUsersFound') : null}
                    </div>
                ) : (
                    filteredUsers.map((user) => {
                        const checked = selectedUsers.has(user.id);
                        const checkboxId = 'invite-user-' + user.id;

                        return (
                            <label
                                key={user.id}
                                htmlFor={checkboxId}
                                className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-accent">
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

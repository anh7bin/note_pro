'use client';

import { Input } from '@/components/ui/input';
import { useSearchUsersByEmailLazyQuery } from '@/graphql/queries/__generated__/user.generated';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import differenceBy from 'lodash/differenceBy';
import { UserAvatar } from '@/components/shared';

export type UserSearchResult = {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
};

interface UserEmailAutocompleteProps {
    onSelectUser: (user: UserSearchResult) => void;
    excludeUserIds?: string[];
    placeholder?: string;
}

export function UserEmailAutocomplete({
    onSelectUser,
    excludeUserIds = [],
    placeholder = 'Add emails to invite',
}: UserEmailAutocompleteProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchUsers, { data, loading }] = useSearchUsersByEmailLazyQuery();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm: string) => {
                searchUsers({
                    variables: {
                        searchTerm: `%${searchTerm}%`,
                    },
                });
                setIsOpen(true);
            }, 300),
        [searchUsers]
    );

    useEffect(() => {
        if (!inputValue || inputValue.length < 2) {
            setIsOpen(false);
            debouncedSearch.cancel();
            return;
        }

        debouncedSearch(inputValue);
    }, [inputValue, debouncedSearch]);

    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredUsers = useMemo(() => {
        if (!data?.users) return [];
        return differenceBy(
            data.users,
            excludeUserIds.map((id) => ({ id })),
            'id'
        );
    }, [data, excludeUserIds]);

    const handleSelectUser = (user: UserSearchResult) => {
        onSelectUser(user);
        setInputValue('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <Input
                ref={inputRef}
                type="email"
                aria-label="Search users by email"
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-expanded={isOpen}
                autoComplete="off"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                    if (filteredUsers.length > 0 && inputValue.length >= 2) {
                        setIsOpen(true);
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') setIsOpen(false);
                }}
                className="w-full"
            />

            {isOpen && (loading || filteredUsers.length > 0) && (
                <div
                    ref={dropdownRef}
                    id={listboxId}
                    role="listbox"
                    aria-label="User search results"
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
                    {loading ? (
                        <div
                            role="status"
                            className="p-3 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    ) : (
                        <div className="py-1">
                            {filteredUsers.map((user) => (
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected="false"
                                    key={user.id}
                                    onClick={() => handleSelectUser(user)}
                                    className="flex min-h-11 w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
                                    <UserAvatar
                                        avatarUrl={user.avatar_url}
                                        name={user.name}
                                        email={user.email || ''}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {user.name ||
                                                user.email?.split('@')[0] ||
                                                'Unknown'}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isOpen &&
                !loading &&
                filteredUsers.length === 0 &&
                inputValue.length >= 2 && (
                    <div
                        ref={dropdownRef}
                        id={listboxId}
                        role="status"
                        className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md">
                        <div className="p-3 text-center text-sm text-muted-foreground">
                            No users found
                        </div>
                    </div>
                )}
        </div>
    );
}

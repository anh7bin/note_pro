'use client';

import { UserAvatar } from '@/components/shared';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useDocumentPresence } from '@/hooks/useDocumentPresence';

const MAX_VISIBLE_USERS = 3;

export function DocumentPresence({ documentId }: { documentId: string }) {
    const users = useDocumentPresence(documentId);
    const visibleUsers = users.slice(0, MAX_VISIBLE_USERS);
    const overflowCount = Math.max(0, users.length - visibleUsers.length);
    const statusText = `${users.length} ${users.length === 1 ? 'person is' : 'people are'} viewing this document`;

    if (users.length === 0) return null;

    return (
        <PopoverPanel
            contentProps={{ align: 'end', className: 'w-72 p-2' }}
            trigger={
                <button
                    type="button"
                    className="flex h-8 cursor-pointer items-center rounded-md px-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={statusText}>
                    <span className="flex -space-x-2">
                        {visibleUsers.map((user) => (
                            <span
                                key={user.id}
                                className="relative rounded-full ring-2 ring-background first:block [&:not(:first-child)]:hidden sm:[&:not(:first-child)]:block">
                                <UserAvatar
                                    avatarUrl={user.avatarUrl}
                                    name={user.name}
                                    email={user.email}
                                    size={26}
                                    className="size-[26px]"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-background bg-emerald-500"
                                />
                            </span>
                        ))}
                    </span>
                    {users.length > 1 && (
                        <span className="ml-1 text-xs font-medium text-muted-foreground sm:hidden">
                            +{users.length - 1}
                        </span>
                    )}
                    {overflowCount > 0 && (
                        <span className="ml-1 hidden text-xs font-medium text-muted-foreground sm:inline">
                            +{overflowCount}
                        </span>
                    )}
                    <span className="sr-only" aria-live="polite">
                        {statusText}
                    </span>
                </button>
            }>
            <div className="px-2 pb-2 pt-1">
                <p className="text-sm font-semibold">Currently viewing</p>
                <p className="text-xs text-muted-foreground">{statusText}</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex min-w-0 items-center gap-3 rounded-md px-2 py-2">
                        <span className="relative shrink-0">
                            <UserAvatar
                                avatarUrl={user.avatarUrl}
                                name={user.name}
                                email={user.email}
                                size={32}
                            />
                            <span
                                aria-hidden="true"
                                className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-popover bg-emerald-500"
                            />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                                <span className="truncate text-sm font-medium">
                                    {user.name || user.email}
                                </span>
                                {user.isCurrentUser && (
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        You
                                    </span>
                                )}
                            </span>
                            {user.name && (
                                <span className="block truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </PopoverPanel>
    );
}

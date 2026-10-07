'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useI18n } from '@/contexts/I18nContext';
import { getMentionUserLabel, type MentionUser } from '@/types/mentions';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { MentionNodeAttrs } from '@tiptap/extension-mention';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface MentionSuggestionListRef {
    onKeyDown: (event: KeyboardEvent) => boolean;
}

function getInitials(user: MentionUser): string {
    const value = user.name?.trim() || user.email;
    return (
        value
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase() || '?'
    );
}

export const MentionSuggestionList = forwardRef<
    MentionSuggestionListRef,
    SuggestionProps<MentionUser, MentionNodeAttrs>
>(function MentionSuggestionList({ items, command }, ref) {
    const { t } = useI18n();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = items[index];
        if (item) {
            command({ id: item.id, label: getMentionUserLabel(item) });
        }
    };

    useEffect(() => setSelectedIndex(0), [items]);

    useImperativeHandle(
        ref,
        () => ({
            onKeyDown: (event) => {
                if (!items.length) return false;

                if (event.key === 'ArrowUp') {
                    setSelectedIndex(
                        (current) => (current + items.length - 1) % items.length
                    );
                    return true;
                }
                if (event.key === 'ArrowDown') {
                    setSelectedIndex((current) => (current + 1) % items.length);
                    return true;
                }
                if (event.key === 'Enter' || event.key === 'Tab') {
                    selectItem(selectedIndex);
                    return true;
                }
                return false;
            },
        }),
        [items, selectedIndex]
    );

    return (
        <div
            className="max-h-64 w-72 overflow-y-auto rounded-xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-xl"
            role={items.length ? 'listbox' : 'status'}>
            {items.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    {t('noMentionUsersFound')}
                </p>
            ) : (
                items.map((user, index) => (
                    <button
                        key={user.id}
                        type="button"
                        role="option"
                        aria-selected={index === selectedIndex}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 data-[active=true]:bg-accent"
                        data-active={index === selectedIndex}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectItem(index)}>
                        <Avatar className="size-8 shrink-0">
                            <AvatarImage src={user.avatar_url || ''} alt="" />
                            <AvatarFallback className="text-[10px]">
                                {getInitials(user)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                                {getMentionUserLabel(user)}
                            </span>
                            {user.name && (
                                <span className="block truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            )}
                        </span>
                    </button>
                ))
            )}
        </div>
    );
});

'use client';

import { useState } from 'react';
import { SmilePlus, Trash2 } from 'lucide-react';
import { EmojiPickerPopover } from '@/components/shared/EmojiPickerPopover';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import showToast from '@/lib/toast';

interface DocumentIconProps {
    icon?: string;
    editable: boolean;
    display?: 'action' | 'large';
    onChange: (icon: string | null) => Promise<boolean>;
}

export function DocumentIcon({
    icon,
    editable,
    display = icon ? 'large' : 'action',
    onChange,
}: DocumentIconProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useI18n();

    const updateIcon = async (nextIcon: string | null) => {
        if (isSaving) return;

        setIsSaving(true);
        const didSave = await onChange(nextIcon);
        setIsSaving(false);
        if (didSave) {
            setIsOpen(false);
        } else {
            showToast.error(t('documentIconUpdateError'));
        }
    };

    if (!editable && !icon) return null;

    if (!editable) {
        return (
            <div
                role="img"
                className="flex h-20 w-20 items-center justify-center text-7xl leading-none">
                {icon}
            </div>
        );
    }

    const trigger =
        display === 'large' && icon ? (
            <button
                type="button"
                className="flex h-20 w-20 touch-manipulation items-center justify-center rounded-lg text-7xl leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                disabled={isSaving}>
                <span>{icon}</span>
            </button>
        ) : (
            <Button variant="ghost" size="xs" disabled={isSaving}>
                <SmilePlus />
                {t('addIcon')}
            </Button>
        );

    return (
        <PopoverPanel
            open={isOpen}
            onOpenChange={setIsOpen}
            contentProps={{
                align: 'start',
                side: 'bottom',
                sideOffset: 8,
                collisionPadding: 16,
                onOpenAutoFocus: (event) => event.preventDefault(),
                className: 'w-auto border-0 p-0 shadow-none',
            }}
            trigger={trigger}>
            <EmojiPickerPopover
                show={isOpen}
                onSelect={(emoji) => void updateIcon(emoji)}
                onClose={() => setIsOpen(false)}
                width={320}
                height={380}
                manualWheelScroll
                header={
                    icon ? (
                        <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
                            <span className="px-1 text-xs font-medium text-muted-foreground">
                                {t('documentIcon')}
                            </span>
                            <Button
                                variant="ghost"
                                size="xs"
                                disabled={isSaving}
                                onClick={() => void updateIcon(null)}
                                className={cn(
                                    'text-xs font-normal text-muted-foreground',
                                    'hover:bg-destructive/10 hover:text-destructive'
                                )}>
                                <Trash2 />
                                {t('removeIcon')}
                            </Button>
                        </div>
                    ) : undefined
                }
            />
        </PopoverPanel>
    );
}

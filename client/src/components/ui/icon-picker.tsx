'use client';

import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import { EmojiPickerPopover } from '@/components/shared/EmojiPickerPopover';
import React, { useState } from 'react';
import { IconDefault } from '../features/page/FolderDialog';

interface IconPickerProps {
    selectedIcon: string;
    onIconChange: (emoji: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
    selectedIcon,
    onIconChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useI18n();

    const handleEmojiSelect = (emoji: string) => {
        onIconChange(emoji);
        setIsOpen(false);
    };

    return (
        <div>
            <PopoverPanel
                open={isOpen}
                onOpenChange={setIsOpen}
                contentProps={{
                    align: 'end',
                    side: 'right',
                    sideOffset: 12,
                    collisionPadding: 8,
                    onOpenAutoFocus: (event) => event.preventDefault(),
                    className: 'z-[9999] w-auto border-0 p-0 shadow-none',
                }}
                trigger={
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start gap-3 p-3 bg-card border-border text-foreground">
                        <span
                            className={cn(
                                'w-8 h-8 rounded-full border flex items-center justify-center text-xl'
                            )}>
                            {selectedIcon || IconDefault}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {t('chooseIcon')}
                        </span>
                    </Button>
                }>
                <EmojiPickerPopover
                    show={isOpen}
                    onSelect={handleEmojiSelect}
                    onClose={() => setIsOpen(false)}
                    manualWheelScroll
                />
            </PopoverPanel>
        </div>
    );
};

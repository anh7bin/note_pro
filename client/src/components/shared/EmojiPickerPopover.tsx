'use client';

import { useEffect, useRef } from 'react';
import EmojiPickerReact, { Theme, EmojiClickData } from 'emoji-picker-react';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeProvider';

interface EmojiPickerPopoverProps {
    show: boolean;
    onSelect: (emoji: string) => void;
    onClose: () => void;
    width?: number;
    height?: number;
    searchPlaceHolder?: string;
}

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
    show,
    onSelect,
    onClose,
    width = 350,
    height = 400,
    searchPlaceHolder,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useI18n();
    const { theme } = useTheme();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            return () =>
                document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [show, onClose]);

    useEffect(() => {
        if (show && ref.current) {
            const handleWheel = (e: WheelEvent) => {
                e.stopPropagation();
            };

            const pickerElement = ref.current;
            pickerElement.addEventListener('wheel', handleWheel, {
                passive: true,
            });

            return () => {
                pickerElement.removeEventListener('wheel', handleWheel);
            };
        }
    }, [show]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onSelect(emojiData.emoji);
        onClose();
    };

    const emojiTheme = theme === 'dark' ? Theme.DARK : Theme.LIGHT;

    return !show ? null : (
        <div
            ref={ref}
            className="shadow-lg rounded-lg overflow-hidden bg-popover border border-border"
            style={{ pointerEvents: 'auto' }}
            onWheel={(e) => e.stopPropagation()}>
            <EmojiPickerReact
                onEmojiClick={handleEmojiClick}
                theme={emojiTheme}
                width={width}
                height={height}
                searchPlaceHolder={searchPlaceHolder ?? t('searchEmoji')}
                searchClearButtonLabel={t('clearEmojiSearch')}
                previewConfig={{
                    showPreview: false,
                }}
            />
        </div>
    );
};

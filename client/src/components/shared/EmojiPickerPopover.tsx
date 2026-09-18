'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import EmojiPickerReact, { Theme, EmojiClickData } from 'emoji-picker-react';
import { useTheme } from '@/contexts/ThemeProvider';

interface EmojiPickerPopoverProps {
    show: boolean;
    onSelect: (emoji: string) => void;
    onClose: () => void;
    width?: number;
    height?: number;
    manualWheelScroll?: boolean;
    header?: ReactNode;
}

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
    show,
    onSelect,
    onClose,
    width = 350,
    height = 400,
    manualWheelScroll = false,
    header,
}) => {
    const ref = useRef<HTMLDivElement>(null);
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
        const picker = ref.current;
        if (!show || !manualWheelScroll || !picker) return;

        const handleWheel = (event: WheelEvent) => {
            const scrollBody = picker.querySelector<HTMLElement>('.epr-body');
            if (!scrollBody || event.deltaY === 0) return;

            const delta =
                event.deltaMode === WheelEvent.DOM_DELTA_LINE
                    ? event.deltaY * 16
                    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
                      ? event.deltaY * scrollBody.clientHeight
                      : event.deltaY;

            event.preventDefault();
            event.stopPropagation();
            scrollBody.scrollTop += delta;
        };

        picker.addEventListener('wheel', handleWheel, { passive: false });
        return () => picker.removeEventListener('wheel', handleWheel);
    }, [manualWheelScroll, show]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onSelect(emojiData.emoji);
        onClose();
    };

    const emojiTheme = theme === 'dark' ? Theme.DARK : Theme.LIGHT;

    return !show ? null : (
        <div
            ref={ref}
            className="overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
            style={{ pointerEvents: 'auto' }}>
            {header}
            <EmojiPickerReact
                onEmojiClick={handleEmojiClick}
                theme={emojiTheme}
                width={width}
                height={height}
                searchDisabled
                previewConfig={{
                    showPreview: false,
                }}
            />
        </div>
    );
};

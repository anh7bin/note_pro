'use client';

import { memo, useCallback, useState } from 'react';
import { EditorColorPicker } from '../EditorColorPicker';

interface Props {
    onSelect: (color: string | null) => void;
    currentColor: string | null;
    isActive: boolean;
}

export const TextColorControl = memo(function TextColorControl({
    onSelect,
    currentColor,
    isActive,
}: Props) {
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleToggle = useCallback(() => {
        setShowColorPicker((current) => !current);
    }, []);

    const handleClose = useCallback(() => {
        setShowColorPicker(false);
    }, []);

    const handleSelect = useCallback(
        (color: string | null) => {
            onSelect(color);
            setShowColorPicker(false);
        },
        [onSelect]
    );

    return (
        <EditorColorPicker
            kind="text"
            show={showColorPicker}
            toggle={handleToggle}
            close={handleClose}
            onSelect={handleSelect}
            currentColor={currentColor}
            isActive={isActive}
        />
    );
});

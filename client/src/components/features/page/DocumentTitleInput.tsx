'use client';

import { memo } from 'react';
import { TiptapEditor } from '../editor/TiptapEditor';

interface Props {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onKeyDown?: (event: KeyboardEvent) => boolean | void;
    onBlur?: () => void;
    className?: string;
    editable?: boolean;
    autoFocus?: boolean;
}

export const DocumentTitleInput = memo(
    function DocumentTitleInput({
        onFocus,
        onKeyDown,
        onBlur,
        value,
        onChange,
        className,
        editable = true,
        autoFocus = false,
    }: Props) {
        return (
            <TiptapEditor
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                className={className}
                editorClassName="prose max-w-none break-words text-3xl font-bold leading-tight focus:outline-none sm:text-[40px]"
                isTitle={true}
                isFocused={autoFocus}
                focusPosition="end"
                showBubbleMenu={true}
                editable={editable}
            />
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.value === nextProps.value &&
            prevProps.editable === nextProps.editable &&
            prevProps.autoFocus === nextProps.autoFocus &&
            prevProps.onKeyDown === nextProps.onKeyDown
        );
    }
);

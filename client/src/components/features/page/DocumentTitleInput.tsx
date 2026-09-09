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
    }: Props) {
        return (
            <TiptapEditor
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                className={className}
                editorClassName="prose prose-sm max-w-none focus:outline-none text-xl font-bold break-words"
                isTitle={true}
                showBubbleMenu={true}
                editable={editable}
            />
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.value === nextProps.value &&
            prevProps.editable === nextProps.editable &&
            prevProps.onKeyDown === nextProps.onKeyDown
        );
    }
);

'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { TiptapEditor } from '../editor/TiptapEditor';
import { getPlainText } from '@/lib/text';

interface Props {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onKeyDown?: (event: KeyboardEvent) => boolean | void;
    onBlur?: () => void;
    className?: string;
    editable?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
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
        placeholder,
    }: Props) {
        const [isEmpty, setIsEmpty] = useState(
            () => !getPlainText(value).trim()
        );

        useEffect(() => {
            setIsEmpty(!getPlainText(value).trim());
        }, [value]);

        const handleChange = useCallback(
            (nextValue: string) => {
                setIsEmpty(!getPlainText(nextValue).trim());
                onChange(nextValue);
            },
            [onChange]
        );

        return (
            <div className="relative">
                {editable && isEmpty && placeholder && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 z-10 break-words text-3xl font-bold leading-tight text-muted-foreground opacity-70 sm:text-[40px]">
                        {placeholder}
                    </span>
                )}
                <TiptapEditor
                    value={value}
                    onChange={handleChange}
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
            </div>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.value === nextProps.value &&
            prevProps.editable === nextProps.editable &&
            prevProps.autoFocus === nextProps.autoFocus &&
            prevProps.placeholder === nextProps.placeholder &&
            prevProps.onChange === nextProps.onChange &&
            prevProps.onKeyDown === nextProps.onKeyDown
        );
    }
);

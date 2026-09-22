'use client';

import type { TranslationKey } from '@/i18n/messages';
import { Editor } from '@tiptap/react';
import {
    Bold,
    Code,
    Italic,
    RemoveFormatting,
    Strikethrough,
    Underline,
} from 'lucide-react';
import { memo, useCallback } from 'react';
import { BubbleButton } from '../BubbleButton';

interface Props {
    editor: Editor;
    isMarkActive: (type: string) => boolean;
}

interface ButtonConfig {
    id: string;
    type?: string;
    label: TranslationKey;
    icon: React.ReactNode;
    action: (editor: Editor) => void;
}

const FORMATTING_BUTTONS: ButtonConfig[] = [
    {
        id: 'bold',
        type: 'bold',
        label: 'bold',
        icon: <Bold />,
        action: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
        id: 'italic',
        type: 'italic',
        label: 'italic',
        icon: <Italic />,
        action: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
        id: 'strike',
        type: 'strike',
        label: 'strikethrough',
        icon: <Strikethrough />,
        action: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
        id: 'code',
        type: 'code',
        label: 'inlineCode',
        icon: <Code />,
        action: (editor) => editor.chain().focus().toggleCode().run(),
    },
    {
        id: 'underline',
        type: 'underline',
        label: 'underline',
        icon: <Underline />,
        action: (editor) => editor.chain().focus().toggleUnderline().run(),
    },
    {
        id: 'clear-formatting',
        label: 'clearFormatting',
        icon: <RemoveFormatting />,
        action: (editor) =>
            editor.chain().focus().unsetAllMarks().clearNodes().run(),
    },
];

export const FormattingButtons = memo(function FormattingButtons({
    editor,
    isMarkActive,
}: Props) {
    const handleClick = useCallback(
        (action: (editor: Editor) => void) => {
            action(editor);
        },
        [editor]
    );

    return (
        <>
            {FORMATTING_BUTTONS.map((button) => (
                <BubbleButton
                    key={button.id}
                    onClick={() => handleClick(button.action)}
                    isActive={
                        button.type ? isMarkActive(button.type) : undefined
                    }>
                    {button.icon}
                </BubbleButton>
            ))}
        </>
    );
});

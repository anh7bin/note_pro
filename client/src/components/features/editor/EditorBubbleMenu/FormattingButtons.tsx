'use client';

import { memo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold,
    Code,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react';
import { BubbleButton } from '../BubbleButton';

interface Props {
    editor: Editor;
    isMarkActive: (type: string) => boolean;
}

interface ButtonConfig {
    type: string;
    label: string;
    icon: React.ReactNode;
    action: (editor: Editor) => void;
}

const FORMATTING_BUTTONS: ButtonConfig[] = [
    {
        type: 'bold',
        label: 'Bold',
        icon: <Bold />,
        action: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
        type: 'italic',
        label: 'Italic',
        icon: <Italic />,
        action: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
        type: 'strike',
        label: 'Strikethrough',
        icon: <Strikethrough />,
        action: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
        type: 'code',
        label: 'Inline code',
        icon: <Code />,
        action: (editor) => editor.chain().focus().toggleCode().run(),
    },
    {
        type: 'bulletList',
        label: 'Bulleted list',
        icon: <List />,
        action: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        type: 'orderedList',
        label: 'Numbered list',
        icon: <ListOrdered />,
        action: (editor) => editor.chain().focus().toggleOrderedList().run(),
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
                    key={button.type}
                    ariaLabel={button.label}
                    onClick={() => handleClick(button.action)}
                    isActive={isMarkActive(button.type)}>
                    {button.icon}
                </BubbleButton>
            ))}
        </>
    );
});

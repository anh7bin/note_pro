import { CustomCode } from '@/lib/tiptap/extensions/custom-code';
import { TrailingParagraphCleanup } from '@/lib/tiptap/extensions/trailing-paragraph-cleanup';
import { EnterHandler } from '@/lib/tiptap/handlers/enter';
import { PasteHandler } from '@/lib/tiptap/handlers/paste';
import type { AddEditorBlockHandler } from '@/types/editor';
import type { MentionUser } from '@/types/mentions';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { TableKit } from '@tiptap/extension-table';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { Markdown } from 'tiptap-markdown';
import { MARKDOWN_CONFIG, TABLE_CONFIG } from './constants';
import { createMentionSuggestion } from '../mentionSuggestion';

const lowlight = createLowlight(common);

interface ExtensionsConfig {
    getPosition: () => number;
    placeholder?: string;
    onAddBlock?: AddEditorBlockHandler;
    onBackspaceAtStart?: (currentContent: string) => boolean;
    enableMentions?: boolean;
    getMentionUsers: () => MentionUser[];
}

export const createExtensions = ({
    getPosition,
    placeholder,
    onAddBlock,
    onBackspaceAtStart,
    enableMentions = true,
    getMentionUsers,
}: ExtensionsConfig) => [
    StarterKit.configure({
        code: false,
        heading: {
            levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
        // Each Tiptap instance is already one application block. StarterKit's
        // trailing paragraph would otherwise render as an extra empty line
        // after headings, lists, blockquotes, and code blocks.
        trailingNode: false,
        blockquote: {
            HTMLAttributes: {
                class: 'border-l-4 border-border-strong pl-4 italic',
            },
        },
        codeBlock: false,
    }),
    ...(placeholder
        ? [
              Placeholder.configure({
                  placeholder,
                  showOnlyCurrent: false,
                  showOnlyWhenEditable: true,
              }),
          ]
        : []),
    TrailingParagraphCleanup,
    Markdown.configure(MARKDOWN_CONFIG),
    CustomCode,
    CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
            class: 'tiptap-code-block',
        },
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({
        multicolor: true,
    }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
    }),
    ...(enableMentions
        ? [
              Mention.configure({
                  HTMLAttributes: {
                      class: 'mention',
                  },
                  renderText: ({ node }) => `@${node.attrs.label}`,
                  renderHTML: ({ node }) => [
                      'span',
                      {
                          'data-type': 'mention',
                          'data-id': node.attrs.id,
                          'data-label': node.attrs.label,
                          class: 'mention',
                      },
                      `@${node.attrs.label}`,
                  ],
                  suggestion: createMentionSuggestion(getMentionUsers),
              }),
          ]
        : []),
    Typography,
    TableKit.configure({
        table: TABLE_CONFIG,
        tableCell: {
            HTMLAttributes: {
                class: 'table-cell',
            },
        },
    }),
    EnterHandler.configure({
        onAddBlock,
        onBackspaceAtStart,
        getPosition,
    }),
    PasteHandler.configure({
        onAddBlock,
        getPosition,
    }),
];

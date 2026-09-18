import {
    Code2,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    Minus,
    Paperclip,
    Pilcrow,
    Quote,
    Smile,
    Table,
} from 'lucide-react';
import type { Command } from '../SlashCommand';
import type { TranslationKey } from '@/i18n/messages';

export const SLASH_TRIGGER_SUFFIXES = ['', ' ', '/'];

export const MAX_TABLE_ROWS = 9;
export const MAX_TABLE_COLS = 9;

export const createSlashCommands = (
    isTitle: boolean,
    t: (key: TranslationKey) => string
): Command[] => [
    ...(isTitle
        ? [
              {
                  id: 'emojis',
                  name: t('emojis'),
                  icon: Smile,
                  group: 'insert' as const,
                  keywords: ['emoji', 'emoticon'],
              },
          ]
        : [
              {
                  id: 'paragraph',
                  name: t('paragraph'),
                  icon: Pilcrow,
                  group: 'basic' as const,
                  keywords: ['text', 'plain'],
              },
              {
                  id: 'heading-1',
                  name: t('heading1'),
                  icon: Heading1,
                  group: 'basic' as const,
                  keywords: ['h1', 'title'],
              },
              {
                  id: 'heading-2',
                  name: t('heading2'),
                  icon: Heading2,
                  group: 'basic' as const,
                  keywords: ['h2', 'subtitle'],
              },
              {
                  id: 'heading-3',
                  name: t('heading3'),
                  icon: Heading3,
                  group: 'basic' as const,
                  keywords: ['h3', 'subtitle'],
              },
              {
                  id: 'heading-4',
                  name: t('heading4'),
                  icon: Heading4,
                  group: 'basic' as const,
                  keywords: ['h4'],
              },
              {
                  id: 'heading-5',
                  name: t('heading5'),
                  icon: Heading5,
                  group: 'basic' as const,
                  keywords: ['h5'],
              },
              {
                  id: 'heading-6',
                  name: t('heading6'),
                  icon: Heading6,
                  group: 'basic' as const,
                  keywords: ['h6'],
              },
              {
                  id: 'bullet-list',
                  name: t('bulletList'),
                  icon: List,
                  group: 'basic' as const,
                  keywords: ['unordered', 'ul'],
              },
              {
                  id: 'ordered-list',
                  name: t('orderedList'),
                  icon: ListOrdered,
                  group: 'basic' as const,
                  keywords: ['numbered', 'ol'],
              },
              {
                  id: 'blockquote',
                  name: t('blockquote'),
                  icon: Quote,
                  group: 'basic' as const,
                  keywords: ['quote', 'citation'],
              },
              {
                  id: 'code-block',
                  name: t('codeBlock'),
                  icon: Code2,
                  group: 'basic' as const,
                  keywords: ['code', 'pre'],
              },
              {
                  id: 'upload-file',
                  name: t('uploadFile'),
                  icon: Paperclip,
                  group: 'insert' as const,
                  keywords: ['attachment', 'file'],
              },
              {
                  id: 'insert-table',
                  name: t('insertTable'),
                  icon: Table,
                  group: 'insert' as const,
                  keywords: ['grid', 'table'],
              },
              {
                  id: 'insert-separator',
                  name: t('insertSeparator'),
                  icon: Minus,
                  group: 'insert' as const,
                  keywords: ['divider', 'horizontal rule', 'hr'],
              },
              {
                  id: 'emojis',
                  name: t('emojis'),
                  icon: Smile,
                  group: 'insert' as const,
                  keywords: ['emoji', 'emoticon'],
              },
          ]),
];

const normalizeSearchText = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .toLocaleLowerCase()
        .trim();

export const filterSlashCommands = (commands: Command[], query: string) => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return commands;

    const tokens = normalizedQuery.split(/\s+/);
    return commands.filter((command) => {
        const searchText = normalizeSearchText(
            [command.name, command.id, ...(command.keywords ?? [])].join(' ')
        );
        return tokens.every((token) => searchText.includes(token));
    });
};

import { Minus, Paperclip, Smile, Table } from 'lucide-react';
import type { Command } from '../SlashCommand';
import type { TranslationKey } from '@/i18n/messages';

export const SLASH_MENU_KEYS = ['/', 'Escape', 'ArrowUp', 'ArrowDown', 'Enter'];

export const SLASH_TRIGGER_SUFFIXES = ['', ' ', '/'];

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
              },
          ]
        : [
              {
                  id: 'upload-file',
                  name: t('uploadFile'),
                  icon: Paperclip,
              },
              {
                  id: 'insert-table',
                  name: t('insertTable'),
                  icon: Table,
              },
              {
                  id: 'insert-separator',
                  name: t('insertSeparator'),
                  icon: Minus,
              },
              {
                  id: 'emojis',
                  name: t('emojis'),
                  icon: Smile,
              },
          ]),
];

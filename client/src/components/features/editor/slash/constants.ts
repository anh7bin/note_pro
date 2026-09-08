import { Minus, Paperclip, Smile, Table } from 'lucide-react';
import type { Command } from '../SlashCommand';

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export const SLASH_MENU_KEYS = ['/', 'Escape', 'ArrowUp', 'ArrowDown', 'Enter'];

export const SLASH_TRIGGER_SUFFIXES = ['', ' ', '/'];

export const createSlashCommands = (isTitle: boolean): Command[] => [
    ...(isTitle
        ? [
              {
                  id: 'emojis',
                  name: 'Emojis',
                  icon: Smile,
              },
          ]
        : [
              {
                  id: 'upload-file',
                  name: 'Upload file',
                  icon: Paperclip,
              },
              {
                  id: 'insert-table',
                  name: 'Insert Table',
                  icon: Table,
              },
              {
                  id: 'insert-separator',
                  name: 'Insert Separator',
                  icon: Minus,
              },
              {
                  id: 'emojis',
                  name: 'Emojis',
                  icon: Smile,
              },
          ]),
];

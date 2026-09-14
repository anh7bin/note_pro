import type { en } from './en';

export type TranslationKey = keyof typeof en;
export type Messages = Record<TranslationKey, string>;

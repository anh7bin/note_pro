import type { Block } from '@/types/editor';

export type SectionItem = {
    id: string;
    title: string;
    level?: number; // 1 for h1, 2 for h2, 3 for h3
};

export type SidebarTask = {
    blockId: string;
    task: NonNullable<Block['tasks']>[0];
    title: string;
};

export type SidebarAttachment = {
    id: string;
    blockId: string;
    name: string;
    type: string;
    size: string | null;
    url: string | null;
    uploadedAt: string | null;
};

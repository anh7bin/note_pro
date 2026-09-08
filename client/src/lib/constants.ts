import { ROUTES } from '@/lib/routes';
import { HexColor } from '@/types/types';
import { createElement } from 'react';
import { CalendarDays, CircleCheckBig, FileText, Plus } from 'lucide-react';

// Authentication constants
export const AUTHENTICATED = 'authenticated';
export const UNAUTHENTICATED = 'unauthenticated';

// Layout constants
export const HEADER_HEIGHT = 48;
export const SIDEBAR_WIDTH = 288;

// API constants
export const LIMIT = 10;
export const DEFAULT_PAGE_SIZE = 20;

// Cache constants
export const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
export const STALE_TIME = 2 * 60 * 1000; // 2 minutes

// UI constants
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;

// Page titles
export const PAGE_TITLES: Record<string, string> = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.LOGIN]: 'Login',
};

// Modal types for sidebar actions
export enum ModalType {
    TASK = 'task',
    DOCUMENT = 'document',
    FOLDER = 'folder',
}

// Navigation menu items
export const MENU_ITEMS = (
    workspaceSlug: string,
    counts: { allDocs: number | undefined }
) => [
    {
        icon: FileText,
        label: 'All Docs',
        href: ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug),
        count: counts.allDocs,
    },
    {
        icon: CircleCheckBig,
        label: 'Tasks',
        href: ROUTES.WORKSPACE_TASKS(workspaceSlug),
        action: createElement(Plus, { className: 'h-4 w-4 cursor-pointer' }),
        modalType: ModalType.TASK,
    },
    {
        icon: CalendarDays,
        label: 'Calendar',
        href: ROUTES.WORKSPACE_CALENDAR(workspaceSlug),
    },
];

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
];

// Validation constants
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

const VIBRANT_COLORS = [
    { name: 'Charcoal', color: '#1c1c1e', value: '#1c1c1e' },
    { name: 'Graphite', color: '#636366', value: '#636366' },
    { name: 'Silver', color: '#d1d1d6', value: '#d1d1d6' },
    { name: 'Azure', color: '#007aff', value: '#007aff' },
    { name: 'Teal', color: '#00c7be', value: '#00c7be' },
    { name: 'Sky', color: '#5ac8fa', value: '#5ac8fa' },
    { name: 'Emerald', color: '#30d158', value: '#30d158' },
    { name: 'Lime', color: '#87e05f', value: '#87e05f' },
    { name: 'Grape', color: '#af52de', value: '#af52de' },
    { name: 'Fuchsia', color: '#ff2d55', value: '#ff2d55' },
    { name: 'Tangerine', color: '#ff9500', value: '#ff9500' },
    { name: 'Gold', color: '#ffcc00', value: '#ffcc00' },
];

export const FOLDER_COLORS = [...VIBRANT_COLORS];

export const HIGHLIGHT_COLORS = [
    { name: 'None', color: HexColor.TRANSPARENT, value: null },
    ...VIBRANT_COLORS,
];

export const TASK_STATUS = {
    TODO: 'todo',
    COMPLETED: 'completed',
};

export const DEFAULT_WORKSPACE_IMAGE = '/images/workspace-default.jpeg';
export const IMAGE_EXTENSIONS = new Set([
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'avif',
    'heif',
    'heic',
    'bmp',
    'svg',
]);

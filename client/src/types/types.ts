export type IconComponent = React.ComponentType<{ className?: string }>;

export enum HexColor {
    BLACK = '#1c1c1e',
    WHITE = '#ffffff',
    YELLOW = '#fef08a',
    GREEN = '#bbf7d0',
    SKY = '#7dd3fc',
    BLUE = '#93c5fd',
    PURPLE = '#c4b5fd',
    PINK = '#f9a8d4',
    ROSE = '#fda4af',
    ORANGE = '#fed7aa',
    GRAY = '#d1d5db',
    DARK_BLUE = '#3b82f6',
    DARK_PURPLE = '#8b5cf6',
    DARK_PINK = '#ec4899',
    DARK_ORANGE = '#f97316',
    BROWN = '#a3744a',
    TRANSPARENT = 'transparent',
}

export enum BlockType {
    PARAGRAPH = 'paragraph',
    PAGE = 'page',
    TASK = 'task',
    FILE = 'file',
    TABLE = 'table',
    SEPARATOR = 'separator',
}

export enum AccessRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum PermissionType {
    READ = 'read',
    WRITE = 'write',
    OWNER = 'owner',
}

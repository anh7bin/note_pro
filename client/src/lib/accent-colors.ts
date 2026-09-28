export const ACCENT_COLORS = [
    'blue',
    'pink',
    'teal',
    'purple',
    'yellow',
    'gray',
] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

export const DEFAULT_ACCENT_COLOR: AccentColor = 'teal';

export function getAccentColor(value: unknown): AccentColor {
    return ACCENT_COLORS.includes(value as AccentColor)
        ? (value as AccentColor)
        : DEFAULT_ACCENT_COLOR;
}

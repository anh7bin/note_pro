import { format, formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Decode JWT token and extract user ID from Hasura claims
 */
export function getUserIdFromToken(token: string): string | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2 || !parts[1]) return null;
        const payload = JSON.parse(atob(parts[1]));
        return (
            payload['https://hasura.io/jwt/claims']?.['x-hasura-user-id'] ||
            null
        );
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

/**
 * @param date string | Date
 * @param options { relative?: boolean }
 * @returns string
 */
export function formatDate(
    date: string | Date = 'Unknown',
    options: { relative?: boolean } = {}
) {
    if (!date || date === 'Unknown') return 'Unknown';

    // Parse the date - browser will automatically convert to user's local timezone
    const parsed = typeof date === 'string' ? new Date(date) : date;

    if (options.relative) {
        return formatDistanceToNow(parsed, { addSuffix: true });
    }

    return format(parsed, 'MMM d, yyyy');
}
export function stripHtmlTags(html: string | undefined | null): string {
    if (!html) return 'Untitled Document';
    const text = html.replace(/<[^>]*>/g, '');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value || 'Untitled Document';
}

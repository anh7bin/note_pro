import { format, formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Locale } from '@/i18n/config';

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
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            '='
        );
        const payload = JSON.parse(atob(paddedBase64));
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
    options: { relative?: boolean; locale?: Locale } = {}
) {
    if (!date || date === 'Unknown') return 'Unknown';

    // Parse the date - browser will automatically convert to user's local timezone
    const parsed = typeof date === 'string' ? new Date(date) : date;

    if (options.relative) {
        return formatDistanceToNow(parsed, {
            addSuffix: true,
            locale: options.locale === 'vi' ? vi : enUS,
        });
    }

    return format(parsed, 'MMM d, yyyy', {
        locale: options.locale === 'vi' ? vi : enUS,
    });
}
export function stripHtmlTags(html: string | undefined | null): string {
    if (!html) return 'Untitled Document';
    const text = html.replace(/<[^>]*>/g, '');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value || 'Untitled Document';
}

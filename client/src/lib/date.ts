import { Locale } from '@/i18n/config';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

export function formatDate(
    date: string | Date = 'Unknown',
    options: { relative?: boolean; locale?: Locale } = {}
) {
    if (!date || date === 'Unknown') return 'Unknown';

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

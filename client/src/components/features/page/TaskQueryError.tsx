'use client';

import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';

export function TaskQueryError({ retry }: { retry: () => void }) {
    const { t } = useI18n();
    return (
        <div
            role="alert"
            className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-destructive">{t('tasksLoadError')}</p>
            <Button variant="outline" size="sm" onClick={retry}>
                {t('retry')}
            </Button>
        </div>
    );
}

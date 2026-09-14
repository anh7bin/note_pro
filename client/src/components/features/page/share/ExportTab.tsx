'use client';

import { EmptyState } from '@/components/shared';
import { FileOutput } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export function ExportTab() {
    const { t } = useI18n();

    return (
        <div className="py-4">
            <EmptyState
                compact
                icon={<FileOutput />}
                title={t('exportComingSoon')}
                description={t('exportComingSoonDescription')}
            />
        </div>
    );
}

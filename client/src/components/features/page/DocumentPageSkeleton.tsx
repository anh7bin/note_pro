'use client';

import { PageContent, PageHeader, PageShell } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/contexts/I18nContext';

const CARD_SKELETONS = [
    'hidden xl:flex',
    'hidden lg:flex',
    'hidden sm:flex',
    'flex',
    'flex',
];

export function DocumentPageSkeleton() {
    const { t } = useI18n();

    return (
        <PageShell role="status" aria-busy="true">
            <span className="sr-only">{t('loadingDocuments')}</span>
            <PageHeader>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-6 w-px rounded-none" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </PageHeader>

            <PageContent className="grid auto-rows-[304px] grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {CARD_SKELETONS.map((visibility, index) => (
                    <div
                        key={index}
                        className={`${visibility} h-[304px] flex-col overflow-hidden rounded-lg border border-border-subtle bg-card`}>
                        <Skeleton className="h-44 w-full shrink-0 rounded-none" />
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                            <div className="mt-auto flex items-center justify-between">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-7 w-7 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </PageContent>
        </PageShell>
    );
}

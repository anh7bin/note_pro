'use client';

import { PageContent, PageHeader, PageShell } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/contexts/I18nContext';
import type { DocumentView } from '@/hooks/useDocumentView';

const CARD_SKELETON_COUNT = 30;
const LIST_SKELETON_COUNT = 20;

function DocumentCardSkeleton({ index }: { index: number }) {
    const visibility =
        index < 5
            ? 'flex'
            : index < 10
              ? 'hidden sm:flex'
              : index < 18
                ? 'hidden lg:flex'
                : index < 24
                  ? 'hidden xl:flex'
                  : 'hidden 2xl:flex';

    return (
        <div
            className={`${visibility} h-[304px] flex-col overflow-hidden rounded-lg border border-border-subtle bg-card`}>
            <div className="shrink-0 space-y-2 p-4 pb-3">
                <Skeleton
                    className={index % 3 === 0 ? 'h-4 w-2/3' : 'h-4 w-1/2'}
                />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-px w-full rounded-none" />
            </div>
            <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-2/3" />
                {index % 2 === 0 && (
                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                )}
            </div>
        </div>
    );
}

function DocumentListSkeleton({ index }: { index: number }) {
    return (
        <div className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_64px] items-center rounded-lg border border-border bg-surface px-5 py-2.5 sm:grid-cols-[minmax(0,1fr)_132px_116px_64px]">
            <div className="flex min-w-0 items-center gap-3 pr-4">
                <Skeleton className="h-12 w-9 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton
                        className={index % 3 === 0 ? 'h-4 w-2/5' : 'h-4 w-1/3'}
                    />
                    <Skeleton className="h-3 w-3/5" />
                </div>
            </div>
            <Skeleton className="hidden h-3 w-20 sm:block" />
            <Skeleton className="hidden h-3 w-20 sm:block" />
            <div className="flex justify-end">
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
        </div>
    );
}

export function DocumentGridSkeleton({ view }: { view: DocumentView }) {
    if (view === 'list') {
        return (
            <div
                aria-hidden="true"
                className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
                {Array.from({ length: LIST_SKELETON_COUNT }, (_, index) => (
                    <DocumentListSkeleton key={index} index={index} />
                ))}
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className="grid h-full min-h-0 auto-rows-[304px] grid-cols-1 content-start gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: CARD_SKELETON_COUNT }, (_, index) => (
                <DocumentCardSkeleton key={index} index={index} />
            ))}
        </div>
    );
}

export function DocumentPageSkeleton({ view }: { view: DocumentView }) {
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

            <PageContent>
                <DocumentGridSkeleton view={view} />
            </PageContent>
        </PageShell>
    );
}

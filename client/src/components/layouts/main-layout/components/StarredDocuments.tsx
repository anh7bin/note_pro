'use client';

import { useId, useState } from 'react';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useGetStarredDocumentsQuery } from '@/graphql/__generated__/document-star.generated';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { StarDocumentPicker } from './StarDocumentPicker';
import { StarredDocumentItem } from './StarredDocumentItem';

export function StarredDocuments() {
    const { t } = useI18n();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const listId = useId();
    const { data, loading } = useGetStarredDocumentsQuery({
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });
    const stars = data?.document_stars ?? [];

    return (
        <section className="flex min-h-0 flex-col gap-1">
            <div className="flex min-h-8 items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('starred')}
                </span>
                <div className="flex items-center gap-1">
                    <StarDocumentPicker
                        onDocumentStarred={() => setIsCollapsed(false)}
                    />
                    <SimpleTooltip
                        title={isCollapsed ? t('expand') : t('collapse')}>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setIsCollapsed((value) => !value)}>
                            <ChevronRight
                                className={cn(
                                    'transition-transform duration-200',
                                    isCollapsed ? 'rotate-0' : 'rotate-90'
                                )}
                            />
                        </Button>
                    </SimpleTooltip>
                </div>
            </div>
            {!isCollapsed && (
                <div
                    id={listId}
                    className="max-h-44 overflow-y-auto overscroll-contain">
                    {!loading && stars.length === 0 ? (
                        <p className="px-1 py-1.5 text-xs italic leading-5 text-muted-foreground/70">
                            {t('starredEmptyDescription')}
                        </p>
                    ) : (
                        stars.map(({ document }) => {
                            return (
                                <StarredDocumentItem
                                    key={document.id}
                                    document={document}
                                />
                            );
                        })
                    )}
                </div>
            )}
        </section>
    );
}

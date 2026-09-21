'use client';

import { useId, useState } from 'react';
import { SidebarButton } from '@/components/layouts/main-layout/components/SidebarButton';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useGetStarredDocumentsQuery } from '@/graphql/__generated__/document-star.generated';
import { ROUTES } from '@/lib/routes';
import { getPlainText } from '@/lib/text';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText } from 'lucide-react';
import { StarDocumentPicker } from './StarDocumentPicker';

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
        <section
            aria-label={t('starred')}
            className="flex min-h-0 flex-col gap-1">
            <div className="flex min-h-8 items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('starred')}
                </span>
                <div className="flex items-center gap-1">
                    <StarDocumentPicker
                        onDocumentStarred={() => setIsCollapsed(false)}
                    />
                    <SimpleTooltip
                        title={
                            isCollapsed
                                ? t('expandStarred')
                                : t('collapseStarred')
                        }>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={
                                isCollapsed
                                    ? t('expandStarred')
                                    : t('collapseStarred')
                            }
                            aria-expanded={!isCollapsed}
                            aria-controls={listId}
                            onClick={() => setIsCollapsed((value) => !value)}>
                            <ChevronRight
                                aria-hidden="true"
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
                            if (!document.workspace_id) return null;

                            const title =
                                getPlainText(document.content?.title) ||
                                t('untitledPage');
                            const icon = document.content?.icon;
                            const href = document.folder?.id
                                ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                                      document.workspace_id,
                                      document.folder.id,
                                      document.id
                                  )
                                : ROUTES.WORKSPACE_DOCUMENT(
                                      document.workspace_id,
                                      document.id
                                  );

                            return (
                                <SidebarButton
                                    key={document.id}
                                    icon={
                                        typeof icon === 'string' &&
                                        icon.trim() ? (
                                            <span
                                                aria-hidden="true"
                                                className="text-sm">
                                                {icon}
                                            </span>
                                        ) : (
                                            <FileText
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        )
                                    }
                                    label={title}
                                    href={href}
                                />
                            );
                        })
                    )}
                </div>
            )}
        </section>
    );
}

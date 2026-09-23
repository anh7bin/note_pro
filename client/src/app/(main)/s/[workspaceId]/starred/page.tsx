'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { StarDocumentPicker } from '@/components/layouts/main-layout/components/StarDocumentPicker';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { PageLoading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useGetStarredDocumentsPageQuery } from '@/graphql/__generated__/document-star.generated';
import { useDocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { Star } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function StarredPage() {
    const { t } = useI18n();
    const { view, changeView } = useDocumentView();
    const { clearSelection, setMode } = useDocumentSelection();
    const { data, loading } = useGetStarredDocumentsPageQuery({
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });
    const documents: Document[] = useMemo(
        () => data?.document_stars.map(({ document }) => document) ?? [],
        [data?.document_stars]
    );

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [clearSelection, setMode]);

    if (loading && documents.length === 0) return <PageLoading />;

    return (
        <PageShell>
            <PageHeader>
                <div className="flex items-center gap-2">
                    <StarDocumentPicker
                        variant="outline"
                        size="icon-sm"
                        placement="page"
                    />
                    <Separator orientation="vertical" />
                    <PageTitle>{t('starred')}</PageTitle>
                </div>
                {documents.length > 0 && (
                    <div className="flex items-center gap-2">
                        <SelectionActionBar
                            documentIds={documents.map(
                                (document) => document.id
                            )}
                        />
                        <DocumentViewToggle view={view} onChange={changeView} />
                    </div>
                )}
            </PageHeader>
            <PageContent>
                {documents.length > 0 ? (
                    <DocumentGrid documents={documents} view={view} />
                ) : (
                    <EmptyState
                        icon={<Star />}
                        title={t('starred')}
                        description={t('starredEmptyDescription')}
                    />
                )}
            </PageContent>
        </PageShell>
    );
}

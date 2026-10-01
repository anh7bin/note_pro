'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { DocumentPageSkeleton } from '@/components/features/page/DocumentPageSkeleton';
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

    const { documents, documentIds } = useMemo(() => {
        const docs = (data?.document_stars ?? [])
            .map((star) => star.document)
            .filter(Boolean) as Document[];

        return { documents: docs, documentIds: docs.map((doc) => doc.id) };
    }, [data?.document_stars]);

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [clearSelection, setMode]);

    return loading && documents.length === 0 ? (
        <DocumentPageSkeleton view={view} />
    ) : (
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
                        <SelectionActionBar documentIds={documentIds} />
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

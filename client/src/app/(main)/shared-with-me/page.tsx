'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { DocumentPageSkeleton } from '@/components/features/page/DocumentPageSkeleton';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useGetSharedWithMeDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { Users } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function SharedWithMePage() {
    const { t } = useI18n();
    const userId = useUserId();
    const { view, changeView } = useDocumentView();
    const { setMode, clearSelection } = useDocumentSelection();

    const { loading, data } = useGetSharedWithMeDocsQuery({
        variables: { userId },
        skip: !userId,
        fetchPolicy: 'cache-and-network',
        pollInterval: 5000,
    });

    const sharedDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

    const documentIds = useMemo(
        () => sharedDocs.map((document) => document.id),
        [sharedDocs]
    );

    useEffect(() => {
        clearSelection();
        setMode('shared');
    }, [clearSelection, setMode]);

    return loading && sharedDocs.length === 0 ? (
        <DocumentPageSkeleton view={view} />
    ) : (
        <PageShell>
            <PageHeader>
                <PageTitle>{t('sharedWithMe')}</PageTitle>
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <SelectionActionBar documentIds={documentIds} />
                    <DocumentViewToggle view={view} onChange={changeView} />
                </div>
            </PageHeader>

            <PageContent>
                {sharedDocs.length > 0 ? (
                    <DocumentGrid documents={sharedDocs} view={view} />
                ) : (
                    <EmptyState
                        icon={<Users />}
                        title={t('noSharedDocuments')}
                        description={t('noSharedDocumentsDescription')}
                    />
                )}
            </PageContent>
        </PageShell>
    );
}

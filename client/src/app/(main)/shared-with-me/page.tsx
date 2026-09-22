'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { PageLoading } from '@/components/ui/loading';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useGetSharedWithMeDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { useMemo, useEffect } from 'react';
import { Users } from 'lucide-react';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { useI18n } from '@/contexts/I18nContext';

export default function SharedWithMePage() {
    const userId = useUserId();
    const { setMode, clearSelection } = useDocumentSelection();
    const { t } = useI18n();
    const { view, changeView } = useDocumentView();

    const { loading, data } = useGetSharedWithMeDocsQuery({
        variables: { userId: userId || '' },
        skip: !userId,
        fetchPolicy: 'cache-and-network',
        pollInterval: 5000,
    });

    const sharedDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

    useEffect(() => {
        clearSelection();
        setMode('shared');
    }, [clearSelection, setMode]);

    return loading && sharedDocs.length === 0 ? (
        <PageLoading />
    ) : (
        <PageShell>
            <PageHeader>
                <PageTitle>{t('sharedWithMe')}</PageTitle>
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <SelectionActionBar
                        mode="shared"
                        documentIds={sharedDocs.map((document) => document.id)}
                    />
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

'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { PageLoading } from '@/components/ui/loading';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useGetSharedWithMeDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { Document } from '@/types/app';
import { pluralize } from '@/lib/bulk-actions';
import { useMemo, useEffect } from 'react';
import { Users } from 'lucide-react';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';

export default function SharedWithMePage() {
    const userId = useUserId();
    const { setMode, clearSelection } = useDocumentSelection();

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
                <PageTitle>Shared With Me</PageTitle>
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <SelectionActionBar mode="shared" />
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {sharedDocs.length}{' '}
                        {pluralize(sharedDocs.length, 'document')}
                    </span>
                </div>
            </PageHeader>

            <PageContent>
                {sharedDocs.length > 0 ? (
                    <DocumentGrid documents={sharedDocs} />
                ) : (
                    <EmptyState
                        icon={<Users />}
                        title="No shared documents"
                        description="Documents other people share with you will appear here."
                    />
                )}
            </PageContent>
        </PageShell>
    );
}

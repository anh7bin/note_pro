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
import { FiUsers } from 'react-icons/fi';
import { IoShareOutline } from 'react-icons/io5';

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
        <div className="p-0 w-full h-full">
            <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
                <div className="w-full pt-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IoShareOutline className="w-6 h-6 text-muted-foreground" />
                        <h1 className="text-xl font-medium">Shared With Me</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <SelectionActionBar mode="shared" />
                        <span className="text-sm text-muted-foreground">
                            {sharedDocs.length}{' '}
                            {pluralize(sharedDocs.length, 'document')}
                        </span>
                    </div>
                </div>

                {sharedDocs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                        <FiUsers className="w-16 h-16 text-muted-foreground/40" />
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                No shared documents yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Documents shared with you will appear here
                            </p>
                        </div>
                    </div>
                ) : (
                    <DocumentGrid documents={sharedDocs} />
                )}
            </div>
        </div>
    );
}

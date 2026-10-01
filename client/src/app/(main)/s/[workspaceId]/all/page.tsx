'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { DocumentPageSkeleton } from '@/components/features/page/DocumentPageSkeleton';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useGetAllDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useCreateDocument } from '@/hooks';
import { useDocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { FilePlus2, Files, Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';

const EMPTY_DOCS: Document[] = [];

export default function AllDocsPage() {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();
    const { view, changeView } = useDocumentView();
    const { clearSelection, setMode } = useDocumentSelection();
    const { createNewDocument, isCreating, canCreate } = useCreateDocument();

    const { loading, data } = useGetAllDocsQuery({
        variables: { workspaceId: workspaceId ?? '' },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const allDocs = (data?.blocks ?? EMPTY_DOCS) as Document[];
    const documentIds = useMemo(() => allDocs.map((doc) => doc.id), [allDocs]);

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [clearSelection, setMode]);

    const createDisabled = !canCreate || isCreating;
    const isInitialLoading = loading && allDocs.length === 0;

    return isInitialLoading ? (
        <DocumentPageSkeleton view={view} />
    ) : (
        <PageShell data-tour="documents-page">
            <PageHeader>
                <div className="flex items-center gap-2">
                    <SimpleTooltip title={t('createDocument')}>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={createNewDocument}
                            disabled={createDisabled}>
                            <Plus />
                        </Button>
                    </SimpleTooltip>
                    <Separator orientation="vertical" />
                    <PageTitle data-tour="documents-heading">
                        {t('allDocs')}
                    </PageTitle>
                </div>
                <div className="flex items-center gap-2">
                    <SelectionActionBar documentIds={documentIds} />
                    <DocumentViewToggle view={view} onChange={changeView} />
                </div>
            </PageHeader>

            <PageContent>
                {allDocs.length > 0 ? (
                    <DocumentGrid documents={allDocs} view={view} />
                ) : (
                    <EmptyState
                        icon={<Files />}
                        title={t('noDocuments')}
                        description={t('noDocumentsDescription')}
                        action={
                            <Button
                                size="sm"
                                onClick={createNewDocument}
                                disabled={createDisabled}>
                                <FilePlus2 />
                                {t('createDocument')}
                            </Button>
                        }
                    />
                )}
            </PageContent>
        </PageShell>
    );
}

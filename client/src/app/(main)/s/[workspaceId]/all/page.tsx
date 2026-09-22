'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useGetAllDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useCreateDocument, useWorkspace } from '@/hooks';
import { useDocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { FilePlus2, Files, Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function AllDocsPage() {
    const { workspace } = useWorkspace();
    const { createNewDocument, isCreating, canCreate } = useCreateDocument();
    const { clearSelection, setMode } = useDocumentSelection();
    const { t } = useI18n();
    const { view, changeView } = useDocumentView();

    const { loading, data } = useGetAllDocsQuery({
        variables: { workspaceId: workspace?.id || '' },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const allDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [clearSelection, setMode]);

    return loading && allDocs.length === 0 ? (
        <PageLoading />
    ) : (
        <PageShell data-tour="documents-page">
            <PageHeader>
                <div className="flex items-center gap-2">
                    <SimpleTooltip title={t('createDocument')}>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={createNewDocument}
                            disabled={!canCreate || isCreating}
                            aria-label={
                                isCreating
                                    ? t('creatingDocument')
                                    : t('createDocument')
                            }
                            aria-busy={isCreating}>
                            <Plus />
                        </Button>
                    </SimpleTooltip>
                    <Separator orientation="vertical" />
                    <PageTitle data-tour="documents-heading">
                        {t('allDocs')}
                    </PageTitle>
                </div>
                <div className="flex items-center gap-2">
                    <SelectionActionBar
                        documentIds={allDocs.map((document) => document.id)}
                    />
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
                                disabled={!canCreate || isCreating}>
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

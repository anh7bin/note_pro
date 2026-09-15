'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
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
import { PageLoading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useGetAllDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useCreateDocument, useWorkspace } from '@/hooks';
import { Document } from '@/types/app';
import { FilePlus2, Files, Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function AllDocsPage() {
    const { workspace } = useWorkspace();
    const { createNewDocument, isCreating, canCreate } = useCreateDocument();
    const { clearSelection, setMode } = useDocumentSelection();
    const { t } = useI18n();

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
                <SelectionActionBar
                    documentIds={allDocs.map((document) => document.id)}
                />
            </PageHeader>

            <PageContent>
                {allDocs.length > 0 ? (
                    <DocumentGrid documents={allDocs} />
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

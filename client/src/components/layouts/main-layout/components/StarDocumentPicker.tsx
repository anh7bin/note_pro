'use client';

import { useMemo, useState } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import {
    GetDocumentsToStarDocument,
    GetStarredDocumentsDocument,
    useGetDocumentsToStarQuery,
    useStarDocumentMutation,
} from '@/graphql/__generated__/document-star.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getPlainText } from '@/lib/text';
import showToast from '@/lib/toast';

interface StarDocumentPickerProps {
    onDocumentStarred: () => void;
}

export function StarDocumentPicker({
    onDocumentStarred,
}: StarDocumentPickerProps) {
    const { t } = useI18n();
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(
        null
    );
    const { data, loading } = useGetDocumentsToStarQuery({
        variables: {
            workspaceId: workspace?.id || '',
            userId: userId || '',
        },
        skip: !isOpen || !workspace?.id || !userId,
        fetchPolicy: 'cache-and-network',
    });
    const [starDocument] = useStarDocumentMutation();

    const availableDocuments = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

        return (data?.blocks ?? []).filter((document) => {
            if (document.document_stars.length > 0) return false;
            if (!normalizedSearch) return true;

            const title =
                getPlainText(document.content?.title) || t('untitledPage');
            return title.toLocaleLowerCase().includes(normalizedSearch);
        });
    }, [data?.blocks, searchTerm, t]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) setSearchTerm('');
    };

    const handleStarDocument = async (documentId: string) => {
        if (activeDocumentId) return;

        setActiveDocumentId(documentId);
        try {
            await starDocument({
                variables: { documentId },
                update: (cache) => {
                    cache.modify({
                        id: cache.identify({
                            __typename: 'blocks',
                            id: documentId,
                        }),
                        fields: {
                            document_stars() {
                                return [
                                    {
                                        __typename: 'document_stars',
                                        document_id: documentId,
                                    },
                                ];
                            },
                        },
                    });
                },
                refetchQueries: [
                    GetStarredDocumentsDocument,
                    GetDocumentsToStarDocument,
                ],
                awaitRefetchQueries: true,
            });
            onDocumentStarred();
            handleOpenChange(false);
        } catch (error) {
            console.error('Failed to star document from picker:', error);
            showToast.error(t('starDocumentError'));
        } finally {
            setActiveDocumentId(null);
        }
    };

    return (
        <PopoverPanel
            open={isOpen}
            onOpenChange={handleOpenChange}
            contentProps={{
                side: 'right',
                align: 'start',
                sideOffset: 8,
                collisionPadding: 12,
                className:
                    'w-72 max-w-[calc(100vw-1.5rem)] overflow-hidden p-0',
            }}
            trigger={
                <Button
                    variant="ghost"
                    size="icon-xs"
                    title={t('starADocument')}>
                    <Plus />
                </Button>
            }>
            <div className="p-3">
                <InputField
                    autoFocus
                    type="search"
                    placeholder={t('searchDocumentsToStar')}
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="h-8"
                    icon={<Search />}
                />
            </div>
            <div
                className="max-h-72 overflow-x-hidden overflow-y-auto overscroll-contain pb-1"
                onWheel={(event) => event.stopPropagation()}>
                {loading && !data ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                        {t('loadingDocuments')}
                    </div>
                ) : availableDocuments.length === 0 ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                        {searchTerm.trim()
                            ? t('noDocumentsFound')
                            : t('noDocumentsToStar')}
                    </div>
                ) : (
                    availableDocuments.map((document) => {
                        const title =
                            getPlainText(document.content?.title) ||
                            t('untitledPage');
                        const icon = document.content?.icon;

                        return (
                            <button
                                type="button"
                                key={document.id}
                                disabled={Boolean(activeDocumentId)}
                                className="flex min-h-11 w-full min-w-0 items-center gap-2 overflow-hidden px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() =>
                                    void handleStarDocument(document.id)
                                }>
                                {typeof icon === 'string' && icon.trim() ? (
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm">
                                        {icon}
                                    </span>
                                ) : (
                                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                )}
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium">
                                        {title}
                                    </span>
                                    {document.folder?.name && (
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {t('inFolder', {
                                                folder: document.folder.name,
                                            })}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </PopoverPanel>
    );
}

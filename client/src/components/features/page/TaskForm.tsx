'use client';

import {
    useId,
    useMemo,
    useState,
    type ReactNode,
    type RefObject,
} from 'react';
import { ChevronDown, Flag, Inbox, Search } from 'lucide-react';
import { NewDocumentIcon } from '@/components/shared/icons/NewDocumentIcon';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
import { PopoverPanel } from '@/components/ui/popover-panel';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useI18n } from '@/contexts/I18nContext';
import { useGetAllDocsLazyQuery } from '@/graphql/queries/__generated__/document.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getPlainText } from '@/lib/text';

export interface TaskFormValues {
    title: string;
    scheduleDate: string;
    deadlineDate: string;
    priority: string;
    destinationId: string | null;
}

export const EMPTY_TASK_FORM: TaskFormValues = {
    title: '',
    scheduleDate: '',
    deadlineDate: '',
    priority: 'none',
    destinationId: null,
};

interface TaskFormProps {
    values: TaskFormValues;
    onChange: <K extends keyof TaskFormValues>(
        field: K,
        value: TaskFormValues[K]
    ) => void;
    onSubmit: () => void;
    dialogContentRef: RefObject<HTMLDivElement | null>;
    destinationFallbackTitle?: string;
    destinationFooter?: ReactNode;
}

export function TaskForm({
    values,
    onChange,
    onSubmit,
    dialogContentRef,
    destinationFallbackTitle,
    destinationFooter,
}: TaskFormProps) {
    const { t } = useI18n();
    const { workspace } = useWorkspace();
    const formId = useId();
    const [searchTerm, setSearchTerm] = useState('');
    const [destinationOpen, setDestinationOpen] = useState(false);
    const [fetchDocs, { data, loading, error }] = useGetAllDocsLazyQuery();

    const filteredDocuments = useMemo(() => {
        const search = searchTerm.trim().toLocaleLowerCase();
        return (data?.blocks || []).filter((doc) =>
            getPlainText(doc.content?.title || t('untitledPage'))
                .toLocaleLowerCase()
                .includes(search)
        );
    }, [data?.blocks, searchTerm, t]);

    const selectedDocument = data?.blocks.find(
        (doc) => doc.id === values.destinationId
    );
    const destinationTitle = values.destinationId
        ? selectedDocument
            ? getPlainText(selectedDocument.content?.title) || t('untitledPage')
            : destinationFallbackTitle || t('untitledPage')
        : t('inbox');

    const handleDestinationOpenChange = (open: boolean) => {
        setDestinationOpen(open);
        if (!open) setSearchTerm('');
        if (open && workspace?.id) {
            void fetchDocs({ variables: { workspaceId: workspace.id } });
        }
    };

    const selectDestination = (id: string | null) => {
        onChange('destinationId', id);
        handleDestinationOpenChange(false);
    };

    return (
        <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
            <div className="space-y-1.5">
                <Label htmlFor={`${formId}-title`}>
                    {t('taskTitle')} <span className="text-destructive">*</span>
                </Label>
                <InputField
                    id={`${formId}-title`}
                    placeholder={t('taskTitlePlaceholder')}
                    value={values.title}
                    onChange={(event) => onChange('title', event.target.value)}
                    onKeyDown={(event) => {
                        if (
                            event.key === 'Enter' &&
                            !event.nativeEvent.isComposing
                        ) {
                            event.preventDefault();
                            onSubmit();
                        }
                    }}
                    autoFocus
                    autoComplete="off"
                    maxLength={500}
                    required
                    className="h-9"
                />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-1.5 [&>button]:h-9 [&>button]:w-full">
                    <Label>{t('scheduleDate')}</Label>
                    <DatePicker
                        value={values.scheduleDate}
                        onChange={(date) => onChange('scheduleDate', date)}
                        placeholder={t('schedule')}
                    />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 [&>button]:h-9 [&>button]:w-full">
                    <Label>{t('deadline')}</Label>
                    <DatePicker
                        value={values.deadlineDate}
                        onChange={(date) => onChange('deadlineDate', date)}
                        placeholder={t('deadline')}
                        icon={<Flag />}
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor={`${formId}-priority`}>{t('priority')}</Label>
                <Select
                    value={values.priority}
                    onValueChange={(value) => onChange('priority', value)}>
                    <SelectTrigger
                        id={`${formId}-priority`}
                        className="h-9 w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">
                            {t('priorityNone')}
                        </SelectItem>
                        <SelectItem value="low">{t('priorityLow')}</SelectItem>
                        <SelectItem value="medium">
                            {t('priorityMedium')}
                        </SelectItem>
                        <SelectItem value="high">
                            {t('priorityHigh')}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor={`${formId}-destination`}>
                    {t('destination')}
                </Label>
                <PopoverPanel
                    open={destinationOpen}
                    onOpenChange={handleDestinationOpenChange}
                    contentProps={{
                        container: dialogContentRef.current ?? undefined,
                        align: 'start',
                        className:
                            'w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-3rem)] overflow-hidden p-0',
                    }}
                    trigger={
                        <Button
                            id={`${formId}-destination`}
                            variant="outline"
                            aria-expanded={destinationOpen}
                            className="h-9 w-full min-w-0 justify-start overflow-hidden text-left font-normal">
                            <Inbox aria-hidden="true" className="shrink-0" />
                            <span className="min-w-0 flex-1 truncate">
                                {destinationTitle}
                            </span>
                            <ChevronDown
                                aria-hidden="true"
                                className="shrink-0"
                            />
                        </Button>
                    }>
                    <div className="p-3">
                        <InputField
                            type="search"
                            aria-label={t('searchDocuments')}
                            placeholder={t('searchDocuments')}
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            icon={<Search aria-hidden="true" />}
                            className="h-9"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto overscroll-contain">
                        <button
                            type="button"
                            className="flex min-h-9 w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            onClick={() => selectDestination(null)}>
                            <Inbox aria-hidden="true" className="h-4 w-4" />
                            {t('inbox')}
                        </button>
                        {loading ? (
                            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                                {t('loadingDocuments')}
                            </p>
                        ) : error ? (
                            <div
                                role="alert"
                                className="space-y-2 px-3 py-4 text-center text-sm text-destructive">
                                <p>{t('documentsLoadError')}</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        if (workspace?.id) {
                                            void fetchDocs({
                                                variables: {
                                                    workspaceId: workspace.id,
                                                },
                                            });
                                        }
                                    }}>
                                    {t('retry')}
                                </Button>
                            </div>
                        ) : filteredDocuments.length ? (
                            filteredDocuments.map((doc) => (
                                <button
                                    type="button"
                                    key={doc.id}
                                    className="flex min-h-9 w-full min-w-0 items-center gap-2 overflow-hidden px-3 py-2 text-left hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                    onClick={() => selectDestination(doc.id)}>
                                    <NewDocumentIcon size={24} />
                                    <span className="min-w-0 flex-1 text-left">
                                        <span className="block truncate text-sm font-medium">
                                            {getPlainText(doc.content?.title) ||
                                                t('untitledPage')}
                                        </span>
                                        {doc.folder && (
                                            <span className="block truncate text-xs text-muted-foreground">
                                                {t('inFolder', {
                                                    folder: doc.folder.name,
                                                })}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p className="px-3 py-3 text-sm text-muted-foreground">
                                {t('noDocumentsFound')}
                            </p>
                        )}
                    </div>
                </PopoverPanel>
                {destinationFooter}
            </div>
        </div>
    );
}

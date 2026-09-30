'use client';

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
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useGetAllDocsLazyQuery } from '@/graphql/queries/__generated__/document.generated';
import { getPlainText } from '@/lib/text';
import { Check, ChevronDown, Flag, Inbox, Search } from 'lucide-react';
import { useId, useMemo, useState, type ReactNode } from 'react';

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
    destinationFallbackTitle?: string;
    destinationFooter?: ReactNode;
}

export function TaskForm({
    values,
    onChange,
    onSubmit,
    destinationFallbackTitle,
    destinationFooter,
}: TaskFormProps) {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();
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

    const loadDocuments = () => {
        if (workspaceId) {
            void fetchDocs({ variables: { workspaceId } });
        }
    };

    const handleDestinationOpenChange = (open: boolean) => {
        setDestinationOpen(open);
        if (!open) setSearchTerm('');
        if (open) loadDocuments();
    };

    const selectDestination = (id: string | null) => {
        onChange('destinationId', id);
        handleDestinationOpenChange(false);
    };

    const isInboxSelected = !values.destinationId;

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
                />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-1.5 [&>button]:w-full">
                    <Label>{t('scheduleDate')}</Label>
                    <DatePicker
                        value={values.scheduleDate}
                        onChange={(date) => onChange('scheduleDate', date)}
                        placeholder={t('schedule')}
                    />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 [&>button]:w-full">
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
                    <SelectTrigger id={`${formId}-priority`}>
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
                        align: 'start',
                        sideOffset: 6,
                        collisionPadding: 12,
                        className:
                            'z-[100] w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-3rem)] overflow-hidden rounded-lg p-0 shadow-lg',
                    }}
                    trigger={
                        <Button
                            id={`${formId}-destination`}
                            variant="outline"
                            size="sm"
                            aria-haspopup="listbox"
                            className="w-full min-w-0 justify-start gap-2 overflow-hidden text-left font-normal">
                            {isInboxSelected ? (
                                <span className={ICON_SLOT}>
                                    <Inbox className="size-4" />
                                </span>
                            ) : (
                                <DocIcon
                                    icon={selectedDocument?.content?.icon}
                                />
                            )}
                            <span className="min-w-0 flex-1 text-sm truncate">
                                {destinationTitle}
                            </span>
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </Button>
                    }>
                    <div className="border-b p-2">
                        <InputField
                            type="search"
                            placeholder={t('searchDocuments')}
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            icon={
                                <Search className="size-4 text-muted-foreground" />
                            }
                            autoComplete="off"
                        />
                    </div>
                    <div
                        role="listbox"
                        aria-label={t('destination')}
                        className="max-h-56 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]"
                        onWheel={(event) => event.stopPropagation()}
                        onTouchMove={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            role="option"
                            aria-selected={isInboxSelected}
                            className={OPTION_CLASS}
                            onClick={() => selectDestination(null)}>
                            <span className={ICON_SLOT}>
                                <Inbox />
                            </span>
                            <span className="min-w-0 flex-1 truncate">
                                {t('inbox')}
                            </span>
                            {isInboxSelected && (
                                <Check className="size-4 shrink-0 text-primary" />
                            )}
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
                                    onClick={loadDocuments}>
                                    {t('retry')}
                                </Button>
                            </div>
                        ) : filteredDocuments.length ? (
                            filteredDocuments.map((doc) => {
                                const selected =
                                    doc.id === values.destinationId;
                                return (
                                    <button
                                        key={doc.id}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        className={OPTION_CLASS}
                                        onClick={() =>
                                            selectDestination(doc.id)
                                        }>
                                        <DocIcon icon={doc.content?.icon} />
                                        <span className="block truncate">
                                            {getPlainText(doc.content?.title) ||
                                                t('untitledPage')}
                                        </span>
                                        {selected && (
                                            <Check className="size-4 shrink-0 text-primary" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
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

const ICON_SLOT = 'flex size-5 shrink-0 items-center justify-center';

const OPTION_CLASS =
    'flex w-full min-w-0 items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring';

function DocIcon({ icon }: { icon: unknown }) {
    const emoji = typeof icon === 'string' ? icon.trim() : '';
    return (
        <span className={ICON_SLOT}>
            {emoji ? (
                <span className="text-sm leading-none">{emoji}</span>
            ) : (
                <NewDocumentIcon size={18} />
            )}
        </span>
    );
}

import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { CardDocumentPreview } from '../CardDocumentPreview';
import { DocumentStarButton } from '../DocumentStarButton';
import { composeHandlers, formatRelative, getListDescription } from './helpers';
import { SelectCheckbox } from './SelectCheckbox';
import { DocumentItemElementProps } from './types';

export const DocumentListItem = React.memo(
    React.forwardRef<HTMLDivElement, DocumentItemElementProps>(
        function DocumentListItem(
            {
                doc,
                title,
                selected,
                selectionActive,
                isTrash,
                isPending,
                isStarred,
                isUpdatingStar,
                onActivate,
                onActivateKeyDown,
                onToggleSelect,
                onToggleStar,
                onPrefetch,
                className,
                ...rest
            },
            ref
        ) {
            const { locale, t } = useI18n();

            const description = useMemo(
                () => getListDescription(doc.sub_blocks, t),
                [doc.sub_blocks, t]
            );
            const isEmpty = description === t('emptyDocument');
            const showStar = !isTrash && !selectionActive && isStarred;

            return (
                <div
                    {...rest}
                    ref={ref}
                    role={selectionActive ? 'button' : 'link'}
                    tabIndex={0}
                    className={cn(
                        'group grid min-h-[76px] cursor-pointer grid-cols-[minmax(0,1fr)_64px] items-center rounded-lg border px-5 py-2.5',
                        'transition-[background-color,border-color,box-shadow] duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                        'sm:grid-cols-[minmax(0,1fr)_132px_116px_64px]',
                        selected
                            ? 'border-primary/60 bg-primary/[0.08] shadow-sm ring-1 ring-primary/15 hover:border-primary/80 hover:bg-primary/[0.12]'
                            : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover hover:shadow-sm',
                        className
                    )}
                    onClick={composeHandlers(rest.onClick, onActivate)}
                    onKeyDown={composeHandlers(
                        rest.onKeyDown,
                        onActivateKeyDown
                    )}
                    onMouseEnter={composeHandlers(
                        rest.onMouseEnter,
                        onPrefetch
                    )}
                    onFocus={composeHandlers(rest.onFocus, onPrefetch)}>
                    <div className="flex min-w-0 items-center gap-3 pr-4">
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border border-border bg-background shadow-sm">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0.5 h-[275px] w-[200px] origin-top-left scale-[0.16] overflow-hidden">
                                <CardDocumentPreview blocks={doc.sub_blocks} />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <TruncatedTooltip text={title}>
                                <span className="block truncate text-sm font-semibold leading-5 text-foreground">
                                    {title}
                                </span>
                            </TruncatedTooltip>
                            <span
                                className={cn(
                                    'block max-w-[72ch] truncate text-xs leading-5 text-muted-foreground',
                                    isEmpty && 'italic'
                                )}>
                                {description}
                            </span>
                        </div>
                    </div>

                    <span className="hidden truncate pr-3 text-xs text-muted-foreground sm:block">
                        {formatRelative(doc.updated_at, locale)}
                    </span>
                    <span className="hidden truncate pr-3 text-xs text-muted-foreground sm:block">
                        {formatRelative(doc.created_at, locale)}
                    </span>

                    <div className="relative flex items-center">
                        {showStar && (
                            <DocumentStarButton
                                isLoading={isUpdatingStar}
                                onToggle={onToggleStar}
                                className="absolute right-0 z-10 transition-all"
                            />
                        )}
                        <div className="absolute right-0 z-10">
                            <SelectCheckbox
                                selected={selected}
                                disabled={isPending}
                                onToggle={onToggleSelect}
                                selectedClassName="border-primary-button bg-primary-button text-primary-foreground"
                                idleClassName="border-border bg-background opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            />
                        </div>
                    </div>
                </div>
            );
        }
    )
);

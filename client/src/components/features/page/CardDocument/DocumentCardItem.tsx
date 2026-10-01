import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import React from 'react';
import { CardDocumentPreview } from '../CardDocumentPreview';
import { DocumentStarButton } from '../DocumentStarButton';
import { composeHandlers, formatRelative } from './helpers';
import { SelectCheckbox } from './SelectCheckbox';
import { DocumentItemElementProps } from './types';

export const DocumentCardItem = React.memo(
    React.forwardRef<
        HTMLDivElement,
        DocumentItemElementProps & { deletedAtLabel?: string }
    >(function DocumentCardItem(
        {
            doc,
            title,
            selected,
            selectionActive,
            isTrash,
            isPending,
            isStarred,
            isUpdatingStar,
            deletedAtLabel,
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
        const showStar = !isTrash && !selectionActive && isStarred;

        return (
            <Card
                {...rest}
                ref={ref}
                role={isTrash || selectionActive ? 'button' : 'link'}
                tabIndex={0}
                className={cn(
                    'group relative flex h-[304px] w-full cursor-pointer flex-col overflow-hidden',
                    'transition-[border-color,box-shadow] duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
                    selected
                        ? 'border-primary ring-1 ring-primary/25'
                        : 'border-border-subtle hover:border-border-strong hover:shadow-md',
                    className
                )}
                onClick={composeHandlers(rest.onClick, onActivate)}
                onKeyDown={composeHandlers(rest.onKeyDown, onActivateKeyDown)}
                onMouseEnter={composeHandlers(rest.onMouseEnter, onPrefetch)}
                onFocus={composeHandlers(rest.onFocus, onPrefetch)}>
                {showStar && (
                    <DocumentStarButton
                        isLoading={isUpdatingStar}
                        onToggle={onToggleStar}
                        className="absolute right-3 top-3 z-10 transition-all"
                    />
                )}
                <div className="absolute right-3 top-3 z-10">
                    <SelectCheckbox
                        selected={selected}
                        disabled={isPending}
                        onToggle={onToggleSelect}
                        className="transition-all"
                        selectedClassName="opacity-100 bg-primary-button border-primary-button text-primary-foreground"
                        idleClassName="bg-background border-border opacity-100 hover:border-primary md:opacity-0 md:group-hover:opacity-100"
                    />
                </div>

                <CardHeader className="flex flex-shrink-0 flex-col p-4">
                    <div className="flex items-start justify-between gap-2 pr-16">
                        <div className="min-w-0 flex-1">
                            <TruncatedTooltip text={title}>
                                <CardTitle className="truncate text-sm">
                                    {title}
                                </CardTitle>
                            </TruncatedTooltip>
                            <CardDescription className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                                {doc.folder && (
                                    <span className="flex shrink-0 items-center gap-1">
                                        {doc.folder.icon}
                                        <span className="truncate">
                                            {doc.folder.name} •
                                        </span>
                                    </span>
                                )}
                                {isTrash && deletedAtLabel && (
                                    <>
                                        <span className="truncate">
                                            {deletedAtLabel}
                                        </span>
                                        <span aria-hidden="true">•</span>
                                    </>
                                )}
                                <span className="truncate">
                                    {t('updated', {
                                        time: formatRelative(
                                            doc.updated_at,
                                            locale
                                        ),
                                    })}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                    <Separator className="mt-2" />
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden px-4 pb-4">
                    <CardDocumentPreview blocks={doc.sub_blocks} />
                </CardContent>
            </Card>
        );
    })
);

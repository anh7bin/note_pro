'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const SIZE_CLASSES = {
    sm: 'max-w-[380px]',
    md: 'max-w-[440px]', // giữ nguyên cỡ mặc định hiện tại
    lg: 'max-w-[560px]',
    xl: 'max-w-[720px]',
} as const;

interface ModalProps
    extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
    trigger?: React.ReactElement;
    title: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    size?: keyof typeof SIZE_CLASSES;
    /** Kẻ đường viền giữa header/body/footer. Mặc định: true */
    bordered?: boolean;
    contentProps?: Omit<
        React.ComponentPropsWithoutRef<typeof DialogContent>,
        'children'
    >;
    headerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            trigger,
            title,
            description,
            children,
            footer,
            size = 'md',
            bordered = true,
            contentProps,
            headerClassName,
            titleClassName,
            descriptionClassName,
            bodyClassName,
            footerClassName,
            ...dialogProps
        },
        ref
    ) => {
        const { className: contentClassName, ...restContentProps } =
            contentProps ?? {};

        return (
            <Dialog {...dialogProps}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent
                    ref={ref}
                    {...(!description && { 'aria-describedby': undefined })}
                    {...restContentProps}
                    className={cn(
                        // p-0 sm:p-0: ghi đè cả padding responsive của DialogContent
                        'gap-0 overflow-hidden p-0 sm:p-0',
                        SIZE_CLASSES[size],
                        contentClassName
                    )}>
                    <DialogHeader
                        className={cn(
                            // pr-12 chừa chỗ cho nút X (absolute right-2, rộng 32px)
                            'gap-1 space-y-0 px-5 pb-4 pt-5 pr-12',
                            bordered && 'border-b',
                            headerClassName
                        )}>
                        <DialogTitle className={titleClassName}>
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className={descriptionClassName}>
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    {children && (
                        <div
                            className={cn(
                                'min-h-0 flex-1 overflow-y-auto px-5 py-4',
                                bodyClassName
                            )}>
                            {children}
                        </div>
                    )}

                    {footer && (
                        <DialogFooter
                            className={cn(
                                'flex-col-reverse items-stretch gap-2 px-5 py-3 sm:flex-row sm:items-center',
                                bordered ? 'bg-muted/40' : 'border-t-0',
                                footerClassName
                            )}>
                            {footer}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        );
    }
);
Modal.displayName = 'Modal';

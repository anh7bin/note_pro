'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface ModalProps
    extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
    trigger?: React.ReactElement;
    title: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    contentProps?: Omit<
        React.ComponentPropsWithoutRef<typeof DialogContent>,
        'children'
    >;
    headerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
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
            contentProps,
            headerClassName,
            titleClassName,
            descriptionClassName,
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
                    className={contentClassName}
                    {...restContentProps}>
                    <DialogHeader className={headerClassName}>
                        <DialogTitle className={titleClassName}>
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className={descriptionClassName}>
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    {children}
                    {footer && (
                        <DialogFooter className={footerClassName}>
                            {footer}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        );
    }
);
Modal.displayName = 'Modal';

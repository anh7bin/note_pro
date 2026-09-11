'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    variant?: 'default' | 'destructive';
    loading?: boolean;
}

export const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    variant = 'default',
    loading = false,
}: ConfirmDialogProps) => {
    const [isPending, setIsPending] = useState(false);
    const isBusy = loading || isPending;

    const handleConfirm = async () => {
        setIsPending(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            descriptionClassName="pt-1 leading-relaxed"
            contentProps={{ className: 'sm:max-w-sm' }}
            footer={
                <>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isBusy}>
                        {cancelText}
                    </Button>
                    <Button
                        size="sm"
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={isBusy}
                        aria-busy={isBusy}>
                        {isBusy ? 'Processing...' : confirmText}
                    </Button>
                </>
            }
        />
    );
};

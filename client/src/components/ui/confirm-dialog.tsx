'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useI18n } from '@/contexts/I18nContext';
import { useState } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description: React.ReactNode;
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
    confirmText,
    cancelText,
    onConfirm,
    variant = 'default',
    loading = false,
}: ConfirmDialogProps) => {
    const { t } = useI18n();
    const [isPending, setIsPending] = useState(false);
    const isBusy = loading || isPending;

    const handleOpenChange = (next: boolean) => {
        if (isBusy && !next) {
            return;
        }
        onOpenChange(next);
    };

    const handleConfirm = async () => {
        if (isBusy) {
            return;
        }
        setIsPending(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error('ConfirmDialog: onConfirm failed', error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            description={description}
            size="sm"
            bordered={false}
            footer={
                <>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isBusy}>
                        {cancelText ?? t('cancel')}
                    </Button>
                    <Button
                        size="sm"
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={isBusy}>
                        {isBusy ? t('processing') : confirmText}
                    </Button>
                </>
            }
        />
    );
};

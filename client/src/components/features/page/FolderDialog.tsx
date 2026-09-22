import { Button } from '@/components/ui/button';
import { IconPicker } from '@/components/ui/icon-picker';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export enum FolderMode {
    CREATE = 'create',
    UPDATE = 'update',
}

interface FolderData {
    name: string;
    description: string;
    icon: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: FolderMode;
    initialData?: Partial<FolderData>;
    onSubmit: (data: FolderData) => Promise<void>;
}

export const IconDefault = '📁';

export const FolderDialog = ({
    open,
    onOpenChange,
    mode,
    initialData,
    onSubmit,
}: Props) => {
    const [folderData, setFolderData] = useState<FolderData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        icon: initialData?.icon || IconDefault,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        if (open && initialData) {
            setFolderData({
                name: initialData.name || '',
                description: initialData.description || '',
                icon: initialData.icon || IconDefault,
            });
        }
    }, [open, initialData]);

    const handleInputChange = (
        field: keyof FolderData,
        value: string | React.ComponentType<unknown>
    ) => {
        setFolderData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(folderData);
            if (mode === FolderMode.CREATE) {
                setFolderData({
                    name: '',
                    description: '',
                    icon: IconDefault,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={
                mode === FolderMode.CREATE ? t('createFolderTitle') : t('edit')
            }
            description={
                mode === FolderMode.CREATE
                    ? t('createFolderDescription')
                    : t('editFolderDescription')
            }
            contentProps={{ className: 'sm:max-w-[400px]' }}
            footer={
                <>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}>
                        {t('cancel')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!folderData.name.trim() || isSubmitting}
                        aria-busy={isSubmitting}>
                        {isSubmitting
                            ? t('saving')
                            : mode === FolderMode.CREATE
                              ? t('create')
                              : t('update')}
                    </Button>
                </>
            }>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                        {t('name')} <span className="text-destructive">*</span>
                    </Label>
                    <InputField
                        id="title"
                        placeholder={t('folderName')}
                        value={folderData.name}
                        onChange={(e) =>
                            handleInputChange('name', e.target.value)
                        }
                        required
                        aria-required="true"
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="description"
                        className="text-sm font-medium">
                        {t('description')}
                    </Label>
                    <Textarea
                        id="description"
                        placeholder={t('folderDescriptionPlaceholder')}
                        value={folderData.description}
                        onChange={(e) =>
                            handleInputChange('description', e.target.value)
                        }
                        className="resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">{t('icon')}</Label>
                    <IconPicker
                        selectedIcon={folderData.icon}
                        onIconChange={(icon) => handleInputChange('icon', icon)}
                    />
                </div>
            </div>
        </Modal>
    );
};
